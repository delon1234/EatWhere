"use strict"
var db = require("../db-connection");
const UserAccount = require("../models/UserAccount");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
var secret = "secretkey" //key to encrypt for jwt token
const nodemailer = require("nodemailer");
class UserAccountDB 
{

    createUserAccount(request, respond)
    {   
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: "eatwherecdev@gmail.com",
              pass: "Testing1234!"
            },
          });
        bcrypt.hash(request.body.password, saltRounds, function(err, hash) 
        {
            var userAccount = new UserAccount(null, request.body.user_name, hash, request.body.email, request.body.firstname, request.body.lastname, request.body.gender, request.body.mobile_number, request.body.address, 0, request.body.profile_picture, 1, request.body.facebook_account_id, 0);
            var sql = "INSERT INTO EatWhere.User_Accounts (User_Name, Password_Hash, Email, FirstName, LastName, Gender, Mobile_Number, Address, Profile_Picture, Facebook_Account_ID) VALUES (?,?,?,?,?,?,?,?,?,?)";
            var values = [userAccount.getUserName(), userAccount.getPassword(), userAccount.getEmail(), userAccount.getFirstName(), 
                userAccount.getLastName(), userAccount.getGender(), userAccount.getMobileNumber(), userAccount.getAddress(), userAccount.getProfilePicture(), userAccount.getFacebookAccountID()];
            db.query(sql, values, function(error, result){
                if (error){
                    //throw error;
                    // if there exists a user with the same username as inputted
                    //every user must have a unique username
                    if (error.code === "ER_DUP_ENTRY") {
                        respond.json({result: "Invalid. User Already Exists"});
                        // responds to client that there is already a user with the same username and that
                        // the registration is invalid.
                    }
                }
                else{
                    respond.json({result: "Valid"});
                    //responds to client that registration is successful
                    var emailtoken = jwt.sign(request.body.user_name, secret);
                    const url = `http://127.0.0.1:8080/activateaccount.html?${emailtoken}`;

                    transporter.sendMail({
                        to: request.body.email,
                        subject: "Confirm Email for EatWhere",
                        html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
                    });
                }
            });
        });
    }
    getLoginDetails(request, respond){
        var user_name = request.body.user_name;
        var password = request.body.password;
        var sql = "SELECT User_ID, CAST(Password_Hash as CHAR) AS password , Confirmed FROM EatWhere.User_Accounts WHERE User_Name = ?";
        //Convert Password_Hash from Binary to CHAR and change the output field name to password
        db.query(sql, [user_name], function(error, result){
            if (error){
                throw error;
            }
            else{
                if (result === undefined || result.length == 0)
                {
                    //if database does not return username and password and instead an empty array
                    respond.json({result: "Invalid"});
                }
                else
                {
                    //if there exists a user with the username inputted
                    var userid = result[0].User_ID;
                    var confirmed = result[0].Confirmed;
                    // Compares plaintext password in json with password_hash stored in database
                    bcrypt.compare(password, result[0].password, function(err, result) {
                        if (result == true){ // if passwords matches/login successful
                            if (confirmed == 1){
                                console.log("Success");
                                var token = jwt.sign(user_name, secret);//create a jwt token to verify user's identity
                                respond.json({result: token, userid: userid});//give user a token and userid
                            }
                            else if (confirmed == 0){
                                respond.json({result: "Not Confirmed"});
                            }
                        }
                        else{
                            respond.json({result: "Invalid"}) // let browser know invalid password.
                            // input password does not match with password in database
                        }
                    });
                }
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
    editAccountDetails(request, respond)
    {
        var token = request.body.token;
        try {
            var decoded = jwt.verify(token, secret);//protect endpoint with token
            //so that malicious people cannot edit account details
            //verify if the user is legit
            bcrypt.hash(request.body.password, saltRounds, function(err, hash){
                var userObject = new UserAccount(request.params.id, request.body.user_name, hash, request.body.email, request.body.firstname, request.body.lastname, 
                    request.body.gender, request.body.mobile_number, request.body.address, 
                    null, request.body.profile_picture, 1, null, null);
                var sql;
                var values;
                if (request.body.profile_picture != null){
                    sql = "UPDATE EatWhere.User_Accounts SET Password_Hash = ? , FirstName= ?, LastName = ?, Email = ?, Gender = ?, Mobile_Number = ?, Address = ?, Profile_Picture = ? WHERE User_ID = ?";
                    values = [userObject.getPassword(), userObject.getFirstName(), userObject.getLastName(), userObject.getEmail(), userObject.getGender(), 
                        userObject.getMobileNumber(), userObject.getAddress(), userObject.getProfilePicture(), userObject.getId()];
                }
                else {
                    sql = "UPDATE EatWhere.User_Accounts SET Password_Hash = ? , FirstName= ?, LastName = ?, Email = ?, Gender = ?, Mobile_Number = ?, Address = ? WHERE User_ID = ?";
                    values = [userObject.getPassword(), userObject.getFirstName(), userObject.getLastName(), userObject.getEmail(), userObject.getGender(), 
                        userObject.getMobileNumber(), userObject.getAddress(), userObject.getId()];
                }
                db.query(sql, values, function(error, result){
                    if (error){
                        throw error;
                    }
                    else{
                        respond.json({result: "Success"});
                    }
                });
            });
        } catch (err) {
            //if user is not legit
            respond.json({result: "Invalid token!" });
        }
        
        
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
        var sql = "UPDATE EatWhere.User_Accounts SET Activated = 0 WHERE User_ID = ?";
        db.query(sql, UserAccountID, function (error, result) {
            if (error) {
                throw error;
            }
            else{
                respond.json(result);
            }
        });
    }
    activateAccount(request, respond){
        //var UserAccountID = request.params.id;
        var username;
        try{
            console.log(request.params.emailtoken)
            username = jwt.verify(request.params.emailtoken, secret);
            console.log(username)
        }catch(e){
            console.log("Error in verifying token");
            respond.json({result: "Invalid token"});
            return;
        }
        //var sql = "UPDATE EatWhere.User_Accounts SET Activated = 1 WHERE User_ID = ?";
        var sql = "UPDATE EatWhere.User_Accounts SET Confirmed = 1 WHERE User_Name = ?";
        db.query(sql, username, function (error, result) {
            if (error) {
                throw error;
            }
            else{
                respond.json({result: "Success"});
            }
        });
    }
    sendEmailtoReset(request, respond){
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: "eatwherecdev@gmail.com",
              pass: "Testing1234!"
            },
          });
        var sql = "SELECT User_Name, Email FROM User_Accounts WHERE User_Name = ? AND Email = ?";
        db.query(sql,[request.params.username, request.body.email], function (error, result) {
            if (error) {
                throw error;
            }
            else{
                console.log(result)
                if (result.length == 0){
                    respond.json({result: "Invalid account"})
                    return;
                }
                var username = result[0].User_Name;
                var email = result[0].Email;
                var usernametoken = jwt.sign(username, secret);
                const url = `http://127.0.0.1:8080/resetpassword.html?${usernametoken}`;
                respond.json(result);
                //respond.json({result: "Success"});
                transporter.sendMail({
                    to: email,
                    subject: "Reset Password for EatWhere",
                    html: `Please click this link to reset your password: <a href="${url}">${url}</a>`
                }, (err, res) => {
                    if (err){
                        return console.log(err);
                    }
                    return console.log(res);
                });
            }
        });
    }
    resetPassword(request, respond){
        bcrypt.hash(request.body.password, saltRounds, function(err, hash) 
        {
            var username;
            try {
                username = jwt.verify(request.params.usernametoken, secret);
            } catch (error) {
                respond.json({result: "Invalid token/user"});
                return;
            }
            console.log(hash)
            console.log(username)
            var sql = "UPDATE EatWhere.User_Accounts SET Password_Hash = ? WHERE User_Name = ?";
            db.query(sql,[hash, username], function(error, result){
                if (error) {
                    throw error;
                }
                else{
                    respond.json({result: "Success"});
                }
            });
        });
    }
}
module.exports = UserAccountDB;