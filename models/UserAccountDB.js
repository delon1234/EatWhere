"use strict"
var db = require("../db-connection");
const UserAccount = require("../models/UserAccount");
class UserAccountDB 
{
    getUserProfile(request, respond)
    {
        var sql = "SELECT User_Name, Email, FirstName, LastName, Email, Gender, Mobile_Number, Address, Reviews_Posted, Profile_Picture FROM EatWhere.User_Accounts";
        db.query(sql, function(error, result){
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
        var userObject = new UserAccount(request.params.id, request.body.userid, request.body.firstname, request.body.lastname, 
            request.body.email, request.body.gender, request.body.mobile_number, request.body.address, 
            request.body.reviews_posted, request.body.profile_picture);
        var sql = "UPDATE EatWhere.User_Account SET userid = ?, firstname = ?, lastname = ?, email = ?, gender = ?, mobile_number = ?, address = ?, reviews_posted = ?, profile_picture = ?";
        db.query(sql, values, function(error, result){
            if (error){
                throw error;
            }
            else{
                respond.json(result);
            }
        });
        
    }
}