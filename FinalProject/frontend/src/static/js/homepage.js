import api from './APIClient.js';

window.onload = () => {
    loadPage();

}

    function loadPage() {
        api.getCurrentUser().then(current => {
            let currentUserId = current.id;
            loadRestaurants(currentUserId);
            loadProfileIntoCache(currentUserId);
        }).catch(err => {
            console.log("We are not logged in");
            document.location = '/';
        });
    }

    function loadProfileIntoCache(currentUserId) {
       console.log('here');
    }

    function loadRestaurants(currentUserId) {
        api.getRestaurants().then(restaurants => {
            console.log(currentUserId);
            api.getUserFavorites(currentUserId).then(favorites => {
                restaurants.forEach(restaurant => {
                    fillRestaurantHTML(restaurant, favorites, currentUserId);
                });
            })
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

    function fillRestaurantHTML(restaurant, favorites, currentUserId) {
        const restaurantList = document.querySelector('.restaurant-grid');
        let favorite = false;
        for (let i = 0; i < favorites.length; i++) {
            if (restaurant.id == favorites[i].restaurant_id) {
                favorite = true;
                break;
            }
        }
        if (favorite) {
            restaurantList.appendChild(createFavoriteRestaurantHTML(restaurant, currentUserId));
        }
        else {
            restaurantList.appendChild(createNonFavoriteRestaurantHTML(restaurant, currentUserId));
        }
        
    }

    function createFavoriteRestaurantHTML(restaurant, currentUserId) {
        let newRestaurant = document.createElement('div');
        newRestaurant.className = "restaurant-preview";

        let restaurantImg = document.createElement('div');
        restaurantImg.className = "restaurant-image";
        let logo = document.createElement('img');
        logo.src = `imgs/restaurant-logos/${filterRestaurantName(restaurant.name)}-logo.png`;
        restaurantImg.appendChild(logo);


        let favoriteButton = document.createElement('button');
        favoriteButton.addEventListener('click', function() {
            //Call api object to add the favorite to the user
            api.removeUserFavorite(currentUserId, restaurant.id).then(result => {
                console.log('successfully removed favorite');
                clearRestaurantHTML();
                loadRestaurants(currentUserId);
                // favoriteButton.removeChild(favoriteButton.firstChild);
                // let buttonImg = document.createElement('img');
                // buttonImg.src = 'imgs/star.webp';
                // favoriteButton.appendChild(buttonImg);
                // api.getUserFavorites(currentUserId).then(results => {
                //     console.log(results);
                // }).catch(err => {
                //     console.log(err);
                // })

            }).catch(err => {
                console.log('error removing favorite');
            })
        });
        favoriteButton.className = "favorite-button";
        let buttonImg = document.createElement('img');
        buttonImg.src = "imgs/yellow_favorited_img.png";
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

    function createNonFavoriteRestaurantHTML(restaurant, currentUserId) {
        let newRestaurant = document.createElement('div');
        newRestaurant.className = "restaurant-preview";

        let restaurantImg = document.createElement('div');
        restaurantImg.className = "restaurant-image";
        let logo = document.createElement('img');
        logo.src = `imgs/restaurant-logos/${filterRestaurantName(restaurant.name)}-logo.png`;
        restaurantImg.appendChild(logo);


        let favoriteButton = document.createElement('button');
        favoriteButton.addEventListener('click', function() {
            //Call api object to add the favorite to the user
            api.addUserFavorite(currentUserId, restaurant.name).then(result => {
                console.log('successfully added favorite');
                clearRestaurantHTML();
                loadRestaurants(currentUserId);
                // favoriteButton.removeChild(favoriteButton.firstChild);
                // let buttonImg = document.createElement('img');
                // buttonImg.src = 'imgs/yellow_favorited_img.png';
                // favoriteButton.appendChild(buttonImg);
                // api.getUserFavorites(currentUserId).then(results => {
                //     console.log(results);
                // }).catch(err => {
                //     console.log(err);
                // })

            }).catch(err => {
                console.log('error adding favorite');
            })
        });
        favoriteButton.className = "favorite-button";
        let buttonImg = document.createElement('img');
        buttonImg.src = "imgs/star.webp";
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
