var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.username) {
    DButils.execQuery("SELECT username FROM users").then((users) => {
      if (users.find((x) => x.username === req.session.username)) {
        req.username = req.session.username;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.username;
    if (!user_id) throw {status: 401, message: "Must login to make this save"};
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(201).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.username;
    //let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


/**
 * This path returns the 3 last recipes that shown by login user
 */
router.get('/lastWatched', async (req,res,next) => {
  try{
    const user_id = req.session.username;
    const numberLastWatched = 3;
    const recipes_id = await user_utils.getLastViewedRecipes(user_id, numberLastWatched);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  }
  catch(error){
    next(error);
  }
});

/**
 * This path returns all my recipes
 */
router.get('/myRecipes', async (req,res,next) => {
  try{
    const user_id = req.session.username;
    if (!user_id) {
      throw { status: 401, message: "Must login before" };
    }
    const recipes = await user_utils.getMyRecipes(user_id);
    res.status(200).send(recipes);
  }
  catch(error){
    next(error);
  }
});


/**
 * This path returns all family recipes
 */
router.get('/familyRecipes', async (req,res,next) => {
  try{
    const user_id = req.session.username;
    if (!user_id) {
      throw { status: 401, message: "Must login before" };
    }
    const recipes = await user_utils.getMyRecipes(user_id, true);
    res.status(200).send(recipes);
  }
  catch(error){
    next(error);
  }
});


/**
 * This path gets body with recipeId and save the amount likes for recipe by logged-in user
 */
router.post('/Like', async (req,res,next) => {
  try{
    const user_id = req.session.username;
    if (!user_id) throw {status: 401, message: "Must login to make this save"};
    const recipe_id = req.body.recipeId;
    const recipe = await recipe_utils.getRecipeDetails(recipe_id);
    if (!recipe) throw {status: 400, message: "Recipe not found"};
    // console.log(recipe.popularity);
    await user_utils.markAsLike(recipe);
    res.status(201).send("The Recipe successfully got like :) ");
    } catch(error){
    next(error);
  }
})




module.exports = router;
