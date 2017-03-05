// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
const jsonfile = require('jsonfile');
var nodemailer = require('nodemailer');

// Sets up the Express App - MO
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing - MO
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

//to serve static files such as images - HK
//the static path here will not be included in the URL for any of these resources - HK
app.use(express.static('images'));

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

// mailing - MO
var router = express.Router();
app.use('/sayHello', router);
router.post('/', handleSayHello); 
// handle the route at yourdomain.com/sayHello - MO
function handleSayHello(req, res) {
    //created transport object in route handler - MO
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'mesarestaurant1116@gmail.com', // Your email id
            pass: 'saturday' // Your password
        }
    });

// HTML content to be sent in the body - MO
var text = 'Hello world from \n\n' + req.body.name;
//creating simple JSON object w/necessary values to send the email - MO
var mailOptions = {
    from: 'mesarestaurant1116@gmail.com>', // sender address
    to: 'receiver@destination.com', // list of receivers
    subject: 'Email Example', // Subject line
    text: text //, // plaintext body
    // html: '<b>Ta-da! ✔</b>' 
}
//send email and handle response - MO
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
    };
 });
};

// Routes - JT
// home page - JT
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "home.html"));
});

// tables page - JT
app.get("/tables", function(req, res) {
    res.sendFile(path.join(__dirname, "tables.html"));
});

// reserve page - JT
app.get("/reserve", function(req, res) {
    res.sendFile(path.join(__dirname, "reserve.html"));
});

// api
// save new reservation - JT
function saveReservation(reservation) {
    // set file location
    const file = './reservations.json';
    // read in file contents
    let contents = jsonfile.readFileSync(file);
    if (contents) {
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
// new reservation  - JT
app.post("/api/new", function(req, res) {
    let reservation = req.body;
    let added = saveReservation(reservation);
    return res.json(added);
});

// tables render - JT
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

// waitlist render - JT
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

// delete reservation - JT
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