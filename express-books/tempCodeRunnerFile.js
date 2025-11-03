const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3000;

let books = [
  { id: 1, title: "Harry Potter", author: "J.K. Rowling" },
  { id: 2, title: "Le Petit Prince", author: "Antoine de Saint-Exupéry" }
];

let isAuthenticated = false;

// Middleware 
function checkAuth(req, res, next) {
  if (isAuthenticated) {
    next();
  } else {
    res.status(403).json({ message: "Accès refusé : veuillez vous connecter " });
  }
}

// Route de connexion
app.post("/login", (req, res) => {
  console.log("Requête reçue :", req.body); 
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: " Nom d'utilisateur et mot de passe requis." });
  }

  if (username === "admin" && password === "admin") {
    isAuthenticated = true;
    res.json({ message: "✅Authentification réussie " });
  } else {
    res.status(401).json({ message: " Identifiants incorrects" });
  }
});

// Route GET pour afficher les livres (protégée)
app.get("/books", checkAuth, (req, res) => {
  res.json(books);
});

// Route POST pour ajouter un livre (protégée)
app.post("/books", checkAuth, (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: " Titre et auteur sont requis." });
  }

  const newBook = { id: books.length + 1, title, author };
  books.push(newBook);

  res.json({ message: " Livre ajouté avec succès", book: newBook });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
});
