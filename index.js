const express = require("express");
const bodyParser = require('body-parser');
const ws = require("ws");
const fs = require("fs");
const os = require('os'); 

require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const http = require("http");
const server = http.createServer(app);

const stellar_toml_path = process.env.STELLAR_TOML_FILE_PATH;

function insertNewNFTtoTOML(code, issuer, name, desc, image, display_decimals) {

  const dirPath = `${stellar_toml_path}/.well-known`;

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  const fileName = 'stellar.toml';
  const filePath = `${dirPath}/${fileName}`;

  console.log("filePath", filePath);

  let data = "\n[[CURRENCIES]]\n";
  data = data + "code=\"" + code + "\"\n";
  data = data + "issuer=\"" + issuer + "\"\n";
  data = data + "name=\"" + name + "\"\n";
  data = data + "desc=\"" + desc + "\"\n";
  data = data + "image=\"" + image + "\"\n";
  data = data + "display_decimals=\"" + display_decimals + "\"\n";
  
  try {
    fs.writeFileSync(filePath, data, {flag: 'a+'});
    return {
      ok: true,
      error: null
    }
  } catch(err) {
    console.log(err);
    return {
      ok: false,
      error: err
    }
  }
}
// insertNewNFTtoTOML("MSNFT", "", "NFT", "It is for test", "https://test.com", "7");

app.get("/", (req, res) => {
  res.send("Welcome to CORS server 😁");
});

app.get("/cors", (req, res) => {
  res.send("This has CORS enabled 🎈");
});

app.post("/insert_nft", (req, res) => {
  // console.log('===============');
  const data = req.body;
  // console.log("request", req);
  console.log("====data====", data);

  const result = insertNewNFTtoTOML(data.code, data.issuer, data.name, data.desc, data.image, data.decimals);

  res.send(result);
});

server.listen(6000, () => {
  console.log("listening on *:6000");
});
