var mysql = require("mysql");
var connection = mysql.createPool({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "", // default password is blank
    database: "EatWhere",
    multipleStatements: true
});
module.exports = connection; 