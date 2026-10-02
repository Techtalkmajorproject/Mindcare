const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const { db, admin } = require("../firebaseAdmin");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const ML_SERVICE_URL =
    process.env.ML_SERVICE_URL ||
    "http://127.0.0.1:8001";


const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        if (
            !file.mimetype ||
            !file.mimetype.startsWith("image/")
        ) {
            return cb(
                new Error(
                    "Only image files are allowed."
                )
            );
        }

        cb(null, true);
    }
});


async function verifyScreeningOwnership(
    screeningId,
    uid
) {

    const screeningRef = db
        .collection("screenings")
        .doc(screeningId);

    const snapshot =
        await screeningRef.get();

    if (!snapshot.exists) {

        const error =
            new Error(
                "Screening not found."
            );

        error.statusCode = 404;

        throw error;
    }

    const screening =
        snapshot.data();

    if (
        screening.conductedBy !== uid
    ) {

        const error =
            new Error(
                "You are not authorized to modify this screening."
            );

        error.statusCode = 403;

        throw error;
    }

    return screeningRef;
}


async function sendToMlService(
    endpoint,
    file
) {

    const form =
        new FormData();

    form.append(
        "file",
        file.buffer,
        {
            filename:
                file.originalname ||
                "image",
            contentType:
                file.mimetype
        }
    );

    const response =
        await axios.post(
            `${ML_SERVICE_URL}${endpoint}`,
            form,
            {
                headers:
                    form.getHeaders(),

                maxBodyLength:
                    Infinity,

                timeout:
                    120000
            }
        );

    return response.data;
}


router.post(
    "/drawing",
    authMiddleware,
    upload.single("drawing"),
    async (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    error:
                        "Drawing image is required."
                });
            }

            const {
                screeningId
            } = req.body;

            if (!screeningId) {
                return res.status(400).json({
                    error:
                        "screeningId is required."
                });
            }

            const screeningRef =
                await verifyScreeningOwnership(
                    screeningId,
                    req.user.uid
                );

            const result =
                await sendToMlService(
                    "/predict/drawing",
                    req.file
                );

            await screeningRef.update({

                "analysis.drawing": {
                    ...result,
                    analyzedBy:
                        req.user.uid,
                    analyzedAt:
                        admin.firestore.FieldValue.serverTimestamp()
                },

                updatedAt:
                    admin.firestore.FieldValue.serverTimestamp()
            });

            return res.json({
                screeningId,
                ...result
            });

        } catch (error) {

            console.error(
                "Drawing ML error:",
                error
            );

            const status =
                error.statusCode ||
                error.response?.status ||
                500;

            return res.status(status).json({
                error:
                    error.response?.data?.detail ||
                    error.message ||
                    "Drawing analysis failed."
            });
        }
    }
);


router.post(
    "/facial",
    authMiddleware,
    upload.single("face"),
    async (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    error:
                        "Face image is required."
                });
            }

            const {
                screeningId
            } = req.body;

            if (!screeningId) {
                return res.status(400).json({
                    error:
                        "screeningId is required."
                });
            }

            const screeningRef =
                await verifyScreeningOwnership(
                    screeningId,
                    req.user.uid
                );

            const result =
                await sendToMlService(
                    "/predict/facial",
                    req.file
                );

            await screeningRef.update({

                "analysis.facial": {
                    ...result,
                    analyzedBy:
                        req.user.uid,
                    analyzedAt:
                        admin.firestore.FieldValue.serverTimestamp()
                },

                updatedAt:
                    admin.firestore.FieldValue.serverTimestamp()
            });

            return res.json({
                screeningId,
                ...result
            });

        } catch (error) {

            console.error(
                "Facial ML error:",
                error
            );

            const status =
                error.statusCode ||
                error.response?.status ||
                500;

            return res.status(status).json({
                error:
                    error.response?.data?.detail ||
                    error.message ||
                    "Facial analysis failed."
            });
        }
    }
);


module.exports = router;
