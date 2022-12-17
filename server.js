const path = require("path");
const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { mergePdfs } = require("./merge");
const fs = require("fs");
app.use("/static", express.static("public"));
let uploadsDir = path.join(__dirname, "uploads");
const port = 3000;

app.get("/", (req, res) => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  res.sendFile(path.join(__dirname, "templates/index.html"));
});

app.post(
  "/merge",
  upload.array("pdfs", Number.MAX_SAFE_INTEGER),
  async (req, res, next) => {
    await mergePdfs(req.files);

    fs.rm(uploadsDir, { recursive: true, force: true }, (err) => {
      if (err) {
        console.log(`There is an error in deleting ${uploadsDir}: ${err}`);
      }
    });

    res.redirect(`http://localhost:${port}/static/merged.pdf`);
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
