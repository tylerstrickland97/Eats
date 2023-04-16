# Final Project Report

## Introduction
Our project, Eats, is a restaurant app in which users can view restaurants and their menu, view and add a restaurant to their favorites, view and add allergies, and view their own profile. Each restaurant includes a menuand locations. Users are able to modify their allergies, favorites, and search for restaurants.

## What works
All main features of our app currently work. These features include:
 - Creating a new account
 - Logging into an existing account
 - Logging out of your account
 - Viewing a list of restaurants
 - Adding and removing restaurants from your favorites
 - Searching for a restaurant
 - Sorting the list of restaurants
 - Viewing the menu items of a restaurant
 - Categorizing menu items based on substrings
 - Viewing restaurant locations using Google Places API
 - Viewing a user's profile information
 - Adding and removing allergies from a user's profile

## What doesn't work
Everything that exists in our project works, but we did not get to add all of the features we
wanted to. These features include:
 - Leaving a review on a restaurant's page
 - Connect to a Restaurant API instead of using a hardcoded database
 - Favoriting menu items
 - Sorting menu items by total favorites

## Pages

Note: For all pages Offline Functionality only applies when the page has been visited before,
otherwise the user will be redirected to an offline page.

Page            | Function                                         | Navigation | Offline Functionality
--------------- | ------------------------------------------------ | -----------| ---------------------
index (login) | Allows the user to login or create a new account | This is the default page and can be accessed by visiting '\' or logging out | This page can only be viewed while offline
home | Displays all restaurants, allows the user to view any restaurants menu, search for a restaurant, and navigate to the user's profile. | This page can be reached by logging into an account or by pressing the `Back` button on any other page (except login) | This page has full functionality while offline
profile | Allows the user to view their accounts information, add/remove allergies, and logout | This page is reached by clicking the user icon in the top right of the home page | This page allows viewing information while offline, but not adding or removing allergies.
restaurant | The page displays the information of a specific restaurant. This information includes menu items, the type of menu items, potential allergies, locations, and a google map embed. The user can add and remove the restaurant as a favorite from this page | This page can be accessed by clicking on the "View Menu" button of the restaurant from the home page. If the restaurant is a favorite it can also be accessed from the user's profile page. | The user can view the restaurants menu items, but not its locations while offline. The user can not add and remove the restaurant as a favorite while offline.


## Caching Strategy
Our caching strategy was to intercept any fetch get requests and store them in the cache. Due to
the small amount of information included in our app we are available to store all information in
the cache. When the user is offline they will be able to view any page that they have previously
visited, but will be redirected to a "You are Offline" page if they attempt to visit a new page.

## ER Diagram
<img src="https://github.ncsu.edu/engr-csc342/csc342-2023Spring-groupV/blob/main/Proposal/final_db_schema.png"  width="600">

## Individual Contributions

### Collin
Collin wrote the HTML for most of the pages. He also wrote most of the JavaScript that converted
JSON objects into HTML and populated pages. Collin created most of the event listeners that
the pages use. He created some of the backend API Routes. Collin also helped debug many issues
that occurred during the projects development. 

### Kayna


### Tyler


## API Routes

Method   | Route                                    | Description
-------- | ---------------------------------------- | ---------
`GET`    | `/restaurants`                           | Gets all restaurants in the database
`GET`    | `/restaurants/:restaurantId`             | Get the restaurant with the provided ID
`GET`    | `/menu/:restaurantId`                    | Gets the menu of the restaurant with the provided ID
`GET`    | `/restaurants/:restaurantName`           | Gets the restaurant with the provided name
`GET`    | `/users/:userId`                         | Gets the user with the provided ID
`GET`    | `/username/:userUsername`                | Gets the user with the provided username
`GET`    | `/current`                               | Gets the currently logged in user
`GET`    | `/users/:userId/favorites`               | Gets the favorite restaurants of the provided userId
`GET`    | `/allergies`                             | Gets a list of allergies
`GET`    | `/users/:userId/allergies`               | Gets a list of a user’s allergies
`GET`    | `/allergies/:id`                         | Get the allergy with the given Id
`POST`   | `/restaurants`                           | Create a new restaurant
`POST`   | `/users`                                 | Creates a new user
`POST`   | `/login`                                 | Login the user with matching information
`POST`   | `/logout`                                | Logs out the currently logged in user
`POST`   | `/users/:userId/allergies`               | Adds the allergy to the list of the provided users allergies
`POST`   | `/users/:userId/favorites`               | Adds the restaurant to the list of the provided users favorites
`DELETE` | `/users/:userId/allergies/:name`         | Removes the provided allergy from the list of allergies of the provided user
`DELETE` | `/users/:userId/favorites/:restaurantId` | Removes the provided restaurant from the list of favorites of the provided user
