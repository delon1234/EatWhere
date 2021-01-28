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
            for (var j = 0; j < reviews[i].rating; j++) {
                star += `<i class="fas fa-star"></i>`;
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
    var item = element.getAttribute("item");
    currentIndex = item;
    document.getElementById("usernameforedit").innerHTML = reviews[item].User_Name;
    document.getElementById("editReview").value = reviews[item].Review;
    //document.getElementById("editReviewRating").value = reviews[item].rating;
    changeStarColour(reviews[item].rating, ".fa-star.edit", "fa-star edit");
}
function deleteReviewRequest(element) {
    var response = confirm("Are you sure you want to delete this comment?");

    if (response == true) {
        var item = element.getAttribute("item"); //get the current item
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
        };
        console.log(JSON.stringify(reviews[currentIndex]))
        request.send(JSON.stringify(reviews[currentIndex]));
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
    // if consists of post, setAttribute "post"
    
    console.log(classname)
    var stars = document.getElementsByClassName(classname);
    //replace 1st instance of space to . to make queryselector work properly
    var classTarget = "." + classname.replace(" ", ".");
    //This is another way of writing 'for' loop, which initialises the 
    //star images to empty.
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