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
        loadRestaurantHTML(restaurant);
    });

    // Container Tabs
    const menuButton = document.getElementById('menu-button');
    const locationsButton = document.getElementById('locations-button');

    // Container Contents
    let menuContainer = document.getElementById('menu-container');
    let locationsContainer = document.getElementById('locations-container');

    menuButton.addEventListener("click", (e) => {
      e.preventDefault();
      menuContainer.style.display = "block";
      locationsContainer.style.display = "none";
    });

    locationsButton.addEventListener("click", (e) => {
      e.preventDefault();
      menuContainer.style.display = "none";
      locationsContainer.style.display = "block";

      let script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDy4NjpOMUHvID5kAR55dtOZANnGQItEXk&libraries=places&callback=initMap';
      script.async = true;

      window.initMap = async function() {
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
          console.log(restaurant);
          let request = {
            location: loc,
            rankBy: google.maps.places.RankBy.DISTANCE,
            type: ['restaurant'],
            name: [restaurant.name]
          };
            
          let service = new google.maps.places.PlacesService(map);
          service.nearbySearch(request, (results, status) => {
            console.log(status);
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

    // Append the 'script' element to 'head'
    document.head.appendChild(script);
    });


    function filterRestaurantName(restaurant_name) {
      let filtered_name = restaurant_name.replaceAll(/[^A-Za-z\s]/g, '');
      filtered_name = filtered_name.replaceAll(' ', '-');
      return filtered_name;
    }

    function loadRestaurantHTML(restaurant) {
        const restaurantInfo = document.querySelector('.restaurant-info-container');

        restaurantInfo.appendChild(restaurantImage(restaurant));
        restaurantInfo.appendChild(restaurantData(restaurant));

        const restaurantMenu = document.querySelector('.menu-items')
        api.getMenuById(id).then(menu => {
          menu.forEach(item => {
            restaurantMenu.appendChild(restaurantMenuGenerator(item));
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
       
       let menuItemPrice = document.createElement('div');
       menuItemPrice.className = "menu-item-price";
       //menuItemPrice.innerHTML = `\$${menu.price}`;
       menuItemBasic.appendChild(fillMenuNameHTML(menu.name));
       //menuItemBasic.appendChild(menuItemPrice);

       menuItem.appendChild(menuItemBasic);

       let menuItemInfo = document.createElement('div');
       menuItemInfo.className = "menu-item-info";

       if (menu.calories != null) {
        let menuItemCalories = document.createElement('div');
        menuItemCalories.innerHTML = `Calories: ${menu.calories}`;
        menuItemInfo.appendChild(menuItemCalories);
       }
       if (menu.fat != null) {
        let menuItemFat = document.createElement('div');
        menuItemFat.innerHTML = `Fat (g): ${menu.fat}`;
        menuItemInfo.appendChild(menuItemFat);
       }
       if (menu.carbohydrates != null) {
        let menuItemCarbohydrates = document.createElement('div');
        menuItemCarbohydrates.innerHTML = `Carbohydrates (g): ${menu.carbohydrates}`;
        menuItemInfo.appendChild(menuItemCarbohydrates);
       }
       if (menu.protein != null) {
        let menuItemProtein = document.createElement('div');
        menuItemProtein.innerHTML = `Protein (g): ${menu.protein}`;
        menuItemInfo.appendChild(menuItemProtein);
       }
       if (menu.sodium != null) {
        let menuItemSodium = document.createElement('div');
        menuItemSodium.innerHTML = `Sodium (mg): ${menu.sodium}`;
        menuItemInfo.appendChild(menuItemSodium);
       }
       if (menu.cholesterol != null) {
        let menuItemCholesterol = document.createElement('div');
        menuItemCholesterol.innerHTML = `Cholesterol (mg): ${menu.cholesterol}`;
        menuItemInfo.appendChild(menuItemCholesterol);
       }
       if (menu.fiber != null) {
        let menuItemFiber = document.createElement('div');
        menuItemFiber.innerHTML = `Fiber (g): ${menu.fiber}`;
        menuItemInfo.appendChild(menuItemFiber);
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
      else if (item.includes('coke') || item.includes('juice') || item.includes('pepsi') || item.includes('soda') || item.includes('lemonade') || item.includes('slushie') || item.includes('milk') || item.includes('freeze') || item.includes('sprite') || item.includes('coca cola') || item.includes('cheerwine') || item.includes('fanta') || item.includes('sunkist') || item.includes('tea') || item.includes('punch')) {
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

