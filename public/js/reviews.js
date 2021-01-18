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
            var cell = `<div class="container" style="margin-top:50px">
                            <div>index ${i}</div>
                            <div id = "name${i}">User ID:${reviews[i].User_Name}</div>
                            <div id = "reviews_posted${i}">Contributed ${reviews[i].Reviews_Posted} Reviews</div>
                            <div id = "review${i}">${reviews[i].Review}</div>
                            <div id = "date_posted${i}">Date Posted:${reviews[i].Date_Posted}</div>
                            <div>Rating: ${reviews[i].rating}</div>
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
    document.getElementById("editReviewRating").value = reviews[item].rating;
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
        reviews[currentIndex].rating = document.getElementById("editReviewRating").value;
        request.onload = function() {
            getAllReviews();
        };
        console.log(JSON.stringify(reviews[currentIndex]))
        request.send(JSON.stringify(reviews[currentIndex]));
    }
}
function postReview() {
    var review = new Object();
    var userid = localStorage.getItem("user_id");
    console.log(userid);
    review.userid = userid;
    review.rating = document.getElementById("postReviewRating").value; // Value from HTML input text
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