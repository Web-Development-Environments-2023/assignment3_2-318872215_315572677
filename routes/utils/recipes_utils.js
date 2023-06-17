const axios = require("axios");
const DButils = require("./DButils");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}


async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, instructions, servings, extendedIngredients } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        instructions: instructions,
        servings: servings,
        ingredients: extendedIngredients,
        
    }
}




async function getRandomRecipes(){
    const response = await axios.get(`${api_domain}/random`, {
        params: {
            number: 10,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response;
}


function extractPreviewRecipeDetails(recipes_info){
    return recipes_info.map((recipe_info) => {
        let data = recipe_info;
        if (recipe_info.data){
            data = recipe_info.data;
        }
        const {
            id,
            title,
            readyInMinutes,
            image,
            aggregateLikes,
            vegan,
            vegetarian,
            glutenFree
        } = data;
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree
        }
    })
}



async function getRandomThreeRecipes(){
    let random_pool = await getRandomRecipes();
    let filterd_random_pool = random_pool.data.recipes.filter((random) => (random.instructions != "") && (random.image && random.image != ""));
    if (filterd_random_pool.length < 3) {
        return getRandomThreeRecipes();
    }
    return extractPreviewRecipeDetails([filterd_random_pool[0], filterd_random_pool[1], filterd_random_pool[2]]);
}


async function getRecipesPreview(recipes_ids_list){
    let promises = [];
    recipes_ids_list.map((id) =>{
        promises.push(getRecipeInformation(id));
    });
    let recipes_info = await Promise.all(promises);
    return extractPreviewRecipeDetails(recipes_info);
}



async function searchRecipes(searchQuery, numberSearch = 5, cuisineSearch, dietSearch, intoleranceSearch){
    const response = await axios.get(`${api_domain}/complexSearch`,{
        params: {
            query: searchQuery,
            number: numberSearch,
            cuisine: cuisineSearch,
            diet: dietSearch,
            intolerance: intoleranceSearch,
            fillIngredients: false,
            addRecipeInformation: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return convertSearchRecipes(response.data.results);
    // return response.data.results;
}

async function convertSearchRecipes(RecipesAarray){
    for (let i = 0; i < RecipesAarray.length; i++) {
        RecipesAarray[i] = await getRecipeDetails(RecipesAarray[i].id);
    }
    return RecipesAarray;
}


async function addRecipe(user_id, recipe) {
    try {
        instructionsToJSON = JSON.stringify(recipe.instructions);
        ingredientsToJSON = JSON.stringify(recipe.ingredients);
        // await DButils.execQuery(`INSERT INTO recipes (user_id, title, ready_in_minutes, vegetarian, vegan, gluten_free, servings, image, instructions, ingredients) VALUES
        //         (${user_id}, '${recipe.title}', ${recipe.readyInMinutes}, ${recipe.vegetarian},${recipe.vegan}, ${recipe.glutenFree},
        //          ${recipe.servings}, '${recipe.image}', '${instructionsToJSON}', '${ingredientsToJSON}')`);

        await DButils.execQuery(`INSERT INTO recipes (user_id, title, ready_in_minutes, vegetarian, vegan, gluten_free,
                                 servings, image, instructions, ingredients) VALUES
                                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                [user_id, recipe.title, recipe.readyInMinutes, recipe.vegetarian, recipe.vegan, recipe.glutenFree,
                                     recipe.servings, recipe.image, instructionsToJSON, ingredientsToJSON]);


        if (recipe.creatorBy && recipe.usualTime) {
            const [result] = await DButils.execQuery(`SELECT MAX(recipes_id) AS max_id FROM recipes`);
            const family_recipes_id = result.max_id || 0;
            // await DButils.execQuery(`INSERT INTO family_recipe (recipes_id, creatorBy, usualTime) VALUES 
            //     (${family_recipes_id}, '${recipe.creatorBy}', '${recipe.usualTime}')`);
            await DButils.execQuery(`INSERT INTO family_recipe (recipes_id, creatorBy, usualTime) VALUES
                                    (?, ?, ?)`,
                                    [family_recipes_id, recipe.creatorBy, recipe.usualTime]);
        }
                  

    } catch (e) {
        console.log(e.sqlMessage);
        throw e;
    }
}


async function analyzedInstructions(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/analyzedInstructions`, {
        params: {
            stepBreakdown: true,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getAnalyzedInstructions(recipe_id){
    let instructions = await analyzedInstructions(recipe_id);
    let { id, name, steps } = instructions.data[0];
    return {
        id: id,
        name: name,
        steps: steps
    }
}

async function getExtendedIngredients(analyzedInstructions){
    console.log(analyzedInstructions)
    const dictionary = {
        id: analyzedInstructions.id,
        name: analyzedInstructions.name,
        steps: analyzedInstructions.steps.map(step => ({
          number: step.number,
          step: step.step,
          ingredients: step.ingredients,
          equipment: step.equipment
        }))
      };

      return dictionary.number;

}


exports.getRecipeDetails = getRecipeDetails;
exports.getRandomThreeRecipes = getRandomThreeRecipes;
exports.getRecipesPreview = getRecipesPreview;
exports.searchRecipes = searchRecipes;
exports.addRecipe = addRecipe;
exports.analyzedInstructions = analyzedInstructions;
exports.getAnalyzedInstructions = getAnalyzedInstructions;
exports.getExtendedIngredients = getExtendedIngredients;
