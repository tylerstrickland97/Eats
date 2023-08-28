import api from './APIClient.js';

const query = window.location.search;
let parameters = new URLSearchParams(query);
let id = parameters.get('id');

window.onload = () => {
  let currentUserId;

  api.getCurrentUser().then(current => {
    currentUserId = current.id;
  }).catch(err => {
    console.log("We are not logged in");
    document.location = '/';
  });

  api.getRestaurantById(id).then(restaurant => {
    api.getAllergiesByUser(currentUserId).then(allergies => {
      api.getUserFavorites(currentUserId).then(favorites => {
        loadRestaurantHTML(restaurant, allergies, favorites);
      });
    });
  });

  // Container Tabs
  const menuButton = document.getElementById('menu-button');
  const locationsButton = document.getElementById('locations-button');

  // Container Contents
  let menuContainer = document.getElementById('menu-container');
  let locationsContainer = document.getElementById('locations-container');

  menuButton.addEventListener("click", (e) => {
    e.preventDefault();
    menuContainer.style.display = "grid";
    locationsContainer.style.display = "none";
  });

  locationsButton.addEventListener("click", (e) => {
    e.preventDefault();
    menuContainer.style.display = "none";
    locationsContainer.style.display = "block";

    if (document.getElementById('locations-script')) {
      initMap();
    }
    else {
      let script = document.createElement('script');
      script.id = 'locations-script';
      // Append the 'script' element to 'head'
      document.head.appendChild(script);
      api.getKey().then(res => {
        let key = res;
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + key + '&libraries=places&callback=initMap';
        script.async = true;
      })
    }

    window.initMap = function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      }
    }

    async function showPosition(position) {
      let lat = position.coords.latitude;
      let lgt = position.coords.longitude;
      const { Map } = await google.maps.importLibrary("maps");
      let map = new Map(document.getElementById("map"), {
        center: { lat: position.coords.latitude, lng: position.coords.longitude },
        zoom: 12,
      });
      let infowindow = new google.maps.InfoWindow();
      let loc = new google.maps.LatLng(lat, lgt);

      let restaurantName;
      api.getRestaurantById(id).then(restaurant => {
        let request = {
          location: loc,
          rankBy: google.maps.places.RankBy.DISTANCE,
          type: ['restaurant'],
          name: [restaurant.name]
        };

        let service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < results.length; i++) {
              createMarker(map, results[i], infowindow);
              getLocationDetails(results[i], service);
            }

            //map.setCenter(results[0].geometry.location);
          }
        });
      });
    }

    function fillLocationHTML(location) {
      let locationDiv = document.createElement('div');
      locationDiv.classList.add("location");

      let locationHeader = document.createElement('div');
      locationHeader.classList.add("location-header");
      locationHeader.innerHTML = location.formatted_address;
      locationDiv.appendChild(locationHeader);

      let locationInformation = document.createElement('div');
      locationInformation.classList.add("location-information");
      let ratingDiv = document.createElement('div');
      ratingDiv.innerHTML = `Rating: ${location.rating}`;
      locationInformation.appendChild(ratingDiv);
      let phoneDiv = document.createElement('div');
      phoneDiv.innerHTML = `Phone: ${location.formatted_phone_number}`;
      locationInformation.appendChild(phoneDiv);
      let locationHoursDiv = document.createElement('div');
      locationHoursDiv.innerHTML = `Location Hours:`;
      locationInformation.appendChild(locationHoursDiv);

      let openContainer = document.createElement('div');
      openContainer.classList.add('open-container');

      let emptySpace = document.createElement('div');
      emptySpace.classList.add('empty-space');
      openContainer.appendChild(emptySpace);
      let genericDiv = document.createElement('div');
      for (let i = 0; i < location.opening_hours.weekday_text.length; i++) {
        let workday = document.createElement('div');
        workday.innerHTML = location.opening_hours.weekday_text[i];
        genericDiv.appendChild(workday);
      }
      openContainer.appendChild(genericDiv);
      locationInformation.appendChild(openContainer);
      locationDiv.appendChild(locationInformation);
      let locationsList = document.getElementById('locations-list');
      locationsList.appendChild(locationDiv);
    }

    function getLocationDetails(result, service) {
      let placeId = result.place_id;

      let request = {
        placeId: placeId,
        fields: ['formatted_address', 'rating', 'formatted_phone_number', 'geometry', 'opening_hours', 'price_level']
      };
      service.getDetails(request, (results, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          fillLocationHTML(results);
        }
      });
    }

    function createMarker(map, place, infowindow) {
      if (!place.geometry || !place.geometry.location) return;

      const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
      });

      google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.vicinity || "");
        infowindow.open(map, marker);
      });
    }

  });


  function filterRestaurantName(restaurant_name) {
    let filtered_name = restaurant_name.replaceAll(/[^A-Za-z\s]/g, '');
    filtered_name = filtered_name.replaceAll(' ', '-');
    return filtered_name;
  }

  function getFavorites(restaurant, favorites) {
    // let top = document.getElementById('top');
    let favoriteButton = document.getElementById('favorite-button');
    // let favoriteButton = document.createElement('button');
    // favoriteButton.className = "favorite-button";


    //text
    let buttonText = document.createElement('span');
    // buttonText.innerText = "Add to Favorites";
    buttonText.className = "favorite-label";

    //icon
    let icon = document.createElement('i');
    // icon.className = "fa-regular fa-star";
    icon.id="icon"

    favoriteButton.appendChild(buttonText);
    favoriteButton.appendChild(icon);

    api.getUserFavorites(currentUserId).then(favorites => { 
      let isFavorite;
      if (favorites.find(f => f.restaurant_id == restaurant.id)) {
          isFavorite = true;
          icon.className = "fa-solid fa-star";
          buttonText.innerHTML = "Remove Favorite";
          // buttonImg.src = "imgs/yellow_favorited_img.png";
      } else {
          isFavorite = false;
          icon.className = "fa-regular fa-star";
          buttonText.innerHTML = "Add to Favorites";
          // buttonImg.src = "imgs/star.webp";
      }

      favoriteButton.addEventListener('click', function() {
          if (isFavorite) {
              api.removeUserFavorite(currentUserId, restaurant.id).then(result => {
                  console.log('successfully removed favorite');
                  // buttonImg.src = 'imgs/star.webp';
                  icon.className = "fa-regular fa-star";
                  buttonText.innerHTML = "Add to Favorites";
                  // icon.style.color = 'black';
                  isFavorite = !isFavorite;
              }).catch(err => {
                  console.log('error removing favorite');
              })
          } else {
              api.addUserFavorite(currentUserId, restaurant.name).then(result => {
                  console.log('successfully added favorite');
                  // buttonImg.src = 'imgs/yellow_favorited_img.png';
                  icon.className = "fa-solid fa-star";
                  buttonText.innerHTML = "Remove Favorite";
                  // icon.style.color = 'yellow';
                  isFavorite = !isFavorite;  
              }).catch(err => {
                  console.log('error adding favorite');
              })
          }
      })
    });

  }

  function loadRestaurantHTML(restaurant, allergies, favorites) {
    getFavorites(restaurant, favorites);

    const restaurantInfo = document.querySelector('.restaurant-info-container');
    restaurantInfo.appendChild(restaurantBackground(restaurant));
    // let restaurantBackgroundImg = `imgs/restaurant-backgrounds/${filterRestaurantName(restaurant.name)}-background.png`;
    // let imgUrl = "url('imgs/restaurant-backgrounds/McDonalds-background.png')";
    // restaurantInfo.style.backgroundImage = imgUrl;
    const rest = document.createElement('div');
    rest.className = "rest";

    rest.appendChild(restaurantData(restaurant));
    rest.appendChild(restaurantImage(restaurant));

    restaurantInfo.appendChild(rest);
    // restaurantInfo.appendChild(restaurantImage(restaurant));
    // restaurantInfo.appendChild(restaurantData(restaurant));

    const restaurantMenu = document.querySelector('.menu-items')
    api.getMenuById(id).then(menu => {
      menu.forEach(item => {
        restaurantMenu.appendChild(restaurantMenuGenerator(item, allergies));
      })
    });
    // restaurant.menu.forEach(menu => {
    //     restaurantMenu.appendChild(restaurantMenuGenerator(menu));
    // });
  }

  function restaurantImage(restaurant) {
    let restaurantImageContainer = document.createElement('div');
    restaurantImageContainer.className = "restaurant-logo";
    let helperSpan = document.createElement('span');
    helperSpan.classList.add('helper-span');
    let restaurantLogo = document.createElement('img');
    restaurantLogo.className = "restaurant-logo-img";
    restaurantLogo.src = `imgs/restaurant-logos/${filterRestaurantName(restaurant.name)}-logo.png`
    restaurantImageContainer.appendChild(helperSpan);
    restaurantImageContainer.appendChild(restaurantLogo);

    return restaurantImageContainer;
  }

  function restaurantBackground(restaurant) {
    let restaurantBackgroundContainer = document.createElement('div');
    restaurantBackgroundContainer.className = "restaurant-background";
    let helperSpan = document.createElement('span');
    helperSpan.classList.add('helper-span');
    let restaurantBackground = document.createElement('img');
    restaurantBackground.className = "restaurant-background-img";
    restaurantBackground.src = `imgs/restaurant-backgrounds/${filterRestaurantName(restaurant.name)}-background.png`
    restaurantBackgroundContainer.appendChild(helperSpan);
    restaurantBackgroundContainer.appendChild(restaurantBackground);

    return restaurantBackgroundContainer;

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

    // let restaurantInfoGrid = document.createElement('div');
    // restaurantInfoGrid.className = "restaurant-info-items";
    // let restaurantDistance = document.createElement('div');
    // restaurantDistance.className = "restaurant-info-item";
    // restaurantDistance.innerHTML = `Distance ${restaurant.distance}`;
    // let restaurantFavorites = document.createElement('div');
    // restaurantFavorites.className = "restaurant-info-item";
    // restaurantFavorites.innerHTML = `Favorites: ${restaurant['num-favorites']}`;
    // let restaurantRatings = document.createElement('div');
    // restaurantRatings.className = "restaurant-info-item";
    // restaurantRatings.innerHTML = `Rating: ${restaurant.rating}/5`;
    // let restaurantAddress = document.createElement('div');
    // restaurantAddress.className = "restaurant-info-item";
    // restaurantAddress.innerHTML = `Address: ${restaurant.address}`;
    // restaurantInfoGrid.appendChild(restaurantDistance);
    // restaurantInfoGrid.appendChild(restaurantFavorites);
    // restaurantInfoGrid.appendChild(restaurantRatings);
    // restaurantInfoGrid.appendChild(restaurantAddress);
    // restaurantInfo.appendChild(restaurantInfoGrid);

    return restaurantInfo;
  }


  function fillAllergyHTML(allergy, allergies, menuItemInfo) {
    if (allergies.includes(allergy)) {
      let allergyDiv = document.createElement('div');
      allergyDiv.classList.add('allergy-container');
      let allergyImage = document.createElement('img');
      allergyImage.src = '/imgs/allergywarning.png';
      allergyDiv.appendChild(allergyImage);
      let allergyMessage = document.createElement('p');
      allergyMessage.innerHTML = 'You might be allergic to this item';
      allergyDiv.appendChild(allergyMessage);
      menuItemInfo.appendChild(allergyDiv);
    }

  }

  function restaurantMenuGenerator(menu, allergies) {
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

    let menuItemPrice = document.createElement('div');
    menuItemPrice.className = "menu-item-price";
    //menuItemPrice.innerHTML = `\$${menu.price}`;
    menuItemBasic.appendChild(fillMenuNameHTML(menu.name));
    //menuItemBasic.appendChild(menuItemPrice);

    menuItem.appendChild(menuItemBasic);

    let itemAllergies = possibleAllergies(menu.name.toLowerCase());

    let menuItemInfo = document.createElement('div');
    menuItemInfo.className = "menu-item-info";

    for (let i = 0; i < allergies.length; i++) {
      api.getAllergyById(allergies[i].allergy_id).then(a => {
        fillAllergyHTML(a.type, itemAllergies, menuItemInfo);
      })
    }

    let noNutritionInfo = true;
    if (menu.calories != null) {
      let menuItemCalories = document.createElement('div');
      menuItemCalories.innerHTML = `Calories: ${menu.calories}`;
      menuItemInfo.appendChild(menuItemCalories);
      noNutritionInfo = false;
    }
    if (menu.fat != null) {
      let menuItemFat = document.createElement('div');
      menuItemFat.innerHTML = `Fat (g): ${menu.fat}`;
      menuItemInfo.appendChild(menuItemFat);
      noNutritionInfo = false;
    }
    if (menu.carbohydrates != null) {
      let menuItemCarbohydrates = document.createElement('div');
      menuItemCarbohydrates.innerHTML = `Carbohydrates (g): ${menu.carbohydrates}`;
      menuItemInfo.appendChild(menuItemCarbohydrates);
      noNutritionInfo = false;
    }
    if (menu.protein != null) {
      let menuItemProtein = document.createElement('div');
      menuItemProtein.innerHTML = `Protein (g): ${menu.protein}`;
      menuItemInfo.appendChild(menuItemProtein);
      noNutritionInfo = false;
    }
    if (menu.sodium != null) {
      let menuItemSodium = document.createElement('div');
      menuItemSodium.innerHTML = `Sodium (mg): ${menu.sodium}`;
      menuItemInfo.appendChild(menuItemSodium);
      noNutritionInfo = false;
    }
    if (menu.cholesterol != null) {
      let menuItemCholesterol = document.createElement('div');
      menuItemCholesterol.innerHTML = `Cholesterol (mg): ${menu.cholesterol}`;
      menuItemInfo.appendChild(menuItemCholesterol);
      noNutritionInfo = false;
    }
    if (menu.fiber != null) {
      let menuItemFiber = document.createElement('div');
      menuItemFiber.innerHTML = `Fiber (g): ${menu.fiber}`;
      menuItemInfo.appendChild(menuItemFiber);
      noNutritionInfo = false;
    }

    //If there is no nutrition information present, fill in the blank space and add a message to inform the user that there is no information to give
    if (noNutritionInfo) {
      let fillerDiv1 = document.createElement('div');
      menuItemInfo.appendChild(fillerDiv1);
      let fillerDiv2 = document.createElement('div');
      menuItemInfo.appendChild(fillerDiv2);
      let fillerDiv3 = document.createElement('div');
      menuItemInfo.appendChild(fillerDiv3);
      let fillerDiv4 = document.createElement('div');
      fillerDiv4.innerHTML = 'There is no nutrition information for this item';
      menuItemInfo.appendChild(fillerDiv4);
      let fillerDiv5 = document.createElement('div');
      menuItemInfo.appendChild(fillerDiv5);
      let fillerDiv6 = document.createElement('div');
      menuItemInfo.appendChild(fillerDiv6);
      let fillerDiv7 = document.createElement('div');
      menuItemInfo.appendChild(fillerDiv7);
    }

    //let menuItemAllergies = document.createElement('div');
    //if (menu.Allergies.length == 0) {
    // menuItemAllergies.innerHTML = `Allergies: None`;
    //}
    //else {
    // menuItemAllergies.innerHTML = `Allergies: ${menu.Allergies.join(', ')}`;
    //}
    //menuItemInfo.appendChild(menuItemAllergies);
    menuItem.appendChild(menuItemInfo);

    return menuItem;
  }


  function possibleAllergies(name) {
    let itemAllergies = [];
    if (name.includes('milk') || name.includes('cream') || name.includes('cheese') || name.includes('butter') || name.includes('ice cream') || name.includes('yogurt')) {
      itemAllergies.push('Dairy');
    }
    if (name.includes('egg') || name.includes('cookie') || name.includes('milkshake') || name.includes('pancake') || name.includes('waffle') || name.includes('cake') || name.includes('fritter') || name.includes('croissant') || 
    name.includes('donut') || name.includes('muffin')) {
      itemAllergies.push('Egg');
    }
    if (name.includes('soy') || name.includes('edamame') || name.includes('tofu') || name.includes('miso') || name.includes('bread') || name.includes('bun') || name.includes('cookie') || name.includes('cracker')) {
      itemAllergies.push('Soy')
    }
    if (name.includes('peanut')) {
      itemAllergies.push('Peanut');
    }
    if (name.includes('shrimp') || name.includes('lobster') || name.includes('crab') || name.includes('crawfish') || name.includes('sushi')) {
      itemAllergies.push('Shellfish');
    }
    if (name.includes('salmon') || name.includes('trout') || name.includes('flounder') || name.includes('fish') || name.includes('sushi') || name.includes('anchovies') || name.includes('cod') || name.includes('tuna') || name.includes('tilapia') || name.includes('bass')) {
      itemAllergies.push('Fish');
    }
    if (name.includes('bread') || name.includes('wheat') || name.includes('oat') || name.includes('rye') || name.includes('barley') || name.includes('flour') || name.includes('cake') || 
    name.includes('pie') || name.includes('fries') || name.includes('candy') || name.includes('sauce') || name.includes('dressing')) {
      itemAllergies.push('Gluten');
    }
    if (name.includes('almond') || name.includes('walnut') || name.includes('cashew') || name.includes('hazelnut') || name.includes('chestnut') || name.includes('pecan') || name.includes('pistachio') || name.includes('coconut')) {
      itemAllergies.push("Treenut");
    }
    if (name.includes('chick')) {
      itemAllergies.push("Chicken");
    }
    if (name.includes('beef') || name.includes('burger') || name.includes('steak')) {
      itemAllergies.push('Beef');
    }

    return itemAllergies;
    
  }

  function fillMenuNameHTML(name) {
    let menuItemName = document.createElement('div');
    menuItemName.className = "menu-item-name";
    menuItemName.innerHTML = name;

    let itemImgFileName = getMenuImg(name.toLowerCase());
    let menuItemImg = document.createElement('img');
    menuItemImg.src = '/imgs/' + itemImgFileName + '.png';
    menuItemName.appendChild(menuItemImg);
    return menuItemName;

    


  }

  function getMenuImg(item) {
    if (item.includes('burger')) {
      return 'cheeseburger'
    }
    else if (item.includes('pizza')) {
      return 'pizza'
    }
    else if (item.includes('sandwich') || item.includes('blt') || item.includes('club') || item.includes('sub')) {
      return 'sandwich';
    }
    else if (item.includes('coffee') || item.includes('caffe') || item.includes('latte') || item.includes('cappucino') || item.includes('americano') || item.includes('frappe') || item.includes('mocha')) {
      return 'coffee-cup'
    }
    else if (item.includes('coke') || item.includes('juice') || item.includes('pepsi') || item.includes('soda') || item.includes('lemonade') || item.includes('slushie') || item.includes('milk') || item.includes('freeze') || item.includes('sprite') || item.includes('coca cola') || item.includes('cheerwine') || item.includes('fanta') || item.includes('sunkist') || item.includes(' tea ') || item.includes('punch')) {
      return 'drink';
    }
    else if (item.includes('taco')) {
      return 'taco';
    }
    else if (item.includes('beer') || item.includes('cerveza') || item.includes('margarita') || item.includes('wine')) {
      return 'champagne';
    }
    else if (item.includes('soup') || item.includes('oatmeal') || item.includes('cereal') || item.includes('chowder')) {
      return 'bowl';
    }
    else if (item.includes('pasta') || item.includes('spaghetti') || item.includes('noodle') || item.includes('alfredo') || item.includes('marsala') || item.includes('penne') || item.includes('fettuccine') || item.includes('rigatoni') || item.includes('ravioli') || item.includes('lasagna') || item.includes('ziti')) {
      return 'pasta';
    }
    else if (item.includes('seafood') || item.includes('calamari') || item.includes('fish') || item.includes('salmon') || item.includes('lobster') || item.includes('shrimp') || item.includes('crab') || item.includes('flounder') || item.includes('shellfish')) {
      return 'lobster';
    }
    else {
      return 'fork';
    }
  }
}

//is there a way to get each menu item by it's image?

