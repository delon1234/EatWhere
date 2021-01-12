const { response } = require("express");

function fetchNeighbourhoodsCuisinesCategories(){
    var request = new XMLHttpRequest();
    request.open("GET", restauranturl, true);
    request.onload = function(){
        neighbourhood_array = JSON.parse(request.responseText);
    };
    //get result[0], result[1], result[2]
    request.send();
}