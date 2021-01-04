"use strict"
var db = require("../db-connection");
const Review = require("../models/Review");
class ReviewsDB
{
    getReviewsByRestaurant(request, respond){
        var sql = "SELECT Reviews.Review_ID, Reviews.Restaurant_ID, Reviews.User_ID, Reviews.Review, Reviews.Rating, Reviews.Date_Posted FROM EatWhere.Reviews JOIN Restaurants ON Reviews.Restaurant_ID = Restaurants.Restaurant_ID";
    }
}
module.exports = ReviewsDB;