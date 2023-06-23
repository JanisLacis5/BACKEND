const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const newItems = [];
const workItems = [];

app.get("/", function (req, res) {
    const day = date.getDate();
    res.render("list", {listTitle: day, newItems: newItems});
});

app.post("/", function (req, res) {
    const newItem = req.body.newItem;
    if (req.body.list === "Work List") {
        workItems.push(newItem);
        res.redirect("/work");
    } else {
        newItems.push(newItem);
        res.redirect("/");
    }
});

app.get("/work", function (req, res) {
    res.render("list", {listTitle: "Work List", newItems: workItems});
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});