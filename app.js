const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;
// 樣板引擎&解析JSON
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// 設定存取檔案路徑
const fs = require("fs");
const path = require("path");
const dataPath = path.join("./public/jsons", "data.json");
let data;
const rawData = fs.readFileSync(dataPath, "utf-8");
data = rawData ? JSON.parse(rawData) : {};
// --------------------------------------------------

app.get("/", (req, res) => {
  res.redirect("/url_shortener");
});

app.get("/url_shortener", (req, res) => {
  // 當JSON不為空時才顯示表格
  res.render("index", { data, length: Object.keys(data).length });
});

// POST表單
app.post("/url_shortener", (req, res) => {
  let originalUrl = req.body.inputUrl;
  // 如果沒輸入資料則return
  if (!originalUrl) return;

  // 如果資料已經存在，返回相同的短網址
  if (data[originalUrl]) {
    const shortUrl = data[originalUrl];
    res.render("index", { shortUrl, data, length: Object.keys(data).length });
  } else {
    // 建立隨機的5位數亂碼作為短網址
    const shortUrl = generateRandomString();
    data[originalUrl] = shortUrl;
    fs.writeFileSync(dataPath, JSON.stringify(data), "utf-8");
    res.render("index", { shortUrl, data, length: Object.keys(data).length });
  }
});

// GET導回原網址
app.get("/:shortUrl", (req, res) => {
  const shortUrl = req.params.shortUrl;
  // 從data裡面搜尋
  const originalUrl = Object.keys(data).find((key) => data[key] === shortUrl);
  if (originalUrl) {
    // 導回原網址或發出錯誤訊息
    res.redirect(originalUrl);
  } else res.status(404).send("Can't find URL, something is going wrong🫥");
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});

function generateRandomString() {
  return Math.random().toString(36).slice(2, 7);
}
