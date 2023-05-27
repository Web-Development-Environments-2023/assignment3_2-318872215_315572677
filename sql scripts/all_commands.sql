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


  CREATE TABLE `mydb`.`viewed_recipes` (
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`user_id`, `recipe_id`),
  CONSTRAINT `views_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


  CREATE TABLE `mydb`.`recipes` (
  `recipes_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `ready_in_minutes` INT NOT NULL,
  `vegetarian` TINYINT NOT NULL,
  `vegan` TINYINT NOT NULL,
  `gluten_free` TINYINT NOT NULL,
  `servings` INT NOT NULL,
  `instructions` TEXT NOT NULL,
  `ingredients` JSON NOT NULL,
  `image` TEXT NULL,
  PRIMARY KEY (`recipes_id`),
  CONSTRAINT `recipes_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

  
CREATE TABLE `mydb`.`family_recipe` (
  `recipes_id` INT NOT NULL,
  `creatorBy` VARCHAR(100) NULL,
  `usualTime` VARCHAR(100) NULL,
  PRIMARY KEY (`recipes_id`),
  CONSTRAINT `recipe_recipe_id`
    FOREIGN KEY (`recipes_id`)
    REFERENCES `mydb`.`recipes` (`recipes_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);