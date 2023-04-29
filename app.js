const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const app = express();
const upload = multer();

app.post("/ocr", upload.single("image"), async (req, res) => {
  try {
    Tesseract.recognize(req.file.buffer, "ind", {
      logger: (m) => console.log(m),
    })
      .then(({ data }) => {
        const result = data.text.trim().split("\n");
        console.log(result);
        const name = result[4].replace("Nama", "");
        const placeOfBirth = result[5]
          .replace(/[-n:,\s]/g, "")
          .replace("TempayTgiLahir", "")
          .replace("TempatTglLahir", "")
          .split(" ")
          .join("");
        const religion = result[10]
          .replace(/[-n:,\s]/g, "")
          .replace("Agama", "")
          .split(" ")
          .join("")
          .replace("n:", "")
          .replace("-", "");
        const statusMarried = result[11]
          .replace(/[-n:,\s]/g, "")
          .replace("StatusPerkawia", "")
          .replace("StatusPerkawinan", "");
        const job = result[12].replace("Pekerjaan", "").replace("Pekerjaa", "");
        return res.status(200).json({
          extract: result,
          error: null,
          message: "OCR extract Indonesia Success",
          data: {
            name,
            placeOfBirth,
            religion,
            statusMarried,
            job,
          },
          statusCode: 200,
          timestamps: new Date().getTime(),
        });
      })
      .catch((err) => {
        return res.status(500).json({
          extract: null,
          error: null,
          message: "OCR extract Indonesia failed",
          data: null,
          statusCode: 200,
          timestamps: new Date().getTime(),
        });
      });
  } catch (error) {
    return res.status(500).json({
      extract: null,
      error: null,
      message: "Failed to extract data from KTP image",
      data: null,
      statusCode: 200,
      timestamps: new Date().getTime(),
    });
  }
});

app.listen(3000, () => {
  console.log("OCR extract Indonesia KTP API listening on port 3000");
});
