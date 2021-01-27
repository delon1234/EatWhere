$(document).ready(function (){
    //specifies a function to execute when the DOM is loaded (JQUERY)
    //checks if the user is logged in
    // if logged in, hide sign up, login button and show log out and account details button.
    var token = sessionStorage.getItem("token");
    if (token != null){
        $("#login").hide();
        $("#signup").hide();
        $("#logout").show();
        $("#accountdetails").show();
    }
});