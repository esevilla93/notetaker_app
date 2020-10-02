const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});


app.get("/api/notes", function (req, res) {
    fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data);
        res.json(notes);
    })

});


app.post("/api/notes", function (req, res) {
    fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNotes = req.body;
        const uniqueId = (notes.length).toString();
        newNotes.id = uniqueId;
        notes.push(newNotes);


        const createNotes = JSON.stringify(notes);
        fs.writeFile(path.join(__dirname, "./db/db.json"), createNotes, function (err, data) {
            if (err) throw err;
        });
        res.json(newNotes);
    })

});


app.delete("/api/notes/:id", function (req, res) {
    const noteId = req.params.id;
    fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data);
        const notesArray = notes.filter(item => {
            return item.id !== noteId
        });
        fs.writeFile('./db/db.json', JSON.stringify(notesArray), function (err, data) {
            if (err) throw err;
            res.json(notesArray)

        });
    });

});



app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
