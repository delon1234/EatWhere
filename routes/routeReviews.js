"use strict"
const reviewsdb = require("../models/ReviewsDB");
var reviewsDBObject = new reviewsdb();
function routeReviews(app){
    app.route("/restaurants/:restaurant_id/reviews")
        .get(reviewsDBObject.getReviewsByRestaurant)
        .post(reviewsDBObject.postReview);
    app.route("/restaurants/:restaurant_id/reviews/:review_id")
        .put(reviewsDBObject.editReview)
        .delete(reviewsDBObject.deleteReview);
         
}
module.exports = {routeReviews};