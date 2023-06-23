const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.listen(3000);

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    const q = req.body.city;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + q + "&appid=de1f778c3a0e3f6e93ea514ea4759625&units=metric";
    https.get(url, function(response) {

        response.on("data", function(data) {
            const weather = JSON.parse(data);
            const temp = weather.main.temp;
            const description = weather.weather[0].description;
            const img = "https://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png"
            res.write("<h1>Temperature in " + q + " is " + temp + " degrees</h1>");
            res.write("<p>Wheater in " + q + " is " + description + "</p>");
            res.write("<img src=" + img + ">");

            res.send();
        });
    });
});
 