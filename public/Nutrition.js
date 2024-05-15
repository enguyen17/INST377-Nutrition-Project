var host = window.location.origin;
console.log(host)

// takes user input and inputs info into edamam api, generates response
function loadRecipeAnalysis() {
    let ingredients = document.getElementById('ingr').value;
    // creates array from the ingredients input - this is the data type required for edamam api call
    const spl_ingr = ingredients.split("\n");

    // use the post function to generate nutrition analysis for the user inputted recipe
    return fetch("https://api.edamam.com/api/nutrition-details?app_id=1f0f33e9&app_key=4a6ef18a8e967ad54e716321f0c7959f", {
        method: 'POST',
        body: JSON.stringify({
            "title": `${document.getElementById('recipeName').value}`,
            "ingr": spl_ingr
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => res.json())
}

// uses generated info from edamam api to populate our database
async function createRecipeLog() {
    console.log('Creating Recipe Log');

    // calls and stores the edamam api response from the loadRecipeAnalysis function
    recipeAnalysis = await loadRecipeAnalysis();
    console.log(recipeAnalysis);

    nutrientInfo = recipeAnalysis.totalNutrients;

    //console.log(nutrientInfo.FAT['quantity']);

    // uses the post function to input the desired information into the database
    await fetch(`${host}/recipe`, {
        method: 'POST',
        body: JSON.stringify({
            "recipeName": `${document.getElementById('recipeName').value}`,
            "dishType": recipeAnalysis.dishType[0],
            "recipeCalories": recipeAnalysis.calories,
            "cuisineType": recipeAnalysis.cuisineType[0],
            "numServing": recipeAnalysis.yield
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
        .then((res) => res.json())
        .then((res) => {
            console.log('clickwrk')
            var vm = new Vue({
                el: '.app',
                components: {
                    'nutrition-label': window.VueNutritionLabel.NutritionLabel
                },
                data() {
                    return {
                        options: {
                            width: 280,
                            useFdaRounding: 1,
                            readOnly: false,
                            multipleItems: false
                        },
                        item: {
                            name: 'Super Cheese Burger',
                            serving: 1,
                            servingPerContainer: 0,
                            servingUnitName: 'serving',
                            ingredientStatement: 'Swiss cheese, American cheese, more cheese and a burger.',
                            nutrition: {
                                calories: 510,
                                fatCalories: 170,
                                totalFat: 19,
                                saturatedFat: 9,
                                transFat: 0,
                                polyunsaturatedFat: 0,
                                monounsaturatedFat: 0,
                                cholesterol: 10,
                                sodium: 560,
                                totalCarb: 79,
                                fiber: 4,
                                sugars: 35,
                                protein: 9,
                                vitaminA: 1,
                                vitaminC: 2,
                                calcium: 35,
                                iron: 1,
                                addedSugars: 0,
                                potassium: 100,
                                vitaminD: 0,
                                servingWeight: 175
                            }
                        }
                    };
                }
            }); 
            
        })
        
    


}


