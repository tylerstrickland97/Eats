const query = window.location.search;
let parameters = new URLSearchParams(query);
const id = parameters.get('id');

import api from './APIClient.js';
window.onload = () => {

    let currentUserId;
    api.getCurrentUser().then(current => {
        currentUserId = current.id;
    }).catch(err => {
        console.log(err);
        console.log("We are not logged in");
        document.location = '/';
    });

    let script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDy4NjpOMUHvID5kAR55dtOZANnGQItEXk&libraries=places&callback=initMap';
    script.async = true;

    // Attach your callback function to the `window` object
    window.initMap = async function() {
        // JS API is loaded and available
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    };

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
        })


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

    function fillLocationHTML(location) {
        let locationsContainer = document.querySelector('.locations');

        let locationDiv = document.createElement('div');
        locationDiv.classList.add('location');

        let basicInfo = document.createElement('div');
        basicInfo.classList.add('location-basic');

        let locationAddress = document.createElement('div');
        locationAddress.classList.add('location-address');
        locationAddress.innerHTML = location.formatted_address;

        let locationPhoneNumber = document.createElement('div');
        locationPhoneNumber.innerHTML = 'Phone: ' + location.formatted_phone_number;

        basicInfo.appendChild(locationAddress);
        basicInfo.appendChild(locationPhoneNumber);

        let rating = document.createElement('div');
        rating.innerHTML = 'Rating: ' + location.rating;
        let openStatus = document.createElement('div');
        if (location.opening_hours.isOpen()) {
            openStatus.innerHTML = "Currently Open";
        }
        else {
            openStatus.innerHTML = "Currently Closed";
        }
        let locationHours = document.createElement('div');

        let hours = document.createElement('ul');
        hours.classList.add('work-hours');
        for (let i = 0; i < location.opening_hours.weekday_text.length; i++) {
            let workday = document.createElement('li');
            workday.innerHTML = location.opening_hours.weekday_text[i];
            hours.appendChild(workday);
        }
        locationHours.innerHTML = 'Location Hours: ';
        locationHours.appendChild(hours);
        locationDiv.appendChild(basicInfo);
        locationDiv.appendChild(rating);
        locationDiv.appendChild(openStatus);
        locationDiv.appendChild(locationHours);
        locationsContainer.appendChild(locationDiv);
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
}