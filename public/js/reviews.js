var rating = 0;
function getAllReviews(){
    var request = new XMLHttpRequest();
    var url = "/restaurants/"+ restaurant_id + "/reviews";
    request.open('GET', url , true);

    //This command starts the calling of the comments api
    request.onload = function() {
        //get all the comments records into our comments array
        var reviewsarea = document.getElementById("reviewsarea");
        reviewsarea.textContent = "";
        reviews = JSON.parse(request.responseText);
        for (var i = 0; i < reviews.length; i++){
            var d = new Date(reviews[i].Date_Posted);
            var star = "";
            var counter = 5;
            //this for loop sets full stars to match the rating
            for (var j = 0; j < reviews[i].rating; j++) {
                star += `<i class="fas fa-star"></i>`;
            }
            //fill empty stars such that total stars = 5
            for (var z = 0; z < counter - reviews[i].rating; z++){
                star += `<i class="far fa-star"></i>`;
            }
            var cell = `<div class="container" style="margin-top:50px">
                            <div id = "name${i}">User ID:${reviews[i].User_Name}</div>
                            <div id = "reviews_posted${i}">Contributed ${reviews[i].Reviews_Posted} Reviews</div>
                            <div id = "review${i}">${reviews[i].Review}</div>
                            <div id = "date_posted${i}">Date Posted:${d.toString()}</div>
                            <div>Rating: ${reviews[i].rating}
                                <span>${star}</span>
                            </div>
                            <i class="fas fa-trash" item="${i}"onClick='deleteReviewRequest(this)'></i>
                            <i class="fas fa-edit" item="${i}" onClick = "editReviewRequest(this)" data-toggle='modal' data-target='#editReviewModal' data-dismiss='modal'></i>
                        </div>`;
                        // later add reviewimage and profilepicture
            reviewsarea.insertAdjacentHTML("beforeend", cell);
        }
    };

    request.send();
}
function editReviewRequest(element){
    // this function sets the review data and username in the modal previously entered by the user like review, rating.
    var item = element.getAttribute("item");//gets item so we can retrieve the same review selected.
    currentIndex = item;
    document.getElementById("usernameforedit").innerHTML = reviews[item].User_Name;
    document.getElementById("editReview").value = reviews[item].Review;
    // This portion is to reset the stars back to empty so that the stars can match the rating obtained from the db.
    var stars = document.getElementsByClassName("fa-star edit");
    for (let star of stars){
        star.setAttribute("class", "far " + "fa-star edit");
    }
    //This is to change the stars to match the rating previously entered by the user
    changeStarColour(reviews[item].rating, ".fa-star.edit", "fa-star edit");
}
function deleteReviewRequest(element) {
    var response = confirm("Are you sure you want to delete this comment?");
    if (response == true) { //if user wants to delete, send delete request
        var item = element.getAttribute("item"); //get the current item/review that the user selected to delete
        var delete_review_url = "/restaurants/" + restaurant_id + "/reviews/" + reviews[item].Review_ID;
        var request = new XMLHttpRequest();
        request.open("DELETE", delete_review_url, true);
        request.onload = function() {
            getAllReviews();
        };
        request.send();
    }
}
function updateReview(){
    var response = confirm("Are you sure you want to update this comment?");
    if (response == true) {
        console.log(currentIndex);
        var url = "/restaurants/" + restaurant_id + "/reviews/" + reviews[currentIndex].Review_ID;
        var request = new XMLHttpRequest(); // new HttpRequest instance to send request to server
        request.open("PUT", url, true); //The HTTP method called 'PUT' is used here as we are updating data
        request.setRequestHeader("Content-Type", "application/json");
        reviews[currentIndex].Review = document.getElementById("editReview").value;
        //reviews[currentIndex].rating = document.getElementById("editReviewRating").value;
        reviews[currentIndex].rating = rating;
        request.onload = function() {
            getAllReviews();
            $('#reviewModal').modal('show');
        };
        console.log(JSON.stringify(reviews[currentIndex]))
        request.send(JSON.stringify(reviews[currentIndex]));
    }
}
function newReview(){
    rating = 0;
    document.getElementById("postReview").value = "";
    var stars = document.getElementsByClassName("fa-star post");
    for (let star of stars){
        star.setAttribute("class", "far " + "fa-star post");
    }
}
function postReview() {
    var review = new Object();
    var userid = sessionStorage.getItem("user_id");
    if (userid == null){
        //checks if user has logged in, if not logged in, cannot post review
        window.alert("You cannot post review without being logged in!");
        return null;
    }
    if (document.getElementById("postReview").value == "" || rating == 0){
        // checks if user has entered anything in the review and if user has selected a rating
        // if no rating, exit postReview so no empty and useless review is made and alert user that he 
        //cannot make a review without contents and without rating.
        window.alert("You cannot post a review without a rating and contents.");
        return null;
    }
    console.log(userid);
    review.userid = userid;
    //review.rating = document.getElementById("postReviewRating").value; // Value from HTML input text
    review.rating = rating;
    review.review = document.getElementById("postReview").value; // Value from HTML input text

    var request = new XMLHttpRequest(); // new HttpRequest instance to send comment
    var url = "/restaurants/" + restaurant_id + "/reviews";
    request.open("POST", url, true); //Use the HTTP POST method to send data to server

    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function() {
        getAllReviews();
        $('#reviewModal').modal('show');
    };
// Convert the data in Comment object to JSON format before sending to the server.
    request.send(JSON.stringify(review));
}
function rateIt(element) {
    var num = element.getAttribute("value");
    var classname = element.getAttribute("class");
    if (classname.includes("post")){
        classname = "fa-star post";
    }
    else if (classname.includes("edit")){
        classname = "fa-star edit";
    }
    // if class of element consists of post, setAttribute with the class "post"
    // if consist of edit, setAttribute with the class "edit"
    //post is for post review and edit is for edit review
    //this allows for correct targetting of stars
    console.log(classname)
    var stars = document.getElementsByClassName(classname);
    //replace 1st instance of space to . to make queryselector work properly
    var classTarget = "." + classname.replace(" ", ".");
    //This is another way of writing 'for' loop, which initialises the 
    //star images to empty. This allows user to reset the stars and change their rating after changing it previously
    for (let star of stars){
        star.setAttribute("class", "far " + classname);
    }
    changeStarColour(num, classTarget, classname);
}
// This function sets the rating and coloured stars based on the value of the star i tag when  
// the mouse cursor hovers over the star.
function changeStarColour(num, classTarget , classname) {
    switch (eval(num)) {
        case 1:
            document.querySelector(classTarget + "[value='1']").className = "fas " + classname;
            rating = 1;
            break;
        case 2:
            document.querySelector(classTarget + "[value='1']").className = "fas " + classname;
            document.querySelector(classTarget + "[value='2']").className = "fas " + classname;
            rating = 2;
            break;
        case 3:
            document.querySelector(classTarget + "[value='1']").className = "fas " + classname;
            document.querySelector(classTarget + "[value='2']").className = "fas " + classname;
            document.querySelector(classTarget + "[value='3']").className = "fas " + classname;
            rating = 3;
            break;
        case 4:
            document.querySelector(classTarget + "[value='1']").className = "fas " + classname;
            document.querySelector(classTarget + "[value='2']").className = "fas " + classname;
            document.querySelector(classTarget + "[value='3']").className = "fas " + classname;
            document.querySelector(classTarget + "[value='4']").className = "fas " + classname;
            rating = 4;
            break;
        case 5:
            document.querySelector(classTarget + "[value='1']").className = "fas " + classname;
            document.querySelector(classTarget + "[value='2']").className = "fas " + classname;
            document.querySelector(classTarget + "[value='3']").className = "fas " + classname;
            document.querySelector(classTarget + "[value='4']").className = "fas " + classname;
            document.querySelector(classTarget + "[value='5']").className = "fas " + classname;
            rating = 5;
            break;
    }
}