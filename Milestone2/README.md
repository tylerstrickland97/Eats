# Milestone 1 Report

## Introduction 
Our project, Eats, is a restaurant app in which users can view restaurants and their menu, view and add a restaurant to their favorites, view and add allergies, and view their own profile. Each restaurant includes a menu, a category, and a distance. Users will be able to edit their profile and sort the restaurants by distance, category, rating, and relevance. In addition, users will be able to edit their favorite restaurants, and allergies.

## Completed 
The Docker setup is complete and we have completed all of the necessary HTML pages and their CSS. All of the API routes have at least outlines, but most of them have been completed. The homepage, allergies page, restaurant page, and favorites page have all been able to populate data. There is restaurant json and a user json. Each user has a unique id, a list of favorites, and a list of allergies. Each restaurant has a unique id, name, category, distance, number of people that favorited the restaurant, an address, a rating, and a menu. Each menu item has a name, calories, price, and possible allergens. Using the appropriate HTML and APIRoutes, each HTML is populated with the json data. For example, the favorites page is populated with favorites.js and the getFavoritesByUser method. The entire project has been configured to use csr, or client side rendering.

## Incomplete 
We have laid most of the groundwork for our app to be fully functional and most of the remaining work lies in the frontend. Most of the HTML is static, but we plan to allow users to edit their profile and allow users to sort restaurants by category, distance, rating, and relevance. We have implemented the major pieces, including the HTML pages, but more work needs to be done to make everything flow. For now, a drop down is available to sort the restaurants by category but it is not yet functional. All of the HTML pages are currently served through a simple GET call, they are not connected to each other. In addition, we need to figure out an authentication method for logging in users, which will likely have to do with a session key, but we are hoping to get a better idea of how to approach this when there is a lecture on it. We also had to reconsider the getRestauranttByName method because it caused issues with restaurants that had names that had more than just letters. Furthermore, work needs to be done on the sidebar and its styling. Lastly, only mock data is being used right now, not actual data.

## Contributions
Tyler has been responsible for the Docker setup and adding all of the starter files. In addition, he has added json data, handled a lot of styling, made a user profile page, and made the homepage and login page. The homepage successfully populates restaurant data. Collin has been responsible for adding the restaurant page, the styling, added some json data, updated the files to use csr practices, and debugging issues. Kayna has been responsible for creating the report, adding a favorites and allergies page, and making them both populate user data. All team members have worked on HTML pages, json data, and the API routes.

<img width="651" alt="Screen Shot 2023-03-05 at 4 10 11 PM" src="https://media.github.ncsu.edu/user/18889/files/a12e6472-8b88-4985-afc1-5b3f0957bde4">


<img width="655" alt="Screen Shot 2023-03-05 at 4 10 54 PM" src="https://media.github.ncsu.edu/user/18889/files/5c60dba5-29a2-4650-8b03-0beb3bc5ff32">

[Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Spring-groupV/blob/main/Proposal/wireframes/CSC342ProjectWireframe.png?raw=true)
