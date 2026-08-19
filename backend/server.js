const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const { db, admin } = require("./firebaseAdmin");
const verifyToken = require("./middlewares/authMiddleware");

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Express backend is running"
  });
});

// Auth Routes
// Real auth is handled client-side with Firebase. We can create a user doc when they register.
app.post("/api/auth/register", verifyToken, async (req, res) => {
  try {
    const { role, name, email } = req.body;
    const uid = req.user.uid;
    await db.collection("users").doc(uid).set({
      name,
      email,
      role: role || 'psychologist',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ success: true, uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/auth/me", verifyToken, async (req, res) => {
  try {
    const doc = await db.collection("users").doc(req.user.uid).get();
    if (!doc.exists) return res.status(404).json({ error: "User profile not found" });
    res.json({ id: req.user.uid, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Children Routes
app.get("/api/children", verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection("children")
      .where("createdBy", "==", req.user.uid)
      .orderBy("createdAt", "desc")
      .get();
    const childrenList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(childrenList);
  } catch (error) {
    if (error.message && error.message.includes("index")) {
      // Fallback if index missing
      const snapshot = await db.collection("children").where("createdBy", "==", req.user.uid).get();
      const childrenList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      return res.json(childrenList);
    }
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/children", verifyToken, async (req, res) => {
  try {
    const { name, dateOfBirth, age, gender, parentName, parentContact } = req.body;

    if (!name || !dateOfBirth) {
      return res.status(400).json({ error: "Missing required child fields" });
    }

    const newChildRef = await db.collection("children").add({
      name,
      dateOfBirth: dateOfBirth instanceof admin.firestore.Timestamp ? dateOfBirth : admin.firestore.Timestamp.fromDate(new Date(dateOfBirth)),
      age: Number(age),
      gender,
      parentName,
      parentContact,
      createdBy: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, childId: newChildRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/children/:id", verifyToken, async (req, res) => {
  try {
    const doc = await db.collection("children").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "Child not found" });

    const child = doc.data();
    if (child.createdBy !== req.user.uid) return res.status(403).json({ error: "Unauthorized access to child" });

    res.json({ id: doc.id, ...child });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/children/:id", verifyToken, async (req, res) => {
  try {
    const docRef = db.collection("children").doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Child not found" });

    const child = doc.data();
    if (child.createdBy !== req.user.uid) return res.status(403).json({ error: "Unauthorized access to child" });

    const { name, dateOfBirth, age, gender, parentName, parentContact } = req.body;
    await docRef.update({
      ...(name && { name }),
      ...(dateOfBirth && { dateOfBirth: admin.firestore.Timestamp.fromDate(new Date(dateOfBirth)) }),
      ...(age && { age: Number(age) }),
      ...(gender && { gender }),
      ...(parentName && { parentName }),
      ...(parentContact && { parentContact }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/children/:id", verifyToken, async (req, res) => {
  try {
    const docRef = db.collection("children").doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Child not found" });
    if (doc.data().createdBy !== req.user.uid) return res.status(403).json({ error: "Unauthorized access to child" });

    await docRef.delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/children/:id/screenings", verifyToken, async (req, res) => {
  try {
    const childDoc = await db.collection("children").doc(req.params.id).get();
    if (!childDoc.exists) return res.status(404).json({ error: "Child not found" });
    if (childDoc.data().createdBy !== req.user.uid) return res.status(403).json({ error: "Unauthorized access to child" });

    let snapshot;
    try {
      snapshot = await db.collection("screenings")
        .where("childId", "==", req.params.id)
        .orderBy("createdAt", "desc")
        .get();
    } catch (idxErr) {
      snapshot = await db.collection("screenings").where("childId", "==", req.params.id).get();
    }

    let screenings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (screenings.length > 0 && !snapshot.query._queryOptions?.orderBy) {
      screenings = screenings.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
    }

    res.json(screenings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Screening Routes
app.post("/api/screenings", verifyToken, async (req, res) => {
  try {
    const { childId } = req.body;
    if (!childId) return res.status(400).json({ error: "childId is required" });

    // Verify child ownership
    const childDoc = await db.collection("children").doc(childId).get();
    if (!childDoc.exists) return res.status(404).json({ error: "Child not found" });
    if (childDoc.data().createdBy !== req.user.uid) return res.status(403).json({ error: "Unauthorized access to child" });

    const newRef = await db.collection("screenings").add({
      childId,
      conductedBy: req.user.uid,
      status: 'created',
      startedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, screeningId: newRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/screenings/:id", verifyToken, async (req, res) => {
  try {
    const doc = await db.collection("screenings").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "Screening not found" });

    const screening = doc.data();
    if (screening.conductedBy !== req.user.uid) return res.status(403).json({ error: "Unauthorized access to screening" });

    res.json({ id: doc.id, ...screening });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/screenings/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['created', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });

    const docRef = db.collection("screenings").doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Screening not found" });
    if (doc.data().conductedBy !== req.user.uid) return res.status(403).json({ error: "Unauthorized access to screening" });

    const updateData = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    if (status === 'completed') {
      updateData.completedAt = admin.firestore.FieldValue.serverTimestamp();
    }

    await docRef.update(updateData);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/screenings/:id/drawing", verifyToken, upload.single('file'), (req, res) => res.json({ success: true }));
app.post("/api/screenings/:id/facial-observation", verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const imagePath = path.resolve(req.file.path);
  const pythonScript = path.resolve(__dirname, '../models/facial/predict.py');

  const pythonExecute = `python "${pythonScript}" "${imagePath}"`;

  exec(pythonExecute, async (error, stdout, stderr) => {
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (e) { }

    if (error) {
      console.error(`Error executing python script: ${error}`);
      return res.status(500).json({ error: 'Failed to process image' });
    }

    const emotionMatch = stdout.match(/Predicted emotion:\s*(.+)/);
    const confidenceMatch = stdout.match(/Confidence:\s*(.+)/);

    const emotion = emotionMatch ? emotionMatch[1].trim() : 'Unknown';
    const confidenceStr = confidenceMatch ? confidenceMatch[1].trim() : '0%';
    const riskLevel = (emotion === 'happy' || emotion === 'surprise' || emotion === 'neutral') ? 'low' : (emotion === 'fear' || emotion === 'angry' || emotion === 'sad' || emotion === 'disgust' ? 'high' : 'moderate');

    const result = {
      riskLevel: riskLevel,
      logic: `Facial analysis detected ${emotion} with ${confidenceStr} confidence.`,
      emotion,
      confidence: confidenceStr
    };

    try {
      await db.collection("screenings").doc(req.params.id).update({
        analysisResult: result,
        status: 'completed',
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});
app.post("/api/screenings/:id/context", verifyToken, (req, res) => res.json({ success: true }));

// Analysis Routes
app.post("/api/screenings/:id/analyze", verifyToken, (req, res) => res.json({ success: true }));
app.get("/api/screenings/:id/analysis-status", verifyToken, (req, res) => res.json({ status: 'completed' }));
app.get("/api/screenings/:id/results", verifyToken, async (req, res) => {
  try {
    const doc = await db.collection("screenings").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "Screening not found" });
    const screening = doc.data();
    const baseResponse = { childId: screening.childId, screeningId: req.params.id };
    if (screening.analysisResult) {
      res.json({ ...baseResponse, ...screening.analysisResult });
    } else {
      res.json({ ...baseResponse, riskLevel: 'low', logic: 'No actual visual inputs processed.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Report Routes
// Report Routes
app.post("/api/reports", verifyToken, async (req, res) => {
  try {
    const { childId, screeningId } = req.body;
    if (!childId || !screeningId) {
      return res.status(400).json({ error: "childId and screeningId are required" });
    }

    // Verify child ownership
    const childDoc = await db.collection("children").doc(childId).get();
    if (!childDoc.exists) return res.status(404).json({ error: "Child not found" });
    if (childDoc.data().createdBy !== req.user.uid) return res.status(403).json({ error: "Unauthorized access to child" });

    // Verify screening ownership
    const screeningDoc = await db.collection("screenings").doc(screeningId).get();
    if (!screeningDoc.exists) return res.status(404).json({ error: "Screening not found" });
    if (screeningDoc.data().conductedBy !== req.user.uid) return res.status(403).json({ error: "Unauthorized access to screening" });

    const newReportRef = await db.collection("reports").add({
      childId,
      screeningId,
      generatedBy: req.user.uid,
      status: "draft",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, reportId: newReportRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/reports/:id", verifyToken, async (req, res) => {
  try {
    const doc = await db.collection("reports").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "Report not found" });

    const report = doc.data();
    if (report.generatedBy !== req.user.uid) return res.status(403).json({ error: "Unauthorized access to report" });

    res.json({ id: doc.id, ...report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/reports/:id", verifyToken, async (req, res) => {
  try {
    const docRef = db.collection("reports").doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Report not found" });

    const report = doc.data();
    if (report.generatedBy !== req.user.uid) return res.status(403).json({ error: "Unauthorized access to report" });

    const allowedFields = req.body;
    delete allowedFields.generatedBy;
    delete allowedFields.createdAt;
    delete allowedFields.childId;
    delete allowedFields.screeningId;

    await docRef.update({
      ...allowedFields,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});