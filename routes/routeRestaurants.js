"use strict"

const RestaurantsDB = require("../models/RestaurantsDB");
var RestaurantsDBObject = new RestaurantsDB();

function routeRestaurants(app){
    app.route("/restaurants")
        .get(RestaurantsDBObject.getNeighbourhoodsCategoriesCuisines)
        .post(RestaurantsDBObject.searchOrFilterRestaurants);
    app.route("/restaurants/all")
        .get(RestaurantsDBObject.getAllRestaurants)
    app.route("/restaurants/:restaurant_id")
        .get(RestaurantsDBObject.getOpeningHoursForRestaurant);
    
}
module.exports = {routeRestaurants};