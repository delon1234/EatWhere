
function fetchNeighbourhoodsCuisinesCategories(){
    var request = new XMLHttpRequest();
    request.open("GET", restauranturl, true);
    request.onload = function(){
        console.log(request.responseText);
        data = JSON.parse(request.responseText);
        //seperate the data into neighbourhoods, cuisines and categories
        neighbourhoods = data[0];
        categories = data[1];
        cuisines = data[2];
    };
    
    request.send();
}
function getRestaurantsData(){ //get all restaurant data for restaurant listings page
    var request = new XMLHttpRequest();
    request.open("GET", "/restaurants/all", true);
    request.onload = function() {
        restaurantsData = JSON.parse(request.responseText);
        restaurants = restaurantsData[0];
        reviewsData = restaurantsData[1];
        console.log(reviewsData);
        displayRestaurants();
    };
    request.send();
}
function displayRestaurants(){ // populate restaurant listings
    totalRestaurants = restaurants.length;
    for (var i = 0; i < totalRestaurants; i++){
        var frontimg = "";
        restaurants[i].ImagesCollection = restaurants[i].ImagesCollection.split(",");
        imglength = restaurants[i].ImagesCollection.length;
        //loop and gets frontimg from imagecollection
        for (var index = 0; index < imglength; index++){
            if (restaurants[i].ImagesCollection[index].includes("front")){
                frontimg = restaurants[i].ImagesCollection[index];
                break;
            }
        }
        var listing = `<div onclick = "gotoRestaurantDetails(this)" style="border-style: solid;
        border-width: 3px; margin-bottom : 10px" item="${i}">
                            <img src="${frontimg}" style="width:200px;height:200px">
                            <h2>${restaurants[i].Name}</h2>
                        </div>`;
        document.getElementById("restaurantscontainer").insertAdjacentHTML("beforeend", listing);
    }
}
function gotoRestaurantDetails(element){
    //this is called when restaurant listing is clicked. 
    //it goes to restaurant details page where the page will be filled with details of the restaurant clicked.
    var item = element.getAttribute("item"); //knows which restaurant is clicked
    localStorage["item"] = item;
    window.location.href = "restaurant.html" //change to restaurant details page.
}
function displayRestaurantDetails(){
    item = localStorage["item"];
    restaurant_id = restaurants[item].Restaurant_ID;
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
        //storelocation object of latitude and longtitude for map to set location
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
        //populate restaurant details
        document.getElementById("name").innerHTML = restaurants[item].Name;
        document.getElementById("location").innerHTML = restaurants[item].Location;
        document.getElementById("telephone_number").innerHTML += restaurants[item].Telephone_Number;
        document.getElementById("website").innerHTML += restaurants[item].Website;
        document.getElementById("website").href = "http://" + restaurants[item].Website;
        document.getElementById("neighbourhood").innerHTML += restaurants[item].Neighbourhood;
        document.getElementById("cuisine").innerHTML = restaurants[item].Cuisine_Group;
        document.getElementById("category").innerHTML = restaurants[item].Category_Group;
        // Populate table with opening hours for every day
        var table = document.getElementById("table");
        for (var i = 0; i < openinghoursData.length; i++){
            var tablecell = `<tr>
                            <td>${openinghoursData[i].Day}</td>
                            <td>${openinghoursData[i].Start_At} - ${openinghoursData[i].End_At}</td>
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

