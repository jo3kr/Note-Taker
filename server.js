const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static files
app.use(express.static(path.join(__dirname, "public")));

// html routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// API routes
app
  .route("/api/notes")
  .get((req, res) => {
    fs.readFile("db/db.json", "utf8", (err, data) => {
      if (err) throw err;
      res.json(JSON.parse(data));
    });
  })
  .post((req, res) => {
    const newNote = req.body;
    fs.readFile("db/db.json", "utf8", (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      newNote.id = notes.length + 1;
      notes.push(newNote);
      fs.writeFile("db/db.json", JSON.stringify(notes), (err) => {
        if (err) throw err;
        res.json(newNote);
      });
    });
  });

app.delete("/api/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id);
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    fs.writeFile("db/db.json", JSON.stringify(updatedNotes), (err) => {
      if (err) throw err;
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});