"use strict"
var db = require("../db-connection");
const UserAccount = require("../models/UserAccount");
class UserAccountDB 
{
    createUserAccount(request, respond)
    {
        var UserAccount = new UserAccount(null, request.body.user_name, request.body.password, request.body.email, request.body.firstname, request.body.lastname, request.body.gender, request.body.mobile_number, request.body.address, request.body.reviews_posted, request.body.profile_picture, request.body.activated, request.facebook_account_id, request.body.confirmed);
        var sql = "INSERT INTO EatWhere.User_Accounts (User_Name, Password, Email, FirstName, LastName, Gender, Mobile_Number, Address, Reviews_Posted, Profile_Picture) VALUES (?,?,?,?,?,?,?,?,0,?)";
        var values = [UserAccount.getUserName(), UserAccount.getPassword(), UserAccount.getEmail(), UserAccount.getFirstName(), 
            UserAccount.getLastName(), UserAccount.getGender(), UserAccount.getMobileNumber(), UserAccount.getAddress(), UserAccount.getProfilePicture()];
        db.query(sql, values, function(error, result){
            if (error){
                throw error;
            }
            else{
                respond.json(result);
            }
        });
    }
    getUserProfile(request, respond)
    {
        var sql = "SELECT User_Name, Email, FirstName, LastName, Email, Gender, Mobile_Number, Address, Reviews_Posted, Profile_Picture FROM EatWhere.User_Accounts WHERE User_ID = ?";
        var UserAccountID = request.params.id;
        db.query(sql, UserAccountID, function(error, result){
            if (error){
                throw error;
            }
            else{
                respond.json(result);
            }
        });
    }
    editUserProfile(request, respond)
    {
        var userObject = new UserAccount(request.params.id, request.body.user_name, request.body.firstname, request.body.lastname, 
            request.body.email, request.body.gender, request.body.mobile_number, request.body.address, 
            request.body.reviews_posted, request.body.profile_picture);
        var sql = "UPDATE EatWhere.User_Accounts SET User_Name = ?, FirstName= ?, LastName = ?, Email = ?, Gender = ?, Mobile_Number = ?, Address = ?, Reviews_Posted = ?, Profile_Picture = ? WHERE User_ID = ?";
        var values = [userObject.getUserName(), userObject.getFirstName(), userObject.getLastName(), userObject.getEmail(), userObject.getGender(), 
            userObject.getMobileNumber(), userObject.getReviewsPosted(), userObject.getProfilePicture(), userObject.getId()];
        db.query(sql, values, function(error, result){
            if (error){
                throw error;
            }
            else{
                respond.json(result);
            }
        });
        
    }
    deleteAccount(request, respond)
    {
        var UserAccountID = request.params.id;
        var sql = "DELETE FROM EatWhere.User_Accounts WHERE User_ID = ?";
        db.query(sql, UserAccountID, function (error, result) {
            if (error) {
                throw error;
            }
            else {
                respond.json(result);
            }
        });
    }
    deactivateAccount(request, respond){
        var UserAccountID = request.params.id;
        var sql = "INSERT INTO EatWhere.User_Accounts (Activated) VALUES (0) WHERE User_ID = ?";
        db.query(sql, UserAccountID, function (error, result) {
            if (error) {
                throw error;
            }
            else{
                respond.json(result);
            }
        });
    }
}
module.exports = UserAccountDB;