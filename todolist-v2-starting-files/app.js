import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/todolistDB");
const itemSchema = new mongoose.Schema({
    name: String,
});

const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({name: "Welcome to your todo list"});
const item2 = new Item({name: "Hit the + button to aff a new item"});
const item3 = new Item({name: "<-- Hit this to delete an item"});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {

    Item.find({})
    .then((items) => {
        if (items.length === 0) {
            Item.insertMany(defaultItems);
            console.log("Items added");
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListItems: items});
        }
    })
    .catch(function(err) {
        console.log(err);
    });
});

app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item ({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName})
            .then((foundList) => {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            })
            .catch((err) => {});
    }
});

app.post("/delete", function(req, res) {
    const deleteItem = req.body.deleteItem;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(deleteItem)
            .then(() => {
                res.redirect("/");
            })
    } else {
        List.findOne({name:listName})
            .then((foundList) => {
            foundList.items.pull({ _id: deleteItem }); 
            foundList.save()
            res.redirect("/" + listName);
        });
    }
});

app.get("/:par", function(req, res) {
    const customRoute = _.capitalize(req.params.par);
    
    List.findOne({name: customRoute})
        .then((foundList) => {
            if (!foundList) {
                const list = new List({
                    name: customRoute,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customRoute);
            } else {
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        })
        .catch((err) => {});
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
