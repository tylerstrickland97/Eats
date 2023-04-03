import api from './APIClient.js';

const query = window.location.search;
let parameters = new URLSearchParams(query);
let id = parameters.get('user');

window.onload = () => {

  let currentUserId;

  api.getCurrentUser().then(current => {
      currentUserId = current.id;
  }).catch(err => {
      console.log("We are not logged in");
      document.location = '/';
  });

    //get list of resturuant
    //does this iterate thorugh list?
    api.getUserFavorites(id).then(restaurants => {
      restaurants.forEach(restaurant => {
        //for each resturuant, get it by name and return the resuturant object
        api.getRestaurantById(restaurant).then(favorite => {
          loadFavoriteHTML(favorite);
        })
      });
    });

    function loadFavoriteHTML(restaurant) {
        const favoriteInfo = document.querySelector('.restaurant-grid'); // Was .restaurant-info-container
        fillRestaurantHTML(restaurant);

        //favoriteInfo.appendChild(restaurantImage(restaurant));
        //favoriteInfo.appendChild(favoriteData(restaurant));

        //const restaurantMenu = document.querySelector('.menu-items')
        //restaurant.menu.forEach(menu => {
        //    restaurantMenu.appendChild(restaurantMenuGenerator(menu));
        //});
    }

    /*function restaurantImage(restaurant) {
        let restaurantImageContainer = document.createElement('div');
        restaurantImageContainer.className = "restaurant-logo";
        let restaurantLogo = document.createElement('img');
        restaurantLogo.className = "restaurant-logo-img";
        restaurantLogo.src = `imgs/${restaurant.name}-logo.png`
        restaurantImageContainer.appendChild(restaurantLogo);

        return restaurantImageContainer;
    }

    function favoriteData(restaurant) {
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
    } */
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

