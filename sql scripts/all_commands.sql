-- SQLBook: Code
# Create DATABASE
CREATE DATABASE mydb
    DEFAULT CHARACTER SET = 'utf8mb4';

CREATE TABLE `mydb`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(30) NOT NULL UNIQUE,
  `first_name` VARCHAR(20) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `country` VARCHAR(60) NOT NULL,
  `password` VARCHAR(120) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `profilePic` BLOB,
  PRIMARY KEY (`user_id`));

CREATE TABLE `mydb`.`FavoriteRecipes` (
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `recipe_id`),
  CONSTRAINT `favorites_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
