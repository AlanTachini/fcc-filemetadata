var express = require("express");
var multer = require("multer");
var cors = require("cors");
require("dotenv").config();

var app = express();

app.use(cors());
app.use(express.urlencoded({ extends: true }));
app.use("/public", express.static(process.cwd() + "/public"));

let tamanhoEmMB = process.env.MAX_FILE_SIZE || 10;
let limiteTamanho = tamanhoEmMB * 1024 * 1024;
// Apenas em memória
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: limiteTamanho },
});

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", function (req, res) {
  upload.single("upfile")(req, res, function (err) {
    if (err) {
      let mensagemErro =
        err.code === "LIMIT_FILE_SIZE"
          ? `Arquivo passa do tamanho limite de ${limiteTamanho}`
          : "Falha no upload";
      return res.status(400).json({ error: mensagemErro });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const { originalname, mimetype, size } = req.file;
    res.json({ name: originalname, type: mimetype, size: size });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function () {
  console.log("Your app is listening on port " + port);
});
