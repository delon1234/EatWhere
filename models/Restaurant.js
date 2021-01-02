"use strict"

class Restaurant
{
    constructor(id, name, location , telephone_number, neighbourhood, website){
        this.id = id;
        this.name = name;
        this.location = location;
        this.telephone_number = telephone_number;
        this.neighbourhood = neighbourhood;
        this.website = website;
    }
    getName(){
        return this.name;
    }
    getLocation(){
        return this.location;
    }
    getTelephone_Number(){
        return this.telephone_number;
    }
    getNeighbourhood(){
        return this.neighbourhood;
    }
    getWebsite(){
        return this.website;
    }

}
module.exports = Restaurant;