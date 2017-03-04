// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
const jsonfile = require('jsonfile');

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
app.get("reserve", function(req, res) {
    res.sendFile(path.join(__dirname, "reserve.html"));
});

// api
// new reservation 
app.post("/api/new", function(req, res) {
    let reservation = req.body;
    let added = saveReservation(reservation);
    return res.json(added);
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

// delete reservation 
app.delete("/api/tables:tableid?", function(req, res) {
    const deleteMe = req.param.tableid;
    // set file location
    const file = './reservations.json';
    // read in file contents
    let contents = jsonfile.readFileSync(file);
    if (deleteMe) {
        for (let i = 0; i < contents.reservation.length; i++) {
            if (contents.reservation[i].unique_id ===  deleteMe.unique_id) {
                contents.reservation.splice(i,1);
                break;
            }
        }
        if (contents.waitlist.length) {
            let newRes = contents.waitlist.splice(0,1);
            let added = saveReservation(newRes);
            return  res.json(true);
        }
    } else {
        contents.reservation = [];
        contents.waitlist = [];
        // write updated content to file 
        jsonfile.writeFileSync(file, contents, {spaces: 2});
        return  res.json(true);
    } 
});