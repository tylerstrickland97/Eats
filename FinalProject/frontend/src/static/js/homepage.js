import api from './APIClient.js';
let restaurantArray = [];
const searchButton = document.getElementById("search-button");
const sortButton = document.getElementById("sort-dropdown");
let searchInput = document.getElementById("search-input");
let currentUserId;
window.onload = () => {
    // Check if user logged in before doing anything
    api.getCurrentUser().then(current => {
        currentUserId = current.id;

        // get restaurants
        api.getRestaurants().then(restaurants => {
            restaurantArray = restaurants;
            loadRestaurants(restaurantArray);

            searchButton.addEventListener("click", (e) => {
                let searchedRestaurants = search(restaurantArray, searchInput.value);
                loadRestaurants(searchedRestaurants);
            });

            sortButton.addEventListener("click", (e) => {
                const sortMethod = e.target.innerHTML;
                // For each case just add the sorting algorithm
                switch(sortMethod) {
                    case "Alphabetically":
                        restaurantArray.sort((a, b) => {
                            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                        });
                        loadRestaurants(restaurantArray);
                        break;
                    case "Favorites":
                        let nonFavorite = [];
                        let isFavorite = [];
                        api.getUserFavorites(currentUserId).then(favorites => {
                            restaurants.forEach(r => {
                                let favoriteFound = false;
                                favorites.forEach(f => {
                                    if (r.id == f.restaurant_id) {
                                        isFavorite.push(r);
                                        favoriteFound = true;
                                    }
                                })
                                if (!favoriteFound) {
                                    nonFavorite.push(r);
                                }
                            })
                            restaurantArray = isFavorite.concat(nonFavorite);
                            console.log(restaurantArray);
                            loadRestaurants(restaurantArray);
                        })
                        break;
                    default:
                        return;
                }
            });
        });
            
    })
    .catch(err => {
        console.log("We are not logged in");
        document.location = '/';
    });

    
}

// arr = array of restaurant JSON object
// query = search query
function search(arr, query) {
    // convert query to alpha-numeric to safeguard names with dashes and apostrophes
    let q = query.replace(/[^0-9a-z]/gi, '');

    // return based on contained substring anywhere (query = FC, restaurant KFC included)
    // return arr.filter((r) => r.name.toLowerCase().replace(/[^0-9a-z]/gi, '').includes(q.toLowerCase()));

    // return based on contained substring from start (query = FC, restaurant KFC NOT included)
    return arr.filter((r) => r.name.toLowerCase().replace(/[^0-9a-z]/gi, '').substring(0, q.length).includes(q.toLowerCase()));
}

function loadRestaurants(restaurants) {
    api.getUserFavorites(currentUserId).then(favorites => {
        // Reset restaurants
        clearRestaurantHTML();

        if (restaurants.length == 0) {
            // create html for no results found
            console.log("No Results Found");
            return;
        }

        const restaurantList = document.querySelector('.restaurant-grid');
        // Iterate through restaurants
        restaurants.forEach(r => {
            restaurantList.appendChild(createRestaurantHTML(r, favorites)); 
        });
    });
}

function filterRestaurantName(restaurant_name) {
    let filtered_name = restaurant_name.replaceAll(/[^A-Za-z\s]/g, '');
    filtered_name = filtered_name.replaceAll(' ', '-');
    return filtered_name;
}

function clearRestaurantHTML() {
    const restaurantList = document.querySelector('.restaurant-grid');
    restaurantList.innerHTML = '';
}

function createRestaurantHTML(restaurant, favorites) {
    let newRestaurant = document.createElement('div');
    newRestaurant.className = "restaurant-preview";

    let restaurantImg = document.createElement('div');
    restaurantImg.className = "restaurant-image";
    let logo = document.createElement('img');
    logo.src = `imgs/restaurant-logos/${filterRestaurantName(restaurant.name)}-logo.png`;
    restaurantImg.appendChild(logo);


    let favoriteButton = document.createElement('button');
    favoriteButton.className = "favorite-button";
    let buttonImg = document.createElement('img');

    // Initialize favorite status
    let isFavorite;
    if (favorites.find(f => f.restaurant_id == restaurant.id)) {
        isFavorite = true;
        buttonImg.src = "imgs/yellow_favorited_img.png";
    } else {
        isFavorite = false;
        buttonImg.src = "imgs/star.webp";
    }

    favoriteButton.addEventListener('click', function() {
        if (isFavorite) {
            api.removeUserFavorite(currentUserId, restaurant.id).then(result => {
                console.log('successfully removed favorite');
                buttonImg.src = 'imgs/star.webp';
                isFavorite = !isFavorite;
            }).catch(err => {
                console.log('error removing favorite');
            })
        } else {
            api.addUserFavorite(currentUserId, restaurant.name).then(result => {
                console.log('successfully added favorite');
                buttonImg.src = 'imgs/yellow_favorited_img.png';
                isFavorite = !isFavorite;  
            }).catch(err => {
                console.log('error adding favorite');
            })
        }
    })

    favoriteButton.appendChild(buttonImg);
    restaurantImg.appendChild(favoriteButton);

    newRestaurant.appendChild(restaurantImg);

    let name = document.createElement('p');
    name.className = "restaurant-name";
    name.innerHTML = restaurant.name;
    newRestaurant.appendChild(name);

    // let details = document.createElement('div');
    // details.className = "restaurant-details";
    // let address = document.createElement('p');
    // address.className = "restaurant-address";
    // address.innerHTML = restaurant.address;
    // let distance = document.createElement('p');
    // distance.className = "restaurant-distance";
    // distance.innerHTML = restaurant.distance;
    // let style = document.createElement('p');
    // style.className = "restaurant-style";
    // style.innerHTML = restaurant.category;
    // details.appendChild(address);
    // details.appendChild(distance);
    // details.appendChild(style);
    // newRestaurant.appendChild(details);

    let view = document.createElement('div');
    view.className = "restaurant-view";
    let viewButton = document.createElement('a');
    viewButton.className = "restaurant-view-button";
    viewButton.href = '/restaurant?id=' + restaurant.id;
    viewButton.innerHTML = "View Menu";
    view.appendChild(viewButton);
    newRestaurant.appendChild(view);

    return newRestaurant;

}
