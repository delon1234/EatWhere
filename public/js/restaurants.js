
function fetchNeighbourhoodsCuisinesCategories(){
    var request = new XMLHttpRequest();
    request.open("GET", restauranturl, true);
    request.onload = function(){
        console.log(request.responseText);
        data = JSON.parse(request.responseText);
        neighbourhoods = data[0];
        categories = data[1];
        cuisines = data[2];
    };
    
    request.send();
}
function getRestaurantsData(){
    var request = new XMLHttpRequest();
    request.open("GET", "/restaurants/all", true);
    request.onload = function() {
        restaurantsData = JSON.parse(request.responseText);
        restaurants = restaurantsData[0];
        reviewsData = restaurantsData[1];
        console.log(reviewsData);
        displayRestaurants();
    };
    request.send();
}
function displayRestaurants(){
    totalRestaurants = restaurants.length;
    for (var i = 0; i < totalRestaurants; i++){
        var frontimg = "";
        restaurants[i].ImagesCollection = restaurants[i].ImagesCollection.split(",");
        imglength = restaurants[i].ImagesCollection.length;
        //gets frontimg from imagecollection
        for (var index = 0; index < imglength; index++){
            if (restaurants[i].ImagesCollection[index].includes("front")){
                frontimg = restaurants[i].ImagesCollection[index];
                break;
            }
        }
        var listing = `<div onclick = "gotoRestaurantDetails(this)" item="${i}">
                            <img src="${frontimg}">
                            <h2>${restaurants[i].Name}</h2>
                        </div>`;
        document.getElementById("restaurantscontainer").insertAdjacentHTML("beforeend", listing);
    }
}
function gotoRestaurantDetails(element){
    var item = element.getAttribute("item");
    localStorage["item"] = item;
    window.location.href = "restaurant.html"
}
function displayRestaurantDetails(){
    //reviews"127.0.0.1:8080/restaurants/" + restaurant_id;
    item = localStorage["item"];
    restaurant_id = restaurants[item].Restaurant_ID;
    var request = new XMLHttpRequest();
    var url = "/restaurants/" + restaurant_id;
    request.open("GET", url, true);
    request.onload = function() {
        var openinghoursData = JSON.parse(request.responseText);
        console.log(openinghoursData);
        document.getElementById("name").innerHTML = restaurants[item].Name;
        document.getElementById("location").innerHTML = restaurants[item].Location;
        document.getElementById("telephone_number").innerHTML = restaurants[item].Telephone_Number;
        document.getElementById("website").innerHTML = restaurants[item].Website;
        document.getElementById("neighbourhood").innerHTML += restaurants[item].Neighbourhood;
        document.getElementById("cuisine").innerHTML = restaurants[item].Cuisine_Group;
        document.getElementById("category").innerHTML = restaurants[item].Category_Group;
        var table = document.getElementById("table");
        for (var i = 0; i < openinghoursData.length; i++){
            var tablecell = `<tr>
                            <td>${openinghoursData[i].Day}</td>
                            <td>${openinghoursData[i].Start_At} - ${openinghoursData[i].End_At}</td>
                            </tr>`
            table.insertAdjacentHTML("beforeend", tablecell);
        }
    };
    request.send();
}
//later need to try to not repeat
function getRestaurantsDataForRestaurant(){
    var request = new XMLHttpRequest();
    request.open("GET", "/restaurants/all", true);
    request.onload = function() {
        restaurantsData = JSON.parse(request.responseText);
        restaurants = restaurantsData[0];
        reviewsData = restaurantsData[1];
        console.log(reviewsData);
        displayRestaurantDetails();
    };
    request.send();
}

