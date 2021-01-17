const { request } = require("express");
const UserAccount = require("../../models/UserAccount");

function login(){
    var request = new XMLHttpRequest();
    request.open("GET", "/login", true);
    request.onload = function(){
        tokenandId = JSON.parse(request.responseText);
        user.id = tokenandId.userid;
        // need to store token somewhere as well like in the browser cookies
        token = tokenandId.token;
        getprofile(); // if successful login, get profile
    }
    var user = new Object();
    user.user_name = document.getElementById("username").value;
    user.password = document.getElementById("password").value;
    request.send(JSON.stringify(user));
}
function getprofile(){
    var request = new XMLHttpRequest();
    var url = "/profile/" + user.id;
    request.open("GET", url, true);
    request.onload = function(){
        userProfile = JSON.parse(request.responseText);
        user.email = userProfile.Email;
        user.first_name = userProfile.First_Name;
        user.last_name = userProfile.Last_Name;
        user.gender = userProfile.Gender;
        user.mobile_number = userProfile.Mobile_Number;
        user.address = userProfile.Address;
        user.reviews_posted = userProfile.Reviews_Posted;
        user.profile_picture = userProfile.Profile_Picture;
    }
    request.send();
}