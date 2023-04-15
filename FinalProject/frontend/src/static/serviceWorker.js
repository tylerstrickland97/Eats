  
  const STATIC_CACHE_NAME = 'eats-static-v0';
  
  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(STATIC_CACHE_NAME).then(cache => {
        return cache.addAll([
          '/offline',
          //CSS
          '/css/homepage.css',
          '/css/profile.css',
          '/css/style.css',
          '/css/offline.css',
          //Images
          '/imgs/restaurant-logos/Bojangles-logo.png',
          '/imgs/restaurant-logos/Burger-King-logo.png',
          '/imgs/restaurant-logos/Carls-Jr-logo.png',
          '/imgs/restaurant-logos/Chickfila-logo.png',
          '/imgs/restaurant-logos/Chilis-Bar-and-Grill-logo.png',
          '/imgs/restaurant-logos/Chipotle-logo.png',
          '/imgs/restaurant-logos/Cook-Out-logo.png',
          '/imgs/restaurant-logos/Dominos-logo.png',
          '/imgs/restaurant-logos/Five-Guys-logo.png', 
          '/imgs/restaurant-logos/Golden-Corral-logo.png',
          '/imgs/restaurant-logos/KFC-logo.png',
          '/imgs/restaurant-logos/McDonalds-logo.png',
          '/imgs/restaurant-logos/Olive-Garden-logo.png',
          '/imgs/restaurant-logos/Panera-Bread-logo.png',
          '/imgs/restaurant-logos/Pizza-Hut-logo.png',
          '/imgs/restaurant-logos/Popeyes-logo.png',
          '/imgs/restaurant-logos/Red-Lobster-logo.png',
          '/imgs/restaurant-logos/Red-Robin-logo.png',
          '/imgs/restaurant-logos/Starbucks-logo.png',
          '/imgs/restaurant-logos/Subway-logo.png',
          '/imgs/restaurant-logos/Taco-Bell-logo.png',
          '/imgs/restaurant-logos/Wendys-logo.png',
          '/imgs/bowl.png',
          '/imgs/champagne.png',
          '/imgs/cheeseburger.png',
          '/imgs/coffee-cup.png',
          '/imgs/drink.png',
          '/imgs/fork.png',
          '/imgs/home.png',
          '/imgs/lobster.png',
          '/imgs/menu.png',
          '/imgs/pasta.png',
          '/imgs/pizza.png',
          '/imgs/sandwich.png',
          '/imgs/search-icon.png',
          '/imgs/star.webp',
          '/imgs/taco.png',
          '/imgs/temp-profile-img.png',
          '/imgs/yellow_favorited_img.png',
          '/imgs/wings-modified.png',
          '/imgs/background.png',
          //Scripts
          '/js/APIClient.js',
          '/js/favorites.js',
          '/js/homepage.js',
          '/js/profile.js',
          '/js/login.js',
          '/js/common.js'
        ]);
      })
    );
  });
  
  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName.startsWith('eats-') && cacheName != STATIC_CACHE_NAME;
          }).map(cacheName => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    var requestUrl = new URL(event.request.url);
    //Treat API calls (to our API) differently
    if(requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api')) {
      //If we are here, we are intercepting a call to our API
      if(event.request.method === "GET") {
        console.log(event.request.url);
        //Only intercept (and cache) GET API requests
        event.respondWith(
          networkFirst(event.request)
        );
      }
    }
    else {
      //If we are here, this was not a call to our API
      event.respondWith(
        cacheFirst(event.request)
      );
    }
  
  });
  
  function cacheFirst(request) {
    return caches.match(request)
    .then(response => {
      //Return a response if we have one cached. Otherwise, get from the network
      return response || fetchAndCache(request);
    })
    .catch(error => {
      return caches.match('/offline');
    })
  }
  
  function networkFirst(request) {
    return caches.match(request)
    .then(response => {
      //Return a response if we have one cached. Otherwise, get from the network
      return fetchAndCache(request) || response;
    })
    .catch(error => {
      return caches.match('/offline');
    })
  }
  
  
  
  function fetchAndCache(request) {
    return fetch(request).then(response => {
      var requestUrl = new URL(request.url);
      //Cache everything except login
      if(response.ok && !requestUrl.pathname.startsWith('/login')) {
        caches.open(STATIC_CACHE_NAME).then((cache) => {
          cache.put(request, response);
        });
      }
      return response.clone();
    });
  }
  
  
  
  self.addEventListener('message', event => {
    if(event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });
  