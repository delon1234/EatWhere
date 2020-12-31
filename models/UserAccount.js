"use strict"

class users{
    constructor(id, user_id, first_name, last_name, password, email, gender, mobile_number, address, reviews_posted, profile_picture, activated, facebook_account_id, confirmed){
        this.id = id;
        this.user_id = user_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.password = password;
        this.email = email;
        this.gender = gender;
        this.mobile_number = mobile_number;
        this.address = address;
        this.reviews_posted = reviews_posted;
        this.profile_picture = profile_picture;
        this.activated = activated;
        this.facebook_account_id = facebook_account_id;
        this.confirmed = confirmed;
    }
    getId(){
        return this.id;
    }
    getUserId(){
        return this.user_id;
    }
    getFirstName(){
        return this.first_name;
    }
    getLastName(){
        return this.last_name;
    }
    getPassword(){
        return this.password;
    }
    getEmail(){
        return this.email;
    }
    getGender(){
        return this.gender;
    }
    getMobileNumber(){
        return this.mobile_number;
    }
    getAddress(){
        return this.address;
    }
    getReviewsPosted(){
        return this.reviews_posted;
    }
    getProfilePicture(){
        return this.profile_picture;
    }
    getFacebookAccountID(){
        return this.facebook_account_id;
    }
    getConfirmed(){
        return this.confirmed;
    }
}
    module.exports = UserAccount;