//const e = require("express");

var user;
var picture;
function encode(element, imgid){
    var selectedfile = element.files;
    if (selectedfile.length > 0){
        var imageFile = selectedfile[0];
        if (imageFile.size > 2097152) //2MiB for bytes //checks if imagefile size is more than 2MiB
        {
            //if imagefile more than 2MiB, alert user and reset file input
            alert("File size must be under 2MiB");
            element.value = "";
            return;
        }
        if (!imageFile['type'].includes("image")){ //if uploadedfile is not an image
            alert("File uploaded must be an image file.");
            element.value = "";
            return;
        }
        var fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            picture = fileLoadedEvent.target.result;
            document.getElementById(imgid).src = picture;
        }
        fileReader.readAsDataURL(imageFile);
    }
}
function createAccount(){
    var createuser = new Object();
    createuser.user_name = document.getElementById("username").value;
    createuser.password = document.getElementById("password").value;
    createuser.email = document.getElementById("email").value;
    createuser.firstname = document.getElementById("first name").value;
    createuser.lastname = document.getElementById("last name").value;
    createuser.gender = "";
    if (document.getElementById("male").checked){
        createuser.gender = document.getElementById("male").value;
    }
    else if (document.getElementById("female").checked){
        createuser.gender = document.getElementById("female").value;
    }
    createuser.mobile_number = document.getElementById("mobile_number").value;
    createuser.address = document.getElementById("address").value;
    console.log(createuser)
    var string = "";
    for (var key in createuser){
        if (createuser[key] == ""){
            string += key + " ";
        }
    }
    if (string != ""){
        alert(string + "is missing. Please input the required fields.");
        return false;
    }
    //check password requirements
    //check if confirm password == password
    createuser.profile_picture = picture;
    // createuser.profile_picture = document.getElementById("profile picture").value;
    createuser.facebook_account_id = null; //later implement facebook login
    //later implement password checking requirements and checking of values to make sure they are not blank
    console.log(createuser)
    console.log(JSON.stringify(createuser));
    //called when user press create account
    var request = new XMLHttpRequest();
    request.open("POST", "/register", true);
    request.onload = function(){
        //maybe auto login? //or change page to tell user to confirm account
        //need to send email to user account to verify
        result = JSON.parse(request.responseText);
        if (result.result == "Valid"){
            window.alert("User is successfully registered.");
            //prob change the top nav when user is logged in.
        }
        else if (result.result == "Invalid. User Already Exists"){
            window.alert("User Already Exists in the database. Please choose another username.");
        }
    };
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(createuser));
}
function login(){
    var user = new Object();
    user.user_name = document.getElementById("username").value;
    user.password = document.getElementById("password").value;
    console.log(JSON.stringify(user))
    var request = new XMLHttpRequest();
    request.open("POST", "/login", true);
    request.onload = function(){
        tokenandId = JSON.parse(request.responseText);
        if (tokenandId.result == "Invalid"){
            window.alert("Login is not successful, please try again.");
        }
        else if (tokenandId.result == "Not Confirmed"){
            window.alert("You have not confirmed your account. Please confirm your account before logging in.")
        }
        else {
            $("#loginModal").modal("hide"); 
            window.alert("Login was successful! Welcome, " + document.getElementById("username").value + "!");
            id = tokenandId.userid;
            sessionStorage.setItem("user_id", id);
            // need to store token somewhere as well like in the browser cookies
            token = tokenandId.result;
            sessionStorage.setItem("token", token);
            //close modal and change top-navigation(remove login and sign up btn)
            if (sessionStorage.getItem("token") != null){
                document.getElementById("login").style.display = "none";
                document.getElementById("signup").style.display = "none";
                document.getElementById("logout").style.display = "block";
                document.getElementById("accountdetails").style.display = "block";
            }
            getprofile(); // if successful login, get profile
        }
        console.log(request.responseText);
        console.log(tokenandId);
    }
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(user));
}
function logout(){
    document.getElementById("login").style.display = "block";
    document.getElementById("signup").style.display = "block";
    document.getElementById("logout").style.display = "none";
    document.getElementById("accountdetails").style.display = "none";
    sessionStorage.clear();
    window.location.replace("index.html");
}
function getprofile(){
    var request = new XMLHttpRequest();
    var id = sessionStorage.getItem("user_id");
    var url = "/profile/" + id;
    request.open("GET", url, true);
    request.onload = function(){
        var userProfile = JSON.parse(request.responseText)[0];
        var user = new Object();
        user.user_name = userProfile.User_Name;
        user.email = userProfile.Email;
        user.first_name = userProfile.FirstName;
        user.last_name = userProfile.LastName;
        user.gender = userProfile.Gender;
        user.mobile_number = userProfile.Mobile_Number;
        user.address = userProfile.Address;
        user.reviews_posted = userProfile.Reviews_Posted;
        if (userProfile.Profile_Picture == null){ //profile picture of user in database is null, set it to avatar img src
            user.profile_picture = "/images/avatar.png";
        }
        else{
            user.profile_picture = userProfile.Profile_Picture; //set profilepic of user to base64 string of the profile pic 
            //that the user uploaded previously which is retrieved from database
        }
        console.log(user);
        sessionStorage.setItem("accountdetails", JSON.stringify(user));
    }
    request.send();
}
function setProfile(){ //populate the profile page
    var user = JSON.parse(sessionStorage.getItem("accountdetails"));
    console.log(user)
    document.getElementById("profile_picture-profile").setAttribute("src", user.profile_picture);
    document.getElementById("username-profile").innerHTML = user.user_name;
    document.getElementById("firstname-profile").innerHTML = user.first_name;
    document.getElementById("lastname-profile").innerHTML = user.last_name;
    document.getElementById("gender-profile").innerHTML = user.gender;
    document.getElementById("address-profile").innerHTML = user.address;
    document.getElementById("email-profile").innerHTML = user.email;
    document.getElementById("mobile_number-profile").innerHTML = user.mobile_number;
    document.getElementById("reviews_posted-profile").innerHTML = "Contributed " + user.reviews_posted + " Reviews";
}
function setEditProfile(){
    //get user account details from sessionStorage
    var user = JSON.parse(sessionStorage.getItem("accountdetails"));
    //all account details are autofilled except for password as it is important for the user to rmb their password
    //set the fields that were previously entered onto the form to make it easy for the user.
    document.getElementById("username").innerHTML = user.user_name;
    document.getElementById("email").value = user.email;
    document.getElementById("first name").value = user.first_name;
    document.getElementById("last name").value = user.last_name;
    if (user.gender == "M"){
        document.getElementById("male").checked = true;
    }
    else{
        document.getElementById("female").checked = true;
    }
    document.getElementById("mobile_number").value = user.mobile_number;
    document.getElementById("address").value = user.address;
    //if user profile picture isnt avatar image where in the database the profile picture field is null
    if (user.profile_picture != "/images/avatar.png"){
        document.getElementById("uploaded-file").src = user.profile_picture; //set image to user's previous profile pic
    }
}
function editProfile(){
    //After user edits profile and press submit(called when submit is pressed)
    var userProfileObject = new Object();
    //don't allowing changing of username
    userProfileObject.password = document.getElementById("password").value
    userProfileObject.email = document.getElementById("email").value
    userProfileObject.firstname = document.getElementById("first name").value
    userProfileObject.lastname = document.getElementById("last name").value
    if (document.getElementById("male").checked){
        userProfileObject.gender = document.getElementById("male").value;
    }
    else if (document.getElementById("female").checked){
        userProfileObject.gender = document.getElementById("female").value;
    }
    userProfileObject.mobile_number = document.getElementById("mobile_number").value
    userProfileObject.address = document.getElementById("address").value
    if (document.getElementById("profile_picture").files.length == 0) //if no profile pic uploaded, set profile pic to null
    {
        userProfileObject.profile_picture = null;
    }
    else{
        userProfileObject.profile_picture = picture; //else set profile pic to base64 string of uploaded img file
    }
    userProfileObject.token = sessionStorage.getItem("token");
    console.log(userProfileObject);
    var request = new XMLHttpRequest();
    var url = "/profile/" + sessionStorage.getItem("user_id");
    request.open("PUT", url, true);
    request.onload = function(){
        var result = JSON.parse(request.responseText);
        if (result.result == "Invalid token!"){
            window.alert("Invalid token.");
        }
        else{
            getprofile();
            window.location.replace("profile.html");
        }
    }
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(userProfileObject));
}
function activateacc(){
    // aft user clicks on url
    var request = new XMLHttpRequest();
    var url = "/activateaccount/" + id;
    request.open("PUT", url, true);
    request.send();
}
function deactivateacc(){
    //aft user clicks on deactivateaccount button
    var boolean = window.confirm("Are you sure you want to deactivate your account? The next time you login, you will automatically activate your account.");
    if (boolean){
        var request = new XMLHttpRequest();
        var url = "/deactivateaccount/" + sessionStorage.getItem("user_id");
        request.open("PUT", url, true);
        request.send();
    }
    request.onload = function(){
        sessionStorage.clear();
        window.location.replace("index.html");
    }
}
function deleteacc(){
    var boolean = window.confirm("Are you sure you want to delete your account? Note that deleting your account is permanent.")
    if (boolean){
        var request = new XMLHttpRequest();
        var url = "/profile/" + sessionStorage.getItem("user_id");
        request.open("DELETE", url, true);
        request.send();
    }
    request.onload = function(){
        sessionStorage.clear();
        window.location.replace("index.html");
    }
}
function submitEmailToResetPassword(){
    var request = new XMLHttpRequest();
    var username = document.getElementById("resetusername").value;
    var email = document.getElementById("resetEmail").value;
    var url = "/resetpassword/" + username;
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json");
    var objectToSend = new Object();
    objectToSend.email = email;
    request.send(JSON.stringify(objectToSend));
    request.onload = function(){
        var result = JSON.parse(request.responseText);
        if (result.result == "Invalid account"){
            window.alert("There is no such account found!");
        }
        else{
            window.alert("The request to reset password has been sent. You will receive an email soon.");
        }
    }
}
function resetPasswordRequest(){
    var request = new XMLHttpRequest();
    var usernametoken = window.location.href.split("?")[1];
    console.log(usernametoken);
    var url = "/resetpassword/" + usernametoken;
    request.open("PUT", url, true);
    request.setRequestHeader("Content-Type", "application/json");
    var passwordObject = new Object();
    passwordObject.password = document.getElementById("resetPassword").value;
    request.send(JSON.stringify(passwordObject));
    request.onload = function(){
        var result = JSON.parse(request.responseText);
        if (result.result == "Success"){
            window.alert("You have successfully resetted your password!.");
            window.location.replace("index.html");
        }
        else{
            window.alert("Your attempt to reset your password has failed!");
        }
    }
}