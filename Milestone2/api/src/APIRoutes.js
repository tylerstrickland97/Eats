const { json } = require('express');
const express = require('express');
const apiRouter = express.Router();

const cookieParser = require('cookie-parser');
apiRouter.use(cookieParser());

const RestaurantDAO = require('./RestaurantDAO');

const {TokenMiddleWare, generateToken, removeToken} = require('./TokenMiddleWare');
apiRouter.use(express.json());

//get restaurants
apiRouter.get('/restaurants', TokenMiddleWare, (req, res) => {
    RestaurantDAO.getRestaurants().then(restaurants => {
        res.json(restaurants);
    })
    .catch(err => {
        res.status(400).json({error: err});
    })
});

//get restaurant by id
apiRouter.get('/restaurants/:restaurantId', TokenMiddleWare, (req, res) => {
    const restaurantId = req.params.restaurantId;
    RestaurantDAO.getRestaurantById(restaurantId).then(restaurant => {
        if (restaurant) {
            res.json(restaurant);
        }
        else {
            res.status(404).json({error: "Restaurant does not exist in the database"});
        }
    })
    .catch(err => {
        res.json(500).json({error: err});
    })
});

//get restaurant by name
apiRouter.get('/restaurants/:restaurantName', TokenMiddleWare, (req, res) => {
    const restaurantName = req.params.restaurantName;
    RestaurantDAO.getRestaurantByName(restaurantName).then(restaurant => {
        if (restaurant) {
            res.json(restaurant);
        }
        else {
            res.status(404).json({error: "Restaurant does not exist in the database"});
        }
    })
    .catch(err => {
        res.json(500).json({error: err});
    })
});

//Add a restaurant 
apiRouter.post('/restaurants', TokenMiddleWare, (req, res) => {
    let newRestaurant = req.body;
    RestaurantDAO.createRestaurant(newRestaurant).then(restaurant => {
        res.json(restaurant);
    });
})

//get user by id
apiRouter.get('/users/:userId', TokenMiddleWare, (req, res) => {
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
apiRouter.get('/users/:userId/favorites', TokenMiddleWare, (req, res) => {
    // const userId = req.params.userId;
    // let user = users.find(user => user.id == userId);
    // if (user) {
    //     res.json(user.favorites);
    // }
    // else {
    //     res.status(404).json({error: "User not found"});
    // }
    res.status(500).json({error: "Not implemented yet"});
})
//create user
apiRouter.post('/users', TokenMiddleWare, (req, res) => {
    let newUser = req.body;
    users.push(newUser);
    res.json(newUser);
})

//login
apiRouter.post('/login', TokenMiddleWare, (req, res) => {
 // console.log("here login");
    // //get user by username
    // const username = req.params.username;
    // //find user from username
    // let user = users.find(user => user.username == username);

    // //find password from username
    // const pass = req.params.password;
    // let userPass = users.find(userPass => user.password == pass);

    // if (userPass) {
    //     //user is successfully logged in
    // }
    // else {
    //     res.status(404).json({error: "User not found"});
    // }
    //create session?
})

//logout
apiRouter.post('/logout', TokenMiddleWare, (req, res) => {
    removeToken(req, res);
    res.json({success: true});
});

//get user allergies
apiRouter.get('/users/:userId/allergies', TokenMiddleWare, (req, res) => {
    // const userId = req.params.userId;
    // let user = users.find(user => user.id == userId);
    // if (user) {
    //     res.json(user.allergies);
    // }
    // else {
    //     res.status(404).json({error: "User not found"});
    // }
    res.status(500).json({error: "Not yet implemented"});
});

//add user allergies
apiRouter.post('/users/:userId/allergies', TokenMiddleWare, (req, res) => {
    // const userId = req.params.userId;
    // let user = users.find(user => user.id == userId);
    // let newAllergy = req.body;
    // user.allergies.push(newAllergy);
    // res.json(user.allergies);
});

//delete user allergies
apiRouter.delete('/users/:userId/allergies/:name', TokenMiddleWare, (req, res) => {
    // const userId = req.params.userId;
    // let user = users.find(user => user.id == userId);
    // //probably need ids or names for the allergy

});

//Add to user favorites
apiRouter.post('/users/:userId/favorites', TokenMiddleWare, (req, res) => {
    // const userId = req.params.userId;
    // let user = users.find(user => user.id == userId);
    // let newFav = req.body;
    // user.favorites.push(newFav);
    // res.json(user.favorites);
});


//Remove from user favorites
apiRouter.delete('/users/:userId/favorites/:restaurantId', TokenMiddleWare, (req, res) => {
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
apiRouter.put('/users/:userId', TokenMiddleWare, (req, res) => {
    // const userId = req.params.userId;
    // let newUser = req.body;
    // let user = users.find(user => user.id == userId);
    // user.username = newUser.username;
    // user.password = newUser.password;
    res.status(501).json({error: 'Not implemented'});
})

module.exports = apiRouter;


