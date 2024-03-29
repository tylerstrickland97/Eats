const { json } = require('express');
const express = require('express');
const apiRouter = express.Router();
const crypto = require('crypto');

const cookieParser = require('cookie-parser');
apiRouter.use(cookieParser());

const RestaurantDAO = require('./RestaurantDAO');
const UserDAO = require('./UserDAO');
const MenuDAO = require('./MenuDAO');
const AllergiesDAO = require('./AllergiesDAO');

const {TokenMiddleWare, generateToken, removeToken} = require('./TokenMiddleWare');
apiRouter.use(express.json());

//get google key 
apiRouter.get('/key', TokenMiddleWare, (req, res) => {
    if (process.env.GOOGLE_API_KEY) {
        res.json(process.env.GOOGLE_API_KEY);
    }
})

//get restaurants

apiRouter.get('/restaurants', TokenMiddleWare, (req, res) => {
    RestaurantDAO.getRestaurants().then(restaurants => {
        res.json(restaurants);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({error: err});
    })
});

//get restaurant by id
apiRouter.get('/restaurants/:restaurantId', TokenMiddleWare, (req, res) => {
    const restaurantId = req.params.restaurantId;
    console.log(restaurantId);
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

//get menu by restaurant id
apiRouter.get('/menu/:restaurantId', TokenMiddleWare, (req, res) => {
    const restaurantId = req.params.restaurantId;
    console.log(restaurantId);
    MenuDAO.getMenuById(restaurantId).then(menu => {
        if (menu) {
            res.json(menu);
        }
        else {
            res.status(404).json({error: "Menu does not exist in the database"});
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
apiRouter.post('/restaurants', (req, res) => {
    let newRestaurant = req.body;
    RestaurantDAO.createRestaurant(newRestaurant).then(restaurant => {
        res.json(restaurant);
    });
})

//get user by id
apiRouter.get('/users/:userId', TokenMiddleWare, (req, res) => {
    let userId = req.params.userId;
    UserDAO.getUserById(userId).then(user => {
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({error: "User does not exist in the database"});
        }
    }).catch(err => {
        res.json(500).json({error: err});
    })
});

//get user by username
apiRouter.get('/username/:userUsername', (req, res) => {
    let userUsername = req.params.userUsername;
    UserDAO.getUserByUsername(userUsername).then(user => {
        if (user) {
            res.json({status: "FOUND"});
        }
        else {
            res.json({status: "NOT FOUND"});
        }
    }).catch(err => {
        res.json(500).json({error: err});
    })
});

apiRouter.get('/current', TokenMiddleWare, (req, res) => {
    res.json(req.user);
});

//get user favorites
apiRouter.get('/users/:userId/favorites', TokenMiddleWare, (req, res) => {
    let userId = req.params.userId;
    UserDAO.getUserFavorites(userId).then(results => {
        if (results) {
            res.json(results);
        }
        else {
            res.status(400).json({error: "No favorites found for this user"});
        }
    }).catch(err => {
        res.status(400).json({error: err});
    })
})
//create user
apiRouter.post('/users', (req, res) => {
    let salt = crypto.randomBytes(16).toString('hex');
    let password = req.body.password;

    crypto.pbkdf2(password, salt , 100000, 64, 'sha512',function(err, derivedKey) {
        if (err) {
            res.status(401).json({error: "Login Failed"});
        }
        const digest = derivedKey.toString('hex');

        user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            email: req.body.email,
            salt: salt,
            password_hash: digest
        }

        newUser = UserDAO.createUser(user).then(usr => {
            res.json(usr);
        });
    });
})

//login
apiRouter.post('/login', (req, res) => {
    if(req.body.username  && req.body.password) {
        UserDAO.getUserByCredentials(req.body.username, req.body.password).then(user => {
          let result = {
            user: user
          }
          generateToken(req, res, user);
    
          res.status(200).json(result);
        }).catch(err => {
            console.log(err);
          res.status(400).json({error: err});
        });
      }
      else {
        res.status(401).json({error: 'Not authenticated'});
      }
})

//logout
apiRouter.post('/logout', TokenMiddleWare, (req, res) => {
    removeToken(req, res);
    res.json({success: true});
});

apiRouter.get('/allergies', TokenMiddleWare, (req, res) => {
    AllergiesDAO.getAllergies().then(allergies => {
        if (allergies) {
            res.json(allergies);
        }
        else {
            res.status(500).json({error: "Internal error"});
        }
    }).catch(err => {
        res.status(400).json({error: err});
    })
})

//get user allergies
apiRouter.get('/users/:userId/allergies', TokenMiddleWare, (req, res) => {
    const userId = req.params.userId;
    AllergiesDAO.getUserAllergies(userId).then(results => {
        if (results) {
            res.json(results);
        }
        else {
            res.status(500).json({error: "Internal error"})
        }
    }).catch(err => {
        res.status(400).json({error: err});
    });
});

//get allergy by id
apiRouter.get('/allergies/:id', TokenMiddleWare, (req, res) => {
    const id  = req.params.id;
    AllergiesDAO.getAllergyById(id).then(result => {
        if (result) {
            res.json(result);
        }
        else {
            res.status(500).json(({error: "Internal error"}));
        }
    }).catch(err => {
        res.status(400).json({error: err});
    })
})

//add user allergies
apiRouter.post('/users/:userId/allergies', TokenMiddleWare, (req, res) => {
    const allergyId = req.body.allergyId;
    const userId = req.params.userId;
    AllergiesDAO.addUserAllergy(userId, allergyId).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(400).json({error: err});
    })
});

//delete user allergies
apiRouter.delete('/users/:userId/allergies/:name', TokenMiddleWare, (req, res) => {
    const userId = req.params.userId;
    const type = req.params.name;
    AllergiesDAO.getAllergyByType(type).then(allergy => {
        AllergiesDAO.deleteUserAllergy(userId, allergy.id).then(results => {
            res.json({success: "Successfully removed from allergens"});
        }).catch(err => {
            res.status(400).json({error: err});
        })
    }).catch(err => {
        res.status(500).json({error: err});
    })

});

//Add to user favorites
apiRouter.post('/users/:userId/favorites', TokenMiddleWare, (req, res) => {
    //Get the restaurant name in the parameters
    let restaurantName = req.body.restaurantName;
    let userId = req.body.userId;
    RestaurantDAO.getRestaurantByName(restaurantName).then(restaurant => {
        if (restaurant) {
            let restaurantId = restaurant.id;
            UserDAO.addToUserFavorites(userId, restaurantId).then(result => {
                res.json(result);
            }).catch(err => {
                console.log('problem in userDao');
                console.log(err);
            });
        }
        else {
            console.log('no restaurant');
            res.status(400).json({err: "The restaurant does not exist in the database"});
        }
    }).catch(err => {
        console.log(err);
        res.status(400).json({error: err});
    })
});


//Remove from user favorites
apiRouter.delete('/users/:userId/favorites/:restaurantId', TokenMiddleWare, (req, res) => {
    let userId = req.params.userId;
    let restaurantId = req.params.restaurantId;
    UserDAO.removeUserFavorite(userId, restaurantId).then(result => {
        res.json({success: "Successfully removed from favorites"});
    }).catch(err => {
        res.status(400).json({error: err});
    })
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


