const mysql = require('mysql');

const config = mysql.createConnection({
    host: "localhost",
    user: "dbadminvrajraj",
    password: "Vraj@123",
    database: "communityapp"
})

config.connect((error) => {
    if (error) throw error;
    console.log('connected!')
});

module.exports = config;