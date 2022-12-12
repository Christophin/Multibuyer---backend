const express = require('express');
const  app = express();
const controller = require("./app/controllers/price-controller");

// const browserObject = require('./browser');
// const scraperController = require('./pageController');
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
const  port = process.env.PORT || 3000;
app.listen(port);

console.log('Multibuyer RESTful API server started on: ' + port);

app.post("/price",
    controller.getPrice
)

app.post("/multiprice",
    controller.getMultiPrice
)