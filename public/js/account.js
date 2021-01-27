var user;

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
    createuser.profile_picture = null;
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
        else {
            $("#loginModal").modal("hide");
            window.alert("Login was successful!");
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
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_id");
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
        user.profile_picture = userProfile.Profile_Picture;
        console.log(user);
        sessionStorage.setItem("accountdetails", JSON.stringify(user));
    }
    request.send();
}
function setProfile(){ //populate the profile page
    var user = JSON.parse(sessionStorage.getItem("accountdetails"));
    document.getElementById("username").innerHTML = user.user_name;
    document.getElementById("first name").innerHTML = user.first_name;
    document.getElementById("last name").innerHTML = user.last_name;
    document.getElementById("gender").innerHTML = user.gender;
    document.getElementById("address").innerHTML = user.address;
    document.getElementById("email").innerHTML = user.email;
    document.getElementById("mobile_number").innerHTML = user.mobile_number;
    document.getElementById("reviews_posted").innerHTML = "Contributed " + user.reviews_posted + " Reviews";
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