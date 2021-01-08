"use strict"
var db = require("../db-connection");
const Review = require("../models/Review");
class ReviewsDB
{
    getReviewsByRestaurant(request, respond){
         var sql = "SELECT User_Accounts.User_Name, User_Accounts.Reviews_Posted, User_Accounts.Profile_Picture, reviews.Review_ID, reviews.rating, reviews.Review, reviews.Date_Posted, GROUP_CONCAT(reviewimages.Review_Image) FROM Reviews INNER JOIN User_Accounts ON reviews.User_ID = user_accounts.User_ID LEFT JOIN reviewimages ON reviews.Review_ID = reviewimages.Review_ID WHERE reviews.restaurant_id = ? GROUP BY Reviews.Review_ID ORDER BY Rating DESC";
         var restaurant_id = request.params.restaurant_id;
         db.query(sql, restaurant_id, function (error, result) {
            if(error){
                throw error;
            }
            else{
                respond.json(result);
            }
          });
    }
    getReviewsByRestaurantSortByReviewScoreAscending(request, respond){
        var sql = "SELECT User_Accounts.User_Name, User_Accounts.Reviews_Posted, User_Accounts.Profile_Picture, reviews.Review_ID, reviews.rating, reviews.Review, reviews.Date_Posted, GROUP_CONCAT(reviewimages.Review_Image) FROM Reviews INNER JOIN User_Accounts ON reviews.User_ID = user_accounts.User_ID LEFT JOIN reviewimages ON reviews.Review_ID = reviewimages.Review_ID WHERE reviews.restaurant_id = ? GROUP BY Reviews.Review_ID ORDER BY Rating ASC";
        var restaurant_id = request.params.restaurant_id;
         db.query(sql, restaurant_id, function (error, result) {
            if(error){
                throw error;
            }
            else{
                respond.json(result);
            }
          });
    }
    postReview(request, respond){
        var reviewid;
        var now = new Date();
        var reviewObject = new Review(null, request.params.restaurant_id, request.body.userid, request.body.review, request.body.rating, now.toString());
        var sql = "INSERT INTO EatWhere.reviews(Restaurant_ID, User_ID, Review, Rating, Date_Posted) VALUES(?, ?, ?, ?, NOW())"
        var values = [reviewObject.getRestaurant_ID(), reviewObject.getUser_ID(), reviewObject.getReview(), reviewObject.getRating()];
        db.query(sql, values, function (error, result) {
            if(error){
                throw error;
            }
            else{
                respond.json(result);
                reviewid = result.insertId;
                var insertImage = "INSERT INTO EatWhere.reviewimages (Review_ID, Review_Image) VALUES (?,?)";
                for (let i = 0; i < request.body.reviewimages.length; i++){
                    db.query(insertImage, [reviewid, request.body.reviewimages[i]], function (error, result) {
                        if(error){
                            throw error;
                        }
                        else{
                            respond.json(result);
                        }
                    });
                }
            }
          });
    }
    editReview(request, respond){
        var now = new Date();
        var reviewObject = new Review(request.params.review_id, request.params.restaurant_id, request.body.userid, request.body.review, request.body.rating, now.toString());
        var sql = "UPDATE EatWhere.Reviews SET Review = ?, Rating = ?, Date_Posted = NOW() WHERE Review_ID = ? AND User_ID = ?";
        var values = [reviewObject.getReview(), reviewObject.getRating(), reviewObject.getId(), reviewObject.getUser_ID()];
        db.query(sql, values, function (error, result) 
        {
            if(error){
                throw error;
            }
            else{
                respond.json(result);
            }
                  });
    }
    deleteReview(request, respond){
        var sql = "DELETE FROM EatWhere.Reviews WHERE Reviews.Review_ID= ? AND User_ID = ?";
        var values = [request.params.review_id, request.body.userid]
        db.query(sql, values, function (error, result) {
            if(error){
                throw error;
            }
            else{
                respond.json(result);
            }
          });
    }

}
module.exports = ReviewsDB;