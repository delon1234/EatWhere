"use strict"
const { response } = require("express");
var db = require("../db-connection");
const Neighbourhood = require("./Neighbourhood");
class RestaurantsDB
{
    /* for search and filter to display list of neighbourhoods, categories, cuisines*/
    getNeighbourhoodsCategoriesCuisines(request, respond){
        var sql = "SELECT * FROM EatWhere.Neighbourhoods ORDER BY Neighbourhood; SELECT * FROM EatWhere.Categories ORDER BY Category; SELECT * FROM EatWhere.Cuisines ORDER BY Cuisine";
        db.query(sql, function (error, result) {
            if (error) {
                throw error;
            }
            else {
                respond.json(result);
            }
        });
    }
    getAllRestaurants(request, respond){
        var sql = "SELECT Restaurants.Restaurant_ID, Restaurants.Name, Restaurants.Location, Restaurants.Telephone_Number, Restaurants.Website, Neighbourhoods.Neighbourhood, GROUP_CONCAT(DISTINCT Images.Image_Link) ImagesCollection, GROUP_CONCAT(DISTINCT Cuisines.cuisine) Cuisine_Group, GROUP_CONCAT(DISTINCT categories.Category) Category_Group, GROUP_CONCAT(DISTINCT OpeningHours.Start_At) AS StartingHours, GROUP_CONCAT(DISTINCT OpeningHours.End_At) EndingHours FROM Restaurants LEFT JOIN Images ON Restaurants.Restaurant_ID = Images.Restaurant_ID LEFT JOIN RestaurantsCuisines ON Restaurants.Restaurant_ID = RestaurantsCuisines.Restaurant_ID LEFT JOIN Cuisines ON restaurantscuisines.Cuisine_ID = cuisines.cuisine_ID LEFT JOIN RestaurantsCategories ON restaurants.Restaurant_ID = restaurantscategories.Restaurant_ID LEFT JOIN Categories ON restaurantscategories.Category_ID = Categories.Category_ID LEFT JOIN OpeningHours ON OpeningHours.Restaurant_ID = restaurants.Restaurant_ID LEFT JOIN Neighbourhoods ON restaurants.Neighbourhood_ID = Neighbourhoods.Neighbourhood_ID WHERE OpeningHours.day = DAYNAME(curdate()) GROUP BY restaurants.restaurant_id;";
        db.query(sql, function (error, result) {
            if (error) {
                throw error;
            }
            else {
                respond.json(result);
            }
        });
    }
    searchOrFilterRestaurants(request, respond){
        var sql = "SELECT Restaurants.Restaurant_ID, Restaurants.Name, Restaurants.Location, Restaurants.Telephone_Number, Restaurants.Website, Neighbourhoods.Neighbourhood, GROUP_CONCAT(DISTINCT Images.Image_Link) ImagesCollection, GROUP_CONCAT(DISTINCT Cuisines.cuisine) Cuisine_Group, GROUP_CONCAT(DISTINCT categories.Category) Category_Group, GROUP_CONCAT(DISTINCT OpeningHours.Start_At) AS StartingHours, GROUP_CONCAT(DISTINCT OpeningHours.End_At) EndingHours FROM Restaurants LEFT JOIN Images ON Restaurants.Restaurant_ID = Images.Restaurant_ID  LEFT JOIN RestaurantsCuisines ON Restaurants.Restaurant_ID = RestaurantsCuisines.Restaurant_ID LEFT JOIN Cuisines ON restaurantscuisines.Cuisine_ID = cuisines.cuisine_ID LEFT JOIN RestaurantsCategories ON restaurants.Restaurant_ID = restaurantscategories.Restaurant_ID LEFT JOIN Categories ON restaurantscategories.Category_ID = Categories.Category_ID LEFT JOIN OpeningHours ON OpeningHours.Restaurant_ID = restaurants.Restaurant_ID LEFT JOIN Neighbourhoods ON restaurants.Neighbourhood_ID = Neighbourhoods.Neighbourhood_ID WHERE OpeningHours.day = DAYNAME(curdate())";
        var open = " AND CURRENT_TIME() >= OpeningHours.Start_At AND CURRENT_TIME() <= OpeningHours.End_At";
        var grp = " GROUP BY restaurants.restaurant_id";
        var having = false;
        if (request.body.restaurant_name != null) {
            var restaurantnamefilter = " AND Restaurants.name LIKE \"%";
            restaurantnamefilter += request.body.restaurant_name + "%\"";
            sql += restaurantnamefilter;
        }
        for (let i = 0; i < request.body.categories.length; i++)
        {
            if (request.body.categories[i] == "Open Now") {
                sql += open;
            }
            else{
                if (!having) 
                {
                    grp += " HAVING Category_Group LIKE \"%" + request.body.categories[i] + "%\"";
                    having = true;
                }
                else
                {
                    grp += " AND " + "Category_Group LIKE \"%" + request.body.categories[i] + "%\"";
                }
            }
        }
        for (let i = 0; i < request.body.cuisines.length; i++){
            if (!having) {
                grp += " HAVING Cuisine_Group LIKE \"%" + request.body.cuisines[i] + "%\"";
                having = true;
            }
            else{
                grp += " AND " + "Cuisine_Group LIKE \"%" + request.body.cuisines[i] + "%\"";
            }
        }
        if (request.body.neighbourhood != null){
            if (!having) {
                grp += " HAVING Neighbourhood LIKE \"%" + request.body.neighbourhood + "%\"";
                having = true;
            }
            else{
                grp += " AND " + "Neighbourhood LIKE \"%" + request.body.neighbourhood + "%\"";
            }
        }
        sql += grp;
        console.log(sql);
        db.query(sql, function (error, result) {
            if (error) {
                throw error;
            }
            else {
                respond.json(result);
            }
        });
    }

}
module.exports = RestaurantsDB;