const Neighbourhood = require("../../models/Neighbourhood");

function fetchNeighbourhoodsCuisinesCategories(){
    var request = new XMLHttpRequest();
    request.open("GET", restauranturl, true);
    request.onload = function(){
        console.log(request.responseText);
        data = JSON.parse(request.responseText);
        neighbourhoods = data[0];
        categories = data[1];
        cuisines = data[2];
    };
    
    request.send();
}
function getRestaurantsData(){
    var request = new XMLHttpRequest();
    request.open("GET", "/restaurants/all", true);
    request.onload = function() {
        restaurantsData = JSON.parse(request.responseText);
        restaurants = restaurantsData[0];
        reviewsData = restaurantsData[1];
        console.log(restaurants[0]);
        console.log(reviewsData);
    };
    request.send();
}
function displayRestaurants(){
    totalRestaurants = restaurants.length;
    for (var i = 0; i < totalRestaurants; i++){
        var listing = "Insert RestaurantListing HTML";
    }
}
