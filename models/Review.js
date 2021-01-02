"use strict"

class Review {
    constructor(id, restaurant_id, user_id, review, rating, datePosted) {
        this.id = id;
        this.restaurant_id = restaurant_id;
        this.user_id = user_id;
        this.review = review;
        this.rating = rating;
        this.datePosted = datePosted;
    }
    getId() {
        return this.id;
    }
    getRestaurant_ID() {
        return this.restaurant_id;
    }
    getUser_ID() {
        return this.user_id;
    }
    getReview() {
        return this.review;
    }
    getRating() {
        return this.rating;
    }
    getDatePosted() {
        return this.datePosted;
    }
    setRestaurant_ID(restaurant_id) {
        this.restaurant_id = restaurant_id;
    }
    setUser_ID(user_id) {
        this.user_id = user_id
    }
    setReview(review) {
        this.review = review;
    }
    setRating(rating) {
        this.rating = rating;
    }
    setDatePosted(datePosted) {
        this.datePosted = datePosted;
    }
}
module.exports = Review;