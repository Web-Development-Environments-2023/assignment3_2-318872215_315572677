const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`REPLACE INTO FavoriteRecipes (user_id, recipe_id) VALUES ('${user_id}',${recipe_id})`);
}


async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`SELECT recipe_id FROM FavoriteRecipes WHERE user_id='${user_id}'`);
    return recipes_id;
}

async function markAsViewed(user_id, recipe_id) {
    await DButils.execQuery(`REPLACE INTO viewed_recipes (user_id, recipe_id, date) VALUES (${user_id}, ${recipe_id}, NOW())`);
}

async function getViewedRecipes(user_id) {
    const viewed_recipes = await DButils.execQuery(`SELECT recipe_id FROM viewed_recipes WHERE user_id='${user_id}'`);
    return viewed_recipes;

}

async function getLastViewedRecipes(user_id, number) {
    const last_viewed_recipes = await DButils.execQuery(`SELECT recipe_id FROM viewed_recipes WHERE user_id = ${user_id} ORDER BY date DESC LIMIT ${number}`);
    return last_viewed_recipes;
}


async function getMyRecipes(user_id, family = false) {
    let query_select_my_recipes;
    if (family){
        query_select_my_recipes = `SELECT * FROM (SELECT * FROM recipes WHERE user_id = '${user_id}') a
                                        LEFT JOIN family_recipe b ON a.recipes_id = b.recipes_id
                                        WHERE b.recipes_id IS NOT NULL`;
    }
    else{
        query_select_my_recipes = `SELECT * FROM recipes WHERE user_id = '${user_id}'`;
    }
    return recipes = await DButils.execQuery(query_select_my_recipes);
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsViewed = markAsViewed;
exports.getViewedRecipes = getViewedRecipes;
exports.getLastViewedRecipes = getLastViewedRecipes;
exports.getMyRecipes = getMyRecipes;
