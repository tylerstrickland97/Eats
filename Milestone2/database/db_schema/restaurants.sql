/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE IF NOT EXISTS `restaurants` (
  `restaurant_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `restaurant_name` varchar(100) NOT NULL,
  PRIMARY KEY (`restaurant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `salt` varchar(100) NOT NULL,
  `password_hash` varchar(100) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `menu_items` (
  `item_id` int(10)unsigned NOT NULL,
  `restaurant` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `calories` int(10) unsigned,
  `fat_g` int(10) unsigned,
  `carbohydrates_g` int(10) unsigned,
  `protein_g` int(10) unsigned,
  `sodium_mg` int(10) unsigned,
  `cholesterol_mg` int(10) unsigned,
  `fiber_g` int(10) unsigned,
  `restaurant_id` int(10) unsigned,
  PRIMARY KEY (`item_id`),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `restaurants`;
INSERT INTO `restaurants` (`restaurant_id`, `restaurant_name`) VALUES
  (1, 'Starbucks'),
  (2, 'McDonalds'),
  (3, 'Burger King'),
  (4, 'Taco Bell'),
  (5, 'KFC'),
  (6, 'Chilis Bar and Grill'),
  (7, 'Five Guys'),
  (8, 'Chick-fil-a'),
  (9, 'Cook Out'),
  (10, 'Dominos'),
  (11, 'Golden Corral'),
  (12, 'Bojangles'),
  (13, 'Wendys'),
  (14, 'Olive Garden'),
  (15, 'Panera Bread'),
  (16, 'Red Robin'),
  (17, 'Red Lobster'),
  (18, 'Subway'),
  (19, 'Pizza Hut'),
  (20, 'Carls Jr.'),
  (21, 'Popeyes'),
  (22, 'Chipotle');

-- ALTER TABLE `menu_items`
-- ADD FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`restaurant_id`);

