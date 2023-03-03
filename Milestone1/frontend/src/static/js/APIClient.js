const API_BASE =  '/api';

const HTTPClient = {
    get: (url) => {
      return fetch(`${API_BASE}${url}`)
      .then(res => {
          if(res.ok) {
            return res.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then(obj => {
          return obj;
        })
        .catch(err => console.log(err));
    },
    post: (url, data) => {
  
    }
  };

  export default {
    getRestaurants: () => {
        return HTTPClient.get('/restaurants');
    },
    getRestaurantById: (id) => {
        return HTTPClient.get('/restaurants/' + id);
    },
    getRestaurantByName: (name) => {
        return HTTPClient.get('restaurants/' + name);
    },
    getRestaurantsByCategory: (category) => {
        return HTTPClient.get('categories/' + category + '/restaurants');
    }, 
    getUserById: (id) => {
        return HTTPClient.get('users/' + id);
    },
    getUserFavorites: (id) => {
        return HTTPClient.get('users/' + id + '/favorites');
    },
  };