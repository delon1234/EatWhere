"use strict"

const RestaurantsDB = require("../models/RestaurantsDB");
var RestaurantsDBObject = new RestaurantsDB();

function routeRestaurants(app){
    app.route("/restaurants")
        .get(RestaurantsDBObject.getNeighbourhoodsCategoriesCuisines)
        .post(RestaurantsDBObject.searchOrFilterRestaurants);
    app.route("/restaurants/all")
        .get(RestaurantsDBObject.getAllRestaurants)
    
}
module.exports = {routeRestaurants};