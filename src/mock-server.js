const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple in-memory user store (for testing only)
const users = [];

function makeToken(email) {
  return Buffer.from(`${email}:${Date.now()}`).toString("base64");
}

app.post("/api/register", (req, res) => {
  const { name, email, password, password_confirmation } = req.body || {};
  if (!name || !email || !password) {
    return res.status(422).json({ message: "Missing required fields" });
  }
  if (password !== password_confirmation) {
    return res.status(422).json({ message: "Password confirmation does not match" });
  }
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ message: "Email already registered" });
  }
  const user = { id: users.length + 1, name, email };
  users.push({ ...user, password });
  const token = makeToken(email);
  return res.status(201).json({ token, user });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};
  const u = users.find((x) => x.email === email && x.password === password);
  if (!u) return res.status(401).json({ message: "Invalid credentials" });
  const token = makeToken(email);
  return res.json({ token, user: { id: u.id, name: u.name, email: u.email } });
});

app.post("/api/logout", (req, res) => {
  return res.json({ message: "Logged out (mock)" });
});

const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`Mock server running on http://localhost:${port}`));
