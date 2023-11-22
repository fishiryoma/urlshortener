const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;
////////////////////
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
////////////////////
// 使用fs模組
const fs = require("fs");
const path = require("path");
const dataPath = path.join(__dirname, "data.json");
////////////////////

let data;
const rawData = fs.readFileSync(dataPath, "utf-8");
data = rawData ? JSON.parse(rawData) : {};

app.get("/", (req, res) => {
  res.redirect("/url_shortener");
});
app.get("/url_shortener", (req, res) => {
  res.render("index");
});

app.post("/url_shortener", (req, res) => {
  let originalUrl = req.body.inputUrl;
  if (!originalUrl) {
    res.redirect("/url_shortener");
    return;
  }

  if (data[originalUrl]) {
    const shortUrl = data[originalUrl];
    res.render("index", { shortUrl });
  } else {
    const shortUrl = generateRandomString();
    data[originalUrl] = shortUrl;
    fs.writeFileSync(dataPath, JSON.stringify(data), "utf-8");
    res.render("index", { shortUrl });
  }
});

app.get("/:shortUrl", (req, res) => {
  const shortUrl = req.params.shortUrl;
  const originalUrl = Object.keys(data).find((key) => data[key] === shortUrl);
  if (originalUrl) {
    res.redirect(originalUrl);
  } else res.status(404).send("Can't find URL, something is going wrong🫥");
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}/`);
});

function generateRandomString() {
  return Math.random().toString(36).slice(2, 7);
}
