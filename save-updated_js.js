// save new reservation
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