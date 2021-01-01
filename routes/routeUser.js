"use strict"
const UserAccountDB = require("../models/UserAccountDB"); //import UserAccountDB file

var UserAccountDBObject = new UserAccountDB(); // intialise an instance of UserAccountDB

function routeUser(app)
{
    app.route("/login")
        .post(UserAccountDBObject.createUserAccount);
    app.route("/profile/:id")
        .get(UserAccountDBObject.getUserProfile)
        .put(UserAccountDBObject.editUserProfile)
        .put(UserAccountDBObject.deactivateAccount)
        .delete(UserAccountDBObject.deleteAccount);
}
module.exports = {routeUser};
