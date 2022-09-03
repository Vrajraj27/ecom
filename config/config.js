const mysql = require('mysql');

const config = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ecom"
})

config.connect((error) => {
    if (error) throw error;
    console.log('connected!')
});

module.exports = config;