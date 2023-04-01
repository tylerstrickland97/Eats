import api from './APIClient.js';

const query = window.location.search;
let parameters = new URLSearchParams(query);
let id = parameters.get('id');

window.onload = () => {
    api.getRestaurantById(id).then(restaurant => {
        loadRestaurantHTML(restaurant);
    });

    function loadRestaurantHTML(restaurant) {
        const restaurantInfo = document.querySelector('.restaurant-info-container');

        restaurantInfo.appendChild(restaurantImage(restaurant));
        restaurantInfo.appendChild(restaurantData(restaurant));

        const restaurantMenu = document.querySelector('.menu-items')
        restaurant.menu.forEach(menu => {
            restaurantMenu.appendChild(restaurantMenuGenerator(menu));
        });
    }

    function restaurantImage(restaurant) {
        let restaurantImageContainer = document.createElement('div');
        restaurantImageContainer.className = "restaurant-logo";
        let restaurantLogo = document.createElement('img');
        restaurantLogo.className = "restaurant-logo-img";
        restaurantLogo.src = `imgs/${restaurant.name}-logo.png`
        restaurantImageContainer.appendChild(restaurantLogo);

        return restaurantImageContainer;
    }

    function restaurantData(restaurant) {
        /*
        <div class="restaurant-info">
          <div class="restaurant-name">Restaurant Name</div>
          <div class="restaurant-info-grid">
            <div class="restaurant-info-grid-item">Distance</div>
            <div class="restaurant-info-grid-item">Num Favorites</div>
            <div class="restaurant-info-grid-item">Ratings</div>
            <div class="restaurant-info-grid-item">Address</div>
          </div>
        </div>
        */
        let restaurantInfo = document.createElement('div');
        restaurantInfo.className = "restaurant-info";

        let restaurantName = document.createElement('div');
        restaurantName.className = "restaurant-name";
        restaurantName.innerHTML = restaurant.name;
        restaurantInfo.appendChild(restaurantName);

        let restaurantInfoGrid = document.createElement('div');
        restaurantInfoGrid.className = "restaurant-info-grid";
        let restaurantDistance = document.createElement('div');
        restaurantDistance.className = "restaurant-info-grid-item";
        restaurantDistance.innerHTML = `Distance ${restaurant.distance}`;
        let restaurantFavorites = document.createElement('div');
        restaurantFavorites.className = "restaurant-info-grid-item";
        restaurantFavorites.innerHTML = `Favorites: ${restaurant['num-favorites']}`;
        let restaurantRatings = document.createElement('div');
        restaurantRatings.className = "restaurant-info-grid-item";
        restaurantRatings.innerHTML = `Rating: ${restaurant.rating}/5`;
        let restaurantAddress = document.createElement('div');
        restaurantAddress.className = "restaurant-info-grid-item";
        restaurantAddress.innerHTML = `Address: ${restaurant.address}`;
        restaurantInfoGrid.appendChild(restaurantDistance);
        restaurantInfoGrid.appendChild(restaurantFavorites);
        restaurantInfoGrid.appendChild(restaurantRatings);
        restaurantInfoGrid.appendChild(restaurantAddress);
        restaurantInfo.appendChild(restaurantInfoGrid);

        return restaurantInfo;
    }

    function restaurantMenuGenerator(menu) {
        /*
        <div class="menu-item">
          <div class="menu-item-basic">
            <div class="menu-item-name">Item Name</div>
            <div>Calories: XXX</div>
            <div class="menu-item-price">$XX.XX</div>
          </div>
          <div class="menu-item-info">
            <div>Allergies: XX, XX, XX</div>
          </div>
        </div>
        */
       let menuItem = document.createElement('div');
       menuItem.className = "menu-item";

       let menuItemBasic = document.createElement('div');
       menuItemBasic.className = "menu-item-basic";

       let menuItemName = document.createElement('div');
       menuItemName.className = "menu-item-name";
       menuItemName.innerHTML = menu.name;
       let menuItemCalories = document.createElement('div');
       menuItemCalories.innerHTML = `Calories: ${menu.calories}`;
       let menuItemPrice = document.createElement('div');
       menuItemPrice.className = "menu-item-price";
       menuItemPrice.innerHTML = `\$${menu.price}`;
       menuItemBasic.appendChild(menuItemName);
       menuItemBasic.appendChild(menuItemCalories);
       menuItemBasic.appendChild(menuItemPrice);

       menuItem.appendChild(menuItemBasic);

       let menuItemInfo = document.createElement('div');
       menuItemInfo.className = "menu-item-info";

       let menuItemAllergies = document.createElement('div');
       if (menu.Allergies.length == 0) {
        menuItemAllergies.innerHTML = `Allergies: None`;
       }
       else {
        menuItemAllergies.innerHTML = `Allergies: ${menu.Allergies.join(', ')}`;
       }
       menuItemInfo.appendChild(menuItemAllergies);
       menuItem.appendChild(menuItemInfo);

       return menuItem;
    }
}

