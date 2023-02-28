const express = require('express');
const apiRouter = express.Router();

let restaurants = require('./data/restaurants.json');
let users = require('./data/users.json');

apiRouter.use(express.json());

//get restaurants
apiRouter.get('/restaurants', (req, res) => {
    res.json(restaurants);
});

//get restaurant by id
apiRouter.get('/restaurants/:restaurantId', (req, res) => {
    const restaurantId = req.params.restaurantId;
    let restaurant = restaurants.find(restaurant => restaurant.id == restaurantId);
    if (restaurant) {
        res.json(restaurant);
    }
    else {
        res.status(404).json({error: "Restaurant not found"});
    }
});

//get restaurant by name
apiRouter.get('/restaurants/:restaurantName', (req, res) => {
    const restaurantId = req.params.restaurantName;
    let restaurant = restaurants.find(restaurant => restaurant.name == restaurantName);
    if (restaurant) {
        res.json(restaurant);
    }
    else {
        res.status(404).json({error: "Restaurant not found"});
    }
});

//get all restaurants in specific category
apiRouter.get('categories/:category/restaurants', (req, res) => {
    const category = req.params.category;
    let results = restaurants.filter(restaurant => restaurant.category == category);
    res.json(results);
});

//get user by id
apiRouter.get('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    let user = users.find(user => user.id == userId);
    if (user) {
        res.json(user);
    }
    else {
        res.status(404).json({error: "User not found"});
    }
});

//get user favorites
apiRouter.get('/users/:userId/favorites', (req, res) => {
    const userId = req.params.userId;
    let user = users.find(user => user.id == userId);
    if (user) {
        res.json(user.favorites);
    }
    else {
        res.status(404).json({error: "User not found"});
    }
})
//create user
apiRouter.post('/users', (req, res) => {
    let newUser = req.body;
    users.push(newUser);
    res.json(newUser);
})

//login
apiRouter.post('/login', (req, res) => {
    res.status(501).json({error: "Not implemented"});
})

//logout
apiRouter.post('/logout', (req, res) => {
    res.status(501).json({error: "Not implemented"});
})

//Add to user favorites
apiRouter.post('/users/:userId/favorites', (req, res) => {
    const userId = req.params.userId;
    let user = users.find(user => user.id == userId);
    let newFav = req.body;
    user.favorites.push(newFav);
    res.json(user.favorites);
})

//Remove from user favorites
apiRouter.delete('/users/:userId/favorites/:restaurantId', (req, res) => {
    // const userId = req.params.userId;
    // const favId = req.params.restaurantId;
    // let user = users.find(user => user.id == userId);
    // if (!user) {
    //     res.status(400).json({error: "The user does not exist"});
    // }
    // let favorite = user.favorites.find(fav => fav.id == favId);
    // if (!favorite) {
    //     res.status(400).json({error: "This restaurant is not in the user favorites"});
    // }
    // let idx = user.favorites.indexOf(favorite);
    // user.favorites.splice(idx, 1);
    // res.json(user.favorites);
    res.status(501).json({error: 'Not implemented'});
});

//edit account information
apiRouter.put('/users/:userId', (req, res) => {
    // const userId = req.params.userId;
    // let newUser = req.body;
    // let user = users.find(user => user.id == userId);
    // user.username = newUser.username;
    // user.password = newUser.password;
    res.status(501).json({error: 'Not implemented'});
})

module.exports = apiRouter;


