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