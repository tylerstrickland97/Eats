import api from './APIClient.js';

window.onload = () => {
    api.getRestaurants().then(restaurants => {
        
        restaurants.forEach(restaurant => {
            fillRestaurantHTML(restaurant);
        })
    });

    function fillRestaurantHTML(restaurant) {
        const restaurantList = document.querySelector('.restaurant-grid');
        restaurantList.appendChild(createRestaurantHTML(restaurant));
    }

    function createRestaurantHTML(restaurant) {
        let newRestaurant = document.createElement('div');
        newRestaurant.className = "restaurant-preview";

        let restaurantImg = document.createElement('div');
        restaurantImg.className = "restaurant-image";
        let logo = document.createElement('img');
        logo.src = `imgs/${restaurant.name}-logo.png`;
        restaurantImg.appendChild(logo);


        let favoriteButton = document.createElement('button');
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

        let details = document.createElement('div');
        details.className = "restaurant-details";
        let address = document.createElement('p');
        address.className = "restaurant-address";
        address.innerHTML = restaurant.address;
        let distance = document.createElement('p');
        distance.className = "restaurant-distance";
        distance.innerHTML = restaurant.distance;
        let style = document.createElement('p');
        style.className = "restaurant-style";
        style.innerHTML = restaurant.category;
        details.appendChild(address);
        details.appendChild(distance);
        details.appendChild(style);
        newRestaurant.appendChild(details);

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
}