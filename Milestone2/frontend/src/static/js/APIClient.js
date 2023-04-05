const API_BASE =  '/api';

const handleError = (res) => {
  if(!res.ok) {
    if(res.status == 401) {
      throw new Error("Authentication error");
    }
    else {
      throw new Error("Error")
    }
  }
  return res;
};

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
    return fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(handleError).then(res => {
      return res.json();
    });
  },
  put: (url, data) => {
    return fetch(`${API_BASE}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json()).then(data => { console.log(data) });
  },
  delete: (url, data) => {
    return fetch(`${API_BASE}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(handleError).then(res => {
      return res.json();
    });
  }
};

  export default {
    getRestaurants: () => {
        return HTTPClient.get('/restaurants');
    },
    getRestaurantById: (id) => {
        return HTTPClient.get('/restaurants/' + id);
    },
    getMenuById: (id) => {
        return HTTPClient.get('/menu/' + id);
    },
    getRestaurantByName: (name) => {
        return HTTPClient.get('/restaurants/' + name);
    },
    getRestaurantsByCategory: (category) => {
        return HTTPClient.get('categories/' + category + '/restaurants');
    }, 
    getUserById: (id) => {
        return HTTPClient.get('users/' + id);
    },
    getCurrentUser: () => {
      return HTTPClient.get('/current');
    },
    getUserFavorites: (id) => {
        return HTTPClient.get('/users/' + id + '/favorites');
    },
    getAllergiesByUser: (id) => {
      return HTTPClient.get('/users/' + id + '/allergies');
    },

    signUp: (firstname, lastname, username, password, email) => {
      let data = {
        first_name: firstname,
        last_name: lastname,
        username: username,
        password: password,
        email: email
      }
      console.log(data);
      return HTTPClient.post('/users', data);
    },

    logIn: (username, password) => {
      let data = {
        username: username,
        password: password
      }
      return HTTPClient.post('/login', data);
    },
  
    logOut: () => {
      return HTTPClient.post('/logout', {});
    },

    addUserFavorite: (userId, restaurantName) => {
      let data = {
        restaurantName: restaurantName,
        userId: userId
      }
      return HTTPClient.post('/users/' + userId + '/favorites', data);
    },

    removeUserFavorite: (userId, restaurantId) => {
      let data = {
        userId: userId,
        restaurantId: restaurantId
      }
      return HTTPClient.delete('/users/' + userId + '/favorites/' + restaurantId, data);
    }
  };