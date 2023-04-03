# Milestone 2 Report

## Introduction 
Our project, Eats, is a restaurant app in which users can view restaurants and their menu, view and add a restaurant to their favorites, view and add allergies, and view their own profile. Each restaurant includes a menu, a category, and a distance. Users will be able to edit their profile and sort the restaurants by distance, category, rating, and relevance. In addition, users will be able to edit their favorite restaurants through a favoriting action.

## Completed 
Eats is now connected to a database. Our chosen database is Dolthub’s menu database, which includes a restaurant’s name, city, menu item, price, and additional nutritional information. The restaurants have been put into a database file and properly populated. Users have been implemented and correctly authenticated. We have changed allergies to be incorporated into the profile page. 

## Incomplete 
We are reconsidering the implementation of allergies, as they were not a category in the database because the database was populated externally. We are considering ways to store a user’s favorite restaurants in the database.

## Contributions
Tyler and Collin have played a significant role in setting up the database and connecting the html pages to populate data from the database. Kayna worked on authentication. All members worked on transferring work from Milestone 1 to Milestone 2.

## API Routes
| method | route                                  | description                                 |
|--------|----------------------------------------|---------------------------------------------|
| GET    | /restaurants                           | Gets all restaurants                        |
| GET    | /restaurants/:restaurantId             | Gets a restaurant by id                     |
| GET    | /restaurants/:restaurantName           | Gets a restaurant by name                   |
| GET    | /menu/:restaurantId                    | Gets menu items for restaurant by id        |
| GET    | /categories/:category/restaurants      | Gets all restaurants in a specific category |
| GET    | /users:/userId                         | Gets a user by id                           |
| GET    | /users/:userId/favorites               | Gets a user's favorite restaurants          |
| POST   | /users                                 | Creates a user                              |
| POST   | /login                                 | Login                                       |
| POST   | /logout                                | logout                                      |
| GET    | /users/:userId/allergies               | Gets a users allergies                      |
| POST   | /users/:userId/allergies               | Adds a user allergy                         |
| DELETE | /users/:userId/allergies/:name         | Delete's a user allergy                     |
| POST   | /users/:userId/favorites               | Adds a restaurant to user favoritess        |
| DELETE | /users:/userId/favorites/:restaurantId | Removes a restaurant from user favorites    |
| POST   | /users/:userId                         | Updates a user account information          |

## Pages
| Page | Percent Complete | Wireframes | Comments |
| ---- | ---------------- | ---------- | -------- |
|restaurant | 100% | [wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Spring-groupV/blob/main/Proposal/wireframes/CSC342ProjectWireframe.png) | |
| index (login) | 70% | [wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Spring-groupV/blob/main/Proposal/wireframes/CSC342ProjectWireframe.png) | Have some user authentication problems |
|favorites|70%|[wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Spring-groupV/blob/main/Proposal/wireframes/CSC342ProjectWireframe.png) | Discussing how to structure database table for favorites |
|profile | 70%| [wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Spring-groupV/blob/main/Proposal/wireframes/CSC342ProjectWireframe.png) | Can't edit user information yet |
|homepage|100%||Homepage works as expected|

##ER Diagram of Database Schema
(https://github.ncsu.edu/engr-csc342/csc342-2023Spring-groupV/blob/main/Proposal/db_schema.png)
