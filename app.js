const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.redirect("/url_shortener");
});
app.get("/url_shortener", (req, res) => {
  res.render("index");
});

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`express server is running`);
});
