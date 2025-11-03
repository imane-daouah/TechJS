const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const PORT = 3000;

// 🟢 Connexion à MongoDB locale
mongoose.connect("mongodb://127.0.0.1:27017/booksDB")
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => console.error("❌ Erreur de connexion à MongoDB :", err));

// 🔹 Modèle de livre
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true }
});
const Book = mongoose.model("Book", bookSchema);

// 🔐 Authentification factice
let isAuthenticated = false;

function checkAuth(req, res, next) {
  if (isAuthenticated) next();
  else res.status(403).json({ message: "⛔ Accès refusé : veuillez vous connecter !" });
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    isAuthenticated = true;
    res.json({ message: "✅ Authentification réussie !" });
  } else {
    res.status(401).json({ message: "❌ Identifiants incorrects" });
  }
});

// 📚 Lister tous les livres
app.get("/books", checkAuth, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ➕ Ajouter un nouveau livre
app.post("/books", checkAuth, async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: "⚠️ Titre et auteur sont requis." });
    }
    const newBook = new Book({ title, author });
    await newBook.save();
    res.json({ message: "📘 Livre ajouté avec succès", book: newBook });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
