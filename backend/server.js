const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// In-memory mock data
const children = [
  { id: '1', name: 'Alice Smith', age: 6, code: 'C-001' },
];
const screenings = {};
const reports = {};

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Express backend is running"
  });
});

// Auth Routes
app.post("/api/auth/login", (req, res) => res.json({ token: "mock-token", user: { id: 1, role: 'psychologist' } }));
app.post("/api/auth/logout", (req, res) => res.json({ success: true }));
app.get("/api/auth/me", (req, res) => res.json({ id: 1, role: 'psychologist', name: 'Dr. Jane' }));

// Children Routes
app.get("/api/children", (req, res) => res.json(children));
app.post("/api/children", (req, res) => {
  const newChild = { id: String(Date.now()), ...req.body };
  children.push(newChild);
  res.json(newChild);
});
app.get("/api/children/:id", (req, res) => {
  const child = children.find(c => c.id === req.params.id);
  child ? res.json(child) : res.status(404).json({ error: "Child not found" });
});

// Screening Routes
app.post("/api/screenings", (req, res) => {
  const id = String(Date.now());
  const newScreening = { id, childId: req.body.childId, status: 'pending' };
  screenings[id] = newScreening;
  res.json(newScreening);
});
app.get("/api/screenings/:id", (req, res) => {
  const screening = screenings[req.params.id];
  screening ? res.json(screening) : res.status(404).json({ error: "Screening not found" });
});
app.post("/api/screenings/:id/drawing", (req, res) => res.json({ success: true }));
app.post("/api/screenings/:id/facial-observation", (req, res) => res.json({ success: true }));
app.post("/api/screenings/:id/context", (req, res) => res.json({ success: true }));

// Analysis Routes
app.post("/api/screenings/:id/analyze", (req, res) => res.json({ success: true }));
app.get("/api/screenings/:id/analysis-status", (req, res) => res.json({ status: 'completed' }));
app.get("/api/screenings/:id/results", (req, res) => res.json({ riskLevel: 'low', logic: 'mock' }));

// Report Routes
app.get("/api/screenings/:id/report", (req, res) => res.json(reports[req.params.id] || { content: '' }));
app.put("/api/screenings/:id/report", (req, res) => {
  reports[req.params.id] = req.body;
  res.json(reports[req.params.id]);
});
app.post("/api/screenings/:id/report/approve", (req, res) => res.json({ success: true }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});