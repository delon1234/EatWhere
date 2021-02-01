//const e = require("express");

function fetchNeighbourhoodsCuisinesCategories(){
    var request = new XMLHttpRequest();
    request.open("GET", restauranturl, true);
    request.onload = function(){
        data = JSON.parse(request.responseText);
        //seperate the data into neighbourhoods, cuisines and categories
        neighbourhoods = data[0];
        categories = data[1];
        cuisines = data[2];
        setNeighbourhoodsCuisinesCategories(neighbourhoods, categories, cuisines);
    };
    
    request.send();
}
function setNeighbourhoodsCuisinesCategories(neighbourhoods, categories, cuisines){
    var lengthNeighbourhoods = neighbourhoods.length;
    var lengthCategories = categories.length;
    var lengthCuisines = cuisines.length;
    for (var i = 0; i < lengthNeighbourhoods; i++){
        var temp = neighbourhoods[i].Neighbourhood;
        var cell = `<div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${temp}" id="${temp}" name = "neighbourhood" onclick="onlyOneNeighbourhood(this)" >
                        <label class="form-check-label" for="${temp}">${temp}</label>
                    </div>`
        document.getElementById("neighbourhoods").insertAdjacentHTML('beforeend', cell);
    }
    for (var i = 0; i < lengthCuisines; i++){
        var temp = cuisines[i].Cuisine;
        var cell = `<div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${temp}" id="${temp}">
                        <label class="form-check-label" for="${temp}">${temp}</label>
                    </div>`
        document.getElementById("cuisines").insertAdjacentHTML('beforeend', cell);
    }
    for (var i = 0; i < lengthCategories; i++){
        var temp = categories[i].Category;
        var cell = `<div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${temp}" id="${temp}">
                        <label class="form-check-label" for="${temp}">${temp}</label>
                    </div>`
        document.getElementById("categories").insertAdjacentHTML('beforeend', cell);
    }
    
}
function onlyOneNeighbourhood(checkbox){
    var checkboxes = document.getElementsByName('neighbourhood')
    checkboxes.forEach((item) => { //loops through all neighbourhood checkboxes and check if they are checked
        if (item !== checkbox) item.checked = false
    }) // uncheck all checkboxes that isnt the checkbox clicked by the user hence ensuring only one checkbox/neighbourhood
    //is checked/selected
}
function filterRestaurant(){
    var categoriesarray = [];
    var cuisinesarray = [];
    var neighbourhood = "";
    var neighbourhoodsData = document.querySelectorAll("#neighbourhoods input");
    for (var i = 0; i < neighbourhoodsData.length; i++){
        if (neighbourhoodsData[i].checked){
            neighbourhood = neighbourhoodsData[i].value;
            break; //can only search for restaurant by 1 neighbourhood
        }
    }
    var cuisinesData = document.querySelectorAll("#cuisines input");
    for (var i = 0; i < cuisinesData.length; i++){
        if (cuisinesData[i].checked){
            cuisinesarray.push(cuisinesData[i].value);
        }
    }
    var categoriesData = document.querySelectorAll("#categories input");
    for (var i = 0; i < categoriesData.length; i++){
        if (categoriesData[i].checked){
            categoriesarray.push(categoriesData[i].value);
        }
    }
    if (document.getElementById("opennow").checked){
        categoriesarray.push("Open Now");
    }
    var searchObject = new Object();
    searchObject.restaurant_name = document.getElementById("nav-searchtext").value;
    searchObject.categories = categoriesarray;
    searchObject.cuisines = cuisinesarray;
    searchObject.neighbourhood = neighbourhood;
    console.log(searchObject);
    var request = new XMLHttpRequest();
    request.open("POST", "/restaurants", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function(){
        var result = JSON.parse(request.responseText);
        console.log(result);
        restaurants = result[0];
        console.log(restaurants);
        reviewsData = result[1];
        displayRestaurants();
    };
    request.send(JSON.stringify(searchObject));
}
function getRestaurantsData(){ //get all restaurant data for restaurant listings page
    var request = new XMLHttpRequest();
    request.open("GET", "/restaurants/all", true);
    request.onload = function() {
        restaurantsData = JSON.parse(request.responseText);
        restaurants = restaurantsData[0];
        reviewsData = restaurantsData[1];
        console.log(restaurantsData);
        displayRestaurants();
    };
    request.send();
}
function displayRestaurants(){ // populate restaurant listings
    totalRestaurants = restaurants.length;
    totalReviews = reviewsData.length;
    console.log("Display Restaurants")
    document.getElementById("restaurantscontainer").innerHTML = "";
    for (var i = 0; i < totalRestaurants; i++){
        var frontimg = "";
        var avgreview;
        var noofreview;
        //this is to check for whether imagescollection returned from the api is not an array(string) or an array
        //for getallRestaurants imagescollection is returned as a string but for searchandfilterRestaurants
        //imagescollection is returned as an array.
        if (!Array.isArray(restaurants[i].ImagesCollection))// if not array which means it is string
        {
            //as imagescollection is a string of links to the images of the restaurants seperated by commas,
            //e.g. "/image1.png,/image2.png" hence we split this string by comma into ["/image1.png", "/image2.png"]
            restaurants[i].ImagesCollection = restaurants[i].ImagesCollection.split(","); 
        }
        imglength = restaurants[i].ImagesCollection.length;
        //loops through the array of imagecollection and gets frontimg from imagecollection
        //front images will be denoted with front in their name
        for (var index = 0; index < imglength; index++){
            if (restaurants[i].ImagesCollection[index].includes("front")){
                frontimg = restaurants[i].ImagesCollection[index];
                break;
            }
        }
        //loops through the array of reviewdata for all restaurants and checks if the corresponding reviewdata matches the 
        //restaurant based on its id, if it matches, get the average rating and number of reviews
        for (var loopcount = 0; loopcount < totalReviews; loopcount++){
            if (reviewsData[loopcount].Restaurant_ID == restaurants[i].Restaurant_ID){
                avgreview = reviewsData[loopcount].AverageRating;
                noofreview = reviewsData[loopcount].Review_No;
            }
        }
        //set stars based on average review rating of restaurant
        var stars = setStars(avgreview);
        //inserts each restaurant listing HTML code onto the page
        var listing = `<div onclick = "gotoRestaurantDetails(this)" style="border-style: solid;
        border-width: 3px; margin-bottom : 10px" item="${restaurants[i].Restaurant_ID}">
                            <img src="${frontimg}" style="width:200px;height:200px;display: inline-block;">
                            <span>${restaurants[i].Name}</span>
                            <span>${stars}</span>
                            <span>${noofreview} Reviews</span>
                        </div>`;
        document.getElementById("restaurantscontainer").insertAdjacentHTML("beforeend", listing);
        //this inserts the restaurant listing just before the end of the restaurantscontainer closing tag
        //ensuring that the order of restaurants is the same as retrieved from the database
    }
}
function gotoRestaurantDetails(element){
    //this is called when restaurant listing is clicked. 
    //it goes to restaurant details page where the page will be filled with details of the restaurant clicked.
    var item = element.getAttribute("item"); //knows which restaurant is clicked
    localStorage["item"] = item;
    window.location.href = "restaurant.html" //change to restaurant details page.
}
function setStars(avgreview){
    //This function adds HTML code for star images (full, half and empty) into a string to be outputted/returned.
    //it takes in average review which could be a float like 3.5 and adds the appropriate star images to match
    //the average review.
    var star = "";
    var counter = 5; // each restaurant must have 5 stars in total
    for (var j = avgreview; j > 0; j--){
        if (j >= 1) //full star for every 1 point of review
        {
            star += `<i class="fas fa-star"></i>`;
            counter--;
        }
        else if (j >= 0.5){ //half star for every 0.5 point of review
            //this wont trigger if j is >=1 as this condition is else if
            //hence half star is only added when avg review has a decimal of 0.5 to <1
            star += `<i class="fas fa-star-half-alt"></i>`;
            counter--;
        }
    }
    for (var z = 0; z < counter; z++){
        star += `<i class="far fa-star"></i>`; //add empty stars for total stars to reach 5.
    }
    return star; //returns a string of html code to set star images
}
function displayRestaurantDetails(){
    item = localStorage["item"]; //gets item from localStorage to know which restaurant has been clicked
    //as item is the restaurant id, we will loop through the array of all restaurants and find the index of the
    //restaurant so we can retrieve the details of the restaurant
    for (var i = 0; i < restaurants.length; i++){
        if (restaurants[i].Restaurant_ID == item){
            restaurant_id = restaurants[i].Restaurant_ID;
            item = i;
        }
    }
    var request = new XMLHttpRequest();
    var url = "/restaurants/" + restaurant_id;
    request.open("GET", url, true);
    request.onload = function() {
        var openinghoursData = JSON.parse(request.responseText);
        //google maps implementation
        var infoWindow = new google.maps.InfoWindow();
        var marker, i;
        var markers = [];
        var storeLocation = { lat: restaurants[item].Latitude, lng: restaurants[item].Longtitude }; 
        //storelocation object of latitude and longtitude for map and marker to set location on the restaurant.
        //latitude and longtitude of a restaurant is stored in the database
        //initialise map
        var map = new google.maps.Map(document.getElementById("my-map"), {
            zoom: 14,
            center: storeLocation,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });
        // initialise marker for storelocation
        marker = new google.maps.Marker({
            position: storeLocation,
            map: map,
            title: "Find us here",
            icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/restaurant.png"
            }
        });
        markers.push(marker);
        google.maps.event.addListener(marker, "click", (function (marker, i ){
            return function(){
                infoWindow.setContent(restaurants[item].Name); 
                infoWindow.open(map, marker);
            }
        })(marker, i)); // add listener for onclick of the restaurant icon to open infowindow
        // loops reviewsdata where all restaurants reviews data are and finds 
        // the average and number of reviews for the right restaurant based on matching ids.
        for (var loopcount = 0; loopcount < reviewsData.length; loopcount++){
            if (reviewsData[loopcount].Restaurant_ID == restaurant_id){
                avgreview = reviewsData[loopcount].AverageRating;
                noofreview = reviewsData[loopcount].Review_No;
            }
        }
        var star = setStars(avgreview); //gets a string of HTML code for star images for average review rating.
        //populate restaurant details
        document.getElementById("review_stars").innerHTML = star;
        if (avgreview != null){
            //I round the average review rating to 2 decimal places to make it more visually appealing and consistent as
            //there could be average rating of 3.3333 
            document.getElementById("review_score").innerHTML += avgreview.toFixed(2) + "/5";
        }
        else {
            //if no review has been made, there will not be review score/rating
            document.getElementById("review_score").innerHTML += "No Reviews Has Been Made";
        }
        document.getElementById("review_no").innerHTML = noofreview + " reviews";
        document.getElementById("name").innerHTML = restaurants[item].Name;
        document.getElementById("location").innerHTML = restaurants[item].Location;
        document.getElementById("telephone_number").innerHTML += restaurants[item].Telephone_Number;
        document.getElementById("website").innerHTML += restaurants[item].Website;
        document.getElementById("website").href = restaurants[item].Website;
        document.getElementById("neighbourhood").innerHTML += restaurants[item].Neighbourhood;
        document.getElementById("cuisine").innerHTML = restaurants[item].Cuisine_Group;
        document.getElementById("category").innerHTML = restaurants[item].Category_Group;
        var table = document.getElementById("table");
        // Populate table with opening hours for every day
        // Substring from 0 to length - 3 is to get rid of the milliseconds e.g. 11:00:00 changes to 11:00
        // as milliseconds is redundant
        for (var i = 0; i < openinghoursData.length; i++){
            var tablecell = `<tr>
                            <td>${openinghoursData[i].Day}</td>
                            <td>${openinghoursData[i].Start_At.substring(0, openinghoursData[i].Start_At.length - 3)} - ${openinghoursData[i].End_At.substring(0, openinghoursData[i].End_At.length - 3)}</td>
                            </tr>`
            table.insertAdjacentHTML("beforeend", tablecell);// add tablecell before the ending of the table closing tag
        }
    };
    request.send();
}
function getRestaurantsDataForRestaurant(){
    var request = new XMLHttpRequest();
    request.open("GET", "/restaurants/all", true);
    request.onload = function() {
        restaurantsData = JSON.parse(request.responseText);
        restaurants = restaurantsData[0]; //all data abt restaurant excluding reviews
        reviewsData = restaurantsData[1]; //avg rating and no of reviews of all restaurants
        console.log(reviewsData);
        displayRestaurantDetails();
    };
    request.send();
}

