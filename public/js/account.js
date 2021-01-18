var user = new Object();

function createAccount(){
    
    // request.onload(function(){
    //     //maybe auto login? //or change page to tell user to confirm account
    //     //need to send email to user account to verify
    // });
    var createuser = new Object();
    createuser.user_name = document.getElementById("username").value;
    createuser.password = document.getElementById("password").value;
    createuser.email = document.getElementById("email").value;
    createuser.firstname = document.getElementById("first name").value;
    createuser.lastname = document.getElementById("last name").value;
    if (document.getElementById("male").checked){
        createuser.gender = document.getElementById("male").value;
    }
    else if (document.getElementById("female").checked){
        createuser.gender = document.getElementById("female").value;
    }
    createuser.mobile_number = document.getElementById("mobile_number").value;
    createuser.address = document.getElementById("address").value;
    createuser.profile_picture = null;
    // createuser.profile_picture = document.getElementById("profile picture").value;
    createuser.facebook_account_id = null; //later implement facebook login
    //later implement password checking requirements and checking of values to make sure they are not blank
    console.log(createuser)
    console.log(JSON.stringify(createuser));
    //called when user press create account
    var request = new XMLHttpRequest();
    request.open("POST", "/register", true);
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
        console.log(tokenandId);
        id = tokenandId.userid;
        localStorage.setItem("user_id", id);
        // need to store token somewhere as well like in the browser cookies
        token = tokenandId.token;
        //close modal and change top-navigation(remove login and sign up)
        getprofile(id); // if successful login, get profile
    }
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(user));
}
function getprofile(id){
    var request = new XMLHttpRequest();
    var url = "/profile/" + id;
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
        console.log(user);
    }
    request.send();
}
function setProfile(){
    document.getElementById("username").innerHTML = user.user_name;
    document.getElementById("first name").innerHTML = user.first_name;
    document.getElementById("last name").innerHTML = user.last_name;
    document.getElementById("gender").innerHTML = user.gender;
    document.getElementById("address").innerHTML = user.address;
    document.getElementById("email").innerHTML = user.email;
    document.getElementById("mobile_number").innerHTML = user.mobile_number;
    document.getElementById("reviews_posted").innerHTML = "Contributed " + user.reviews_posted + "Reviews";
}
function editProfile(){
    //After user edits profile and press submit(called when submit is pressed)
    
    var userProfileObject = new Object();
    //userProfileObject.user_name = document.getElementById("username").value;
    // may consider not allowing changing of username, since token is created using username
    //might also need to change sql statement
    userProfileObject.password = document.getElementById("password").value
    userProfileObject.email = document.getElementById("email").value
    userProfileObject.firstname = document.getElementById("first name").value
    userProfileObject.lastname = document.getElementById("last name").value
    userProfileObject.gender =  document.getElementById("gender").value
    userProfileObject.mobile_number = document.getElementById("mobile number").value
    userProfileObject.address = document.getElementById("address").value
    userProfileObject.profile_picture = document.getElementById("profile picture").value //may change
    userProfileObject.token = token;
    var request = new XMLHttpRequest();
    var url = "/profile/" + user.id;
    request.open("PUT", url, true);
    request.onload = function(){
        getprofile();
    }
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(userProfileObject));
}
function activateacc(){
    // aft user clicks on url
    var request = new XMLHttpRequest();
    var url = "/activateaccount/" + id;
    request.open("PUT", "url", true);
    request.send();
}
function deactivateacc(){
    //aft user clicks on deactivateaccount button
    var request = new XMLHttpRequest();
    var url = "/deactivateaccount/" + user.id;
    request.open("PUT", "url", true);
    request.send();
}
function deleteacc(){
    var request = new XMLHttpRequest();
    var url = "/profile/" + user.id;
    request.open("DELETE", "url", true);
    request.send();
}