const express = require("express");
const multer = require("multer");

const app = express();

app.use(express.json());

// memory storage (Vercel compatible)
const upload = multer({ storage: multer.memoryStorage() });

/* ---------- SAVE TEXT ---------- */
app.post("/save", async (req, res) => {
  const text = req.body.text;

  res.json({
    message: "Text received (not stored permanently)",
    content: text
  });
});

/* ---------- READ ---------- */
app.get("/read", async (req, res) => {
  res.json({
    content: "No stored data (Vercel limitation)"
  });
});

/* ---------- UPLOAD ---------- */
app.post("/upload", upload.single("file"), async (req, res) => {

  const file = req.file;

  const ext = file.originalname.split(".").pop().toLowerCase();
  const textExtensions = ["txt", "js", "json", "html", "css", "py"];

  if (textExtensions.includes(ext)) {
    const content = file.buffer.toString("utf8");

    res.json({
      filename: file.originalname,
      content
    });

  } else {
    res.json({
      filename: file.originalname,
      message: "Binary file uploaded"
    });
  }
});

/* ---------- EXPORT ---------- */
module.exports = app;