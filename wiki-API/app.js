import bodyParser from "body-parser";
import mongoose from "mongoose";
import ejs from "ejs";
import express from "express";

const app = express();
app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get((req, res) => {
        Article.find({})
        .then((foundItem) => {
            res.send(foundItem);
        })
        .catch((err) => {
            res.send(err);
        });
    })

    .post((req, res) => {
        const title = req.body.title;
        const content = req.body.content;

        const article = new Article({
            title: title,
            content: content
        });
        article.save()
        .then(() => {
            res.send("Document added");
        })
        .catch((err) => {
            res.send(err);
        });
    })

    .delete((req, res) => {
        Article.deleteMany()
        .then((err) => {
            if (!err) {
                res.send("Succesfully deleted all articles")
            } else {
                res.send(err);
            }
        });
    });

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle})
        .then((foundItem) => {
            if (!foundItem) {
                res.send("No article found");
            } else {
                res.send(foundItem);
            }
        })
        .catch((err) => {
            res.send(err);
        });
    })

    .put((req, res) => {
        Article.updateOne({title: req.params.articleTitle}, {title: req.body.title, content: req.body.content})
        .then((foundItem) => {
            if (!foundItem) {
                res.send("No article found");
            } else {
                res.send("Succesfully updated article");
            }
        })
        .catch((err) => {
            res.send(err);
        });
    })

    .patch((req, res) => {
        Article.updateOne({title: req.params.articleTitle}, {$set: req.body})
        .then((foundItem) => {
            if (!foundItem) {
                res.send("No article found");
            } else {
                res.send("Succesfully updated article");
            }
        })
        .catch((err) => {
            res.send(err);
        });
    })
    
    .delete((req, res) => {
        Article.deleteOne({title: req.params.articleTitle})
        .then((deletedItem) => {
            if (!deletedItem) {
                res.send("No article found");
            } else {
                res.send("Succesfully deleted article");
            }
        })
        .catch((err) => {
            res.send(err);
        });
    });



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});