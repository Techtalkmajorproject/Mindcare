import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2, Eraser, Undo, Redo, Trash2, Camera, Video, Square, Image as ImageIcon } from 'lucide-react';

export default function ScreeningWorkspace() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Canvas state
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [mode, setMode] = useState<'draw' | 'erase'>('draw');
    const [history, setHistory] = useState<ImageData[]>([]);
    const [historyStep, setHistoryStep] = useState(-1);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    // Camera state
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [cameraState, setCameraState] = useState<'initial' | 'ready' | 'recording' | 'completed' | 'error'>('initial');
    const [recordingTime, setRecordingTime] = useState(0);
    const [sessionTime, setSessionTime] = useState(0);
    const [, setRecordedBlob] = useState<Blob | null>(null);
    const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

    // Timer effect
    useEffect(() => {
        const interval = setInterval(() => setSessionTime(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    // Recording timer effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (cameraState === 'recording') {
            interval = setInterval(() => setRecordingTime(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [cameraState]);

    // Attach stream to video on render
    useEffect(() => {
        if ((cameraState === 'ready' || cameraState === 'recording') && videoRef.current && streamRef.current) {
            if (videoRef.current.srcObject !== streamRef.current) {
                videoRef.current.srcObject = streamRef.current;
            }
        }
    }, [cameraState]);

    // Format time
    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Initialize canvas
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
            setCtx(context);
            if (history.length === 0) {
                saveState(canvas);
            }
        }
    }, [canvasRef, uploadedImage]); // re-init when uploadedImage changes as canvas might remount

    // Drawing functions
    const saveState = (canvas: HTMLCanvasElement) => {
        const context = canvas.getContext('2d');
        if (!context) return;
        const state = context.getImageData(0, 0, canvas.width, canvas.height);
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(state);
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!ctx) return;
        setIsDrawing(true);
        const { offsetX, offsetY } = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);

        ctx.lineWidth = mode === 'erase' ? 20 : 3;
        ctx.strokeStyle = mode === 'erase' ? 'white' : 'black';
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !ctx) return;
        e.preventDefault();
        const { offsetX, offsetY } = getCoordinates(e);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing || !ctx) return;
        ctx.closePath();
        setIsDrawing(false);
        if (canvasRef.current) {
            saveState(canvasRef.current);
        }
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        if (!canvasRef.current) return { offsetX: 0, offsetY: 0 };
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        let clientX = 0;
        let clientY = 0;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        return {
            offsetX: clientX - rect.left,
            offsetY: clientY - rect.top
        };
    };

    const undo = () => {
        if (historyStep > 0 && ctx && canvasRef.current) {
            setHistoryStep(historyStep - 1);
            ctx.putImageData(history[historyStep - 1], 0, 0);
        }
    };

    const redo = () => {
        if (historyStep < history.length - 1 && ctx && canvasRef.current) {
            setHistoryStep(historyStep + 1);
            ctx.putImageData(history[historyStep + 1], 0, 0);
        }
    };

    const clearCanvas = () => {
        if (!ctx || !canvasRef.current) return;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        saveState(canvasRef.current);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImage(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // Camera functions
    const enableCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            setCameraState('ready');
        } catch (err) {
            console.error(err);
            setCameraState('error');
        }
    };

    const startRecording = () => {
        if (!streamRef.current) return;
        const stream = streamRef.current;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const chunks: BlobPart[] = [];
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            setRecordedBlob(blob);
            setRecordingUrl(URL.createObjectURL(blob));
            setCameraState('completed');
        };

        mediaRecorder.start(1000);
        setCameraState('recording');
        setRecordingTime(0);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            const stream = streamRef.current;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            streamRef.current = null;
        }
    };

    const handleFinish = () => {
        navigate(`/screenings/${id}/analyze`);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate(`/children/${id}`)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="font-bold text-slate-800">Screening Session for {id}</h2>
                        <div className="flex items-center mt-1 text-sm text-slate-500 space-x-3">
                            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Active Session</span>
                            <span>•</span>
                            <span>Timer: {formatTime(sessionTime)}</span>
                        </div>
                    </div>
                </div>
                <button onClick={handleFinish} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors">Finish & Analyze</button>
            </div>

            {/* Main Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* LEFT: Drawing Workspace */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                        <h3 className="font-semibold text-slate-800 flex items-center"><Edit2 className="w-4 h-4 mr-2" /> Drawing Workspace</h3>

                        {!uploadedImage && (
                            <div className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                                <button onClick={() => setMode('draw')} className={`p-1.5 rounded ${mode === 'draw' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`} title="Brush">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => setMode('erase')} className={`p-1.5 rounded ${mode === 'erase' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`} title="Eraser">
                                    <Eraser className="w-4 h-4" />
                                </button>
                                <div className="w-px bg-slate-200 mx-1"></div>
                                <button onClick={undo} disabled={historyStep <= 0} className="p-1.5 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-50" title="Undo"><Undo className="w-4 h-4" /></button>
                                <button onClick={redo} disabled={historyStep >= history.length - 1} className="p-1.5 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-50" title="Redo"><Redo className="w-4 h-4" /></button>
                                <div className="w-px bg-slate-200 mx-1"></div>
                                <button onClick={clearCanvas} className="p-1.5 rounded text-red-500 hover:bg-red-50" title="Clear Canvas"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-center items-center bg-slate-100 relative min-h-[400px]">
                        {uploadedImage ? (
                            <div className="relative w-full h-full flex flex-col items-center justify-center space-y-4">
                                <img src={uploadedImage} alt="Uploaded drawing" className="max-w-full max-h-[400px] object-contain bg-white shadow-sm" />
                                <button onClick={() => setUploadedImage(null)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Remove Image</button>
                            </div>
                        ) : (
                            <canvas
                                ref={canvasRef}
                                width={600}
                                height={400}
                                className="bg-white shadow border border-slate-200 cursor-crosshair max-w-full touch-none"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseOut={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                            />
                        )}
                    </div>

                    {!uploadedImage && (
                        <div className="p-3 border-t border-slate-200 bg-slate-50 text-center">
                            <label className="text-sm text-blue-600 font-medium cursor-pointer hover:underline flex items-center justify-center">
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Or Upload Existing Drawing
                                <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>
                    )}
                </div>

                {/* RIGHT: Camera Observation */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                        <h3 className="font-semibold text-slate-800 flex items-center"><Camera className="w-4 h-4 mr-2" /> Camera Observation</h3>
                        {cameraState === 'recording' && (
                            <div className="flex items-center text-red-500 text-sm font-medium animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                                ON {formatTime(recordingTime)}
                            </div>
                        )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-center items-center bg-slate-900 relative min-h-[400px]">
                        {cameraState === 'initial' && (
                            <div className="text-center p-8 bg-slate-800 rounded-xl border border-slate-700 text-white max-w-md">
                                <Video className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h4 className="text-lg font-medium mb-2">Camera Access Required</h4>
                                <p className="text-sm text-slate-400 mb-6">Camera recording will capture the child's drawing session and facial expressions for AI analysis.</p>
                                <button onClick={enableCamera} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">Enable Camera</button>
                            </div>
                        )}

                        {(cameraState === 'ready' || cameraState === 'recording') && (
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover max-h-[400px]"
                            />
                        )}

                        {cameraState === 'completed' && recordingUrl && (
                            <div className="w-full max-h-[400px] flex flex-col items-center justify-center p-4">
                                <video src={recordingUrl} controls className="w-full max-h-[300px] bg-black mb-4 rounded shadow-md" />
                                <div className="text-white text-center">
                                    <p className="font-medium text-green-400 mb-2 flex items-center justify-center"><CheckCircle className="w-4 h-4 mr-2" /> Recording Completed</p>
                                    <p className="text-sm text-slate-400">Duration: {formatTime(recordingTime)}</p>
                                    <button onClick={() => { setCameraState('initial'); setRecordingUrl(null); }} className="mt-4 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 text-sm">Retake Recording</button>
                                </div>
                            </div>
                        )}

                        {cameraState === 'error' && (
                            <div className="text-center text-red-400 p-8">
                                <p>Unable to access the camera. Please check permissions.</p>
                                <button onClick={enableCamera} className="mt-4 px-4 py-2 border border-red-500 rounded text-red-500 hover:bg-red-500 hover:text-white transition-colors">Retry Again</button>
                            </div>
                        )}
                    </div>

                    {/* Camera Controls Footer */}
                    {(cameraState === 'ready' || cameraState === 'recording') && (
                        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-center border-t-2">
                            {cameraState === 'ready' ? (
                                <button onClick={startRecording} className="flex items-center px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium shadow-sm transition-colors">
                                    <div className="w-3 h-3 rounded-full bg-white mr-2" /> Start Recording
                                </button>
                            ) : (
                                <button onClick={stopRecording} className="flex items-center px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-full font-medium shadow-sm transition-colors">
                                    <Square className="w-4 h-4 mr-2" /> Stop Recording
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Dummy standard icon since lucide might not export CheckCircle implicitly in all setups, though it usually does. I will add a tiny helper component.
function CheckCircle({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
}
