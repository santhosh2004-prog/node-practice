const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ---------- MULTER STORAGE ---------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

const filePath = path.join(__dirname, "data.txt");

/* ---------- SAVE TEXT ---------- */

app.post("/save", async (req, res) => {
  try {
    const text = req.body.text;

    await fs.writeFile(filePath, text);

    res.json({ message: "File saved successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------- READ LATEST FILE ---------- */

app.get("/read", async (req, res) => {
  try {

    const uploadsDir = path.join(__dirname, "uploads");
    const files = await fs.readdir(uploadsDir);

    if (files.length === 0) {
      return res.json({ content: "No uploaded files found." });
    }

    const latestFile = files[files.length - 1];
    const latestFilePath = path.join(uploadsDir, latestFile);

    const ext = path.extname(latestFile).toLowerCase();

    const textExtensions = [".txt", ".js", ".json", ".html", ".css", ".py"];

    if (textExtensions.includes(ext)) {
      const data = await fs.readFile(latestFilePath, "utf8");

      res.json({
        filename: latestFile,
        content: data
      });

    } else {
      res.json({
        filename: latestFile,
        message: "Binary file detected. Cannot display content.",
        download: `/file/${latestFile}`
      });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------- UPLOAD FILE ---------- */

app.post("/upload", upload.single("file"), async (req, res) => {
  try {

    const uploadedFile = req.file.filename;
    const uploadedPath = req.file.path;

    const ext = path.extname(uploadedFile).toLowerCase();

    const textExtensions = [".txt", ".js", ".json", ".html", ".css", ".py"];

    if (textExtensions.includes(ext)) {

      const content = await fs.readFile(uploadedPath, "utf8");

      res.json({
        filename: uploadedFile,
        content: content
      });

    } else {

      res.json({
        filename: uploadedFile,
        message: "Binary file uploaded successfully",
        download: `/file/${uploadedFile}`
      });

    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------- OPEN FILE ---------- */

app.get("/file/:name", (req, res) => {
  const file = path.join(__dirname, "uploads", req.params.name);
  res.sendFile(file);
});

/* ---------- START SERVER ---------- */

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
