const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    // await DButils.execQuery(`REPLACE INTO FavoriteRecipes (user_id, recipe_id) VALUES ('${user_id}',${recipe_id})`);
    await DButils.execQuery("REPLACE INTO FavoriteRecipes (user_id, recipe_id) VALUES (?, ?)", [user_id, recipe_id]); // prepared statement (better against SQL injections)
}


async function getFavoriteRecipes(user_id){
    // const recipes_id = await DButils.execQuery(`SELECT recipe_id FROM FavoriteRecipes WHERE user_id='${user_id}'`);
    const recipes_id = await DButils.execQuery("SELECT recipe_id FROM FavoriteRecipes WHERE user_id = ?", [user_id]); // prepared statement (better against SQL injections)
    return recipes_id;
}

async function markAsViewed(user_id, recipe_id) {
    // await DButils.execQuery(`REPLACE INTO viewed_recipes (user_id, recipe_id, date) VALUES (${user_id}, ${recipe_id}, NOW())`);
    await DButils.execQuery("REPLACE INTO viewed_recipes (user_id, recipe_id, date) VALUES (?, ?, NOW())", [user_id, recipe_id]); // prepared statement (better against SQL injections)
}

async function getViewedRecipes(user_id) {
    // const viewed_recipes = await DButils.execQuery(`SELECT recipe_id FROM viewed_recipes WHERE user_id='${user_id}'`);
    const viewed_recipes = await DButils.execQuery("SELECT recipe_id FROM viewed_recipes WHERE user_id=?", [user_id]); // prepared statement (better against SQL injections)
    return viewed_recipes;

}

async function getLastViewedRecipes(user_id, number) {
    // const last_viewed_recipes = await DButils.execQuery(`SELECT recipe_id FROM viewed_recipes WHERE user_id = ${user_id} ORDER BY date DESC LIMIT ${number}`);
    const last_viewed_recipes = await DButils.execQuery("SELECT recipe_id FROM viewed_recipes WHERE user_id = ? ORDER BY date DESC LIMIT ?", [user_id, number]); // prepared statement (better against SQL injections)
    return last_viewed_recipes;
}


async function getMyRecipes(user_id, family = false) {
    let query_select_my_recipes;
    if (family){
        // query_select_my_recipes = `SELECT * FROM (SELECT * FROM recipes WHERE user_id = '${user_id}') a
        //                                 LEFT JOIN family_recipe b ON a.recipes_id = b.recipes_id
        //                                 WHERE b.recipes_id IS NOT NULL`;

        query_select_my_recipes = `SELECT * FROM (SELECT * FROM recipes WHERE user_id = ?) a
                                            LEFT JOIN family_recipe b ON a.recipes_id = b.recipes_id
                                            WHERE b.recipes_id IS NOT NULL`;
    }
    else{
        // query_select_my_recipes = `SELECT * FROM recipes WHERE user_id = '${user_id}'`;
        query_select_my_recipes = `SELECT * FROM recipes WHERE user_id = ?`;
    }
    return recipes = await DButils.execQuery(query_select_my_recipes, [user_id]);
}


async function markAsLike(recipe) {
    const recipe_id = recipe.id;
  
    var isRecipesExists = await DButils.execQuery("SELECT popularity FROM LikeRecipes WHERE recipe_id = ?", [recipe_id]);

    // let isRecipesExists = await getLikeRecipes(recipe_id);
    console.log(isRecipesExists);
  
    if (isRecipesExists.length === 0) {
        const popularity = recipe.popularity;
        console.log("before: "+popularity);
        await DButils.execQuery("INSERT INTO LikeRecipes (recipe_id, popularity) VALUES (?, ?)", [recipe_id, popularity]);
    } else {
        popularity = isRecipesExists[0]["popularity"]
        popularity += 1;
        console.log("After: "+popularity);
        await DButils.execQuery("UPDATE LikeRecipes SET popularity = ? WHERE recipe_id = ?", [popularity, recipe_id]);
    }
  }
  
async function getLikeRecipes(recipe_id){
    const [popularity] = await DButils.execQuery("SELECT popularity FROM LikeRecipes WHERE recipe_id = ?", [recipe_id]); // prepared statement (better against SQL injections)
    // console.log(popularity["popularity"]);
    retPopularity = popularity["popularity"];
    //console.log(retPopularity);
    return retPopularity;
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsViewed = markAsViewed;
exports.getViewedRecipes = getViewedRecipes;
exports.getLastViewedRecipes = getLastViewedRecipes;
exports.getMyRecipes = getMyRecipes;
exports.markAsLike = markAsLike;
exports.getLikeRecipes = getLikeRecipes;
