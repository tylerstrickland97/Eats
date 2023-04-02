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
        console.log(obj);
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
    }).then(res => res.json()).then(data => { console.log(data) });
  },
  put: (url, data) => {
    return fetch(`${API_BASE}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json()).then(data => { console.log(data) });
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
        return HTTPClient.get('/restaurants/' + name);
    },
    getRestaurantsByCategory: (category) => {
        return HTTPClient.get('categories/' + category + '/restaurants');
    }, 
    getUserById: (id) => {
        return HTTPClient.get('users/' + id);
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
    }
  };