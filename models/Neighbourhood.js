"use strict"

class Neighbourhood
{
    constructor(id, neighbourhood){
        this.id = id;
        this.neighbourhood = neighbourhood;
    }
    getID(){
        return this.id;
    }
    getNeighbourhood(){
        return this.neighbourhood;
    }
}
module.exports = Neighbourhood;