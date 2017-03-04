//Melinda
// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
// Routes
// ************************************
// pages
// home
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "home.html"));
});

// tables
app.get("/tables", function(req, res) {
    res.sendFile(path.join(__dirname, "tables.html"));
});

// reserve
app.get("/reserve", function(req, res) {
    res.sendFile(path.join(__dirname, "reserve.html"));
});

// api
// new reservation 
app.post("/api/new", function(req, res) {
    let reservation = req.body;
    saveReservation(reservation);
    res.json(reservation);
});

// tables
app.get("/api/tables", function(req, res) {
    // set file location
    const file = './reservations.json';
    // read in file contents
    let contents = jsonfile.readFileSync(file);
    if(contents.reservation) {
        return res.json(contents.reservation);
    }
    return res.json(false);
});

// waitlist
app.get("/api/waitlist", function(req, res) {
    // set file location
    const file = './reservations.json';
    // read in file contents
    let contents = jsonfile.readFileSync(file);
    if(contents.waitlist) {
        return res.json(contents.waitlist);
    }
    return res.json(false);
});

// dependencies
const jsonfile = require('jsonfile');

// save new reservation
function saveReservation(reservation) {
    // set file location
    const file = './reservations.json';
    // read in file contents
    let contents = jsonfile.readFileSync(file);
    if (contents.reservation) {
        // check for max 5 reservations, else waitlist
        if (contents.reservation.length < 6 ) {
            // push new reservation to table
            contents.reservation.push(reservation);
        } else {
            // push new reservation to waitlist
            contents.waitlist.push(reservation);
        }
        // write updated content to file 
        jsonfile.writeFileSync(file, contents, {spaces: 2});
    }
    return;
}

 
