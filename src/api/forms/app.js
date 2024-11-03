const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express();

app.use(express.json());

// In-Memory-Datenbank (einfaches Array) für Benutzer und Items
let users = [];
let items = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
];

// Geheimschlüssel für JWT (In der Praxis sollte dieser in einer Umgebungsvariable gespeichert werden)
const SECRET_KEY = "meinSuperGeheimesJWTSecret";

// Middleware zur Verifizierung von Tokens
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
}

// Route: Benutzer registrieren
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  // Prüfen, ob der Benutzername bereits existiert
  const userExists = users.find((u) => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Passwort hashen und Benutzer speichern
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, username, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ message: "User registered successfully" });
});

// Route: Benutzer einloggen
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  // Passwort überprüfen
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  // JWT erstellen
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// Geschützte Routen: CRUD für Items (nur mit gültigem Token)
app.get("/api/items", authenticateToken, (req, res) => {
  res.json(items);
});

app.get("/api/items/:id", authenticateToken, (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = items.find((i) => i.id === itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  res.json(item);
});

app.post("/api/items", authenticateToken, (req, res) => {
  const newItem = {
    id: items.length + 1,
    name: req.body.name,
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.put("/api/items/:id", authenticateToken, (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = items.find((i) => i.id === itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  item.name = req.body.name;
  res.json(item);
});

app.delete("/api/items/:id", authenticateToken, (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = items.findIndex((i) => i.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }
  items.splice(itemIndex, 1);
  res.json({ message: "Item deleted" });
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
