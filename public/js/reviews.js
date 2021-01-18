function getAllReviews(){
    var request = new XMLHttpRequest();
    var url = "/restaurants/"+ restaurant_id + "/reviews";
    request.open('GET', url , true);

    //This command starts the calling of the comments api
    request.onload = function() {
        //get all the comments records into our comments array
        reviews = JSON.parse(request.responseText);
        console.log(reviews)
        for (var i = 0; i < reviews.length; i++){
            var cell = `<div class="container" style="margin-top:50px">
                            <div id = "name${i}">User ID:${reviews[i].User_Name}</div>
                            <div id = "reviews_posted${i}">Contributed ${reviews[i].Reviews_Posted} Reviews</div>
                            <div id = "review${i}">${reviews[i].Review}</div>
                            <div id = "date_posted${i}">Date Posted:${reviews[i].Date_Posted}</div>
                            <div>Rating: ${reviews[i].rating}</div>
                        </div>`;
                        // later add reviewimage and profilepicture
            var reviewsarea = document.getElementById("reviewsarea");
            reviewsarea.insertAdjacentHTML("beforeend", cell);
        }
    };

    request.send();
}