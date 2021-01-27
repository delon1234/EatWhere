$(document).ready(function (){
    //specifies a function to execute when the DOM is loaded (JQUERY)
    var token = sessionStorage.getItem("token");
    if (token != null){
        $("#login").hide();
        $("#signup").hide();
        $("#logout").show();
        $("#accountdetails").show();
    }
});