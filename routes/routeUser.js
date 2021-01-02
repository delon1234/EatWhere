"use strict"
const UserAccountDB = require("../models/UserAccountDB"); //import UserAccountDB file

var UserAccountDBObject = new UserAccountDB(); // intialise an instance of UserAccountDB

function routeUser(app)
{
    app.route("/register")
        .post(UserAccountDBObject.createUserAccount);
    app.route("/login")
        .post(UserAccountDBObject.getLoginDetails);
    app.route("/login/:id")
        .put(UserAccountDBObject.activateAccount);
    app.route("/profile/:id")
        .get(UserAccountDBObject.getUserProfile)
        .put(UserAccountDBObject.editAccountDetails)
        .delete(UserAccountDBObject.deleteAccount);
    app.route("/deactivateaccount/:id")
        .put(UserAccountDBObject.deactivateAccount);
}
module.exports = {routeUser};
