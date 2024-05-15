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
    getLabel(recipeAnalysis)
    console.log(recipeAnalysis);

    nutrientInfo = recipeAnalysis.totalNutrients;

    //console.log(nutrientInfo.FAT['quantity']);

    // uses the post function to input the desired information into the database
    await fetch(`${host}/recipe`, {
        method: 'POST',
        body: JSON.stringify({
            "recipeName": `${document.getElementById('recipeName').value}`,
            "dishType": recipeAnalysis.dishType,
            "recipeCalories": recipeAnalysis.calories,
            "cuisineType": recipeAnalysis.cuisineType,
            "numServing": recipeAnalysis.yield
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
        .then((res) => res.json())
        .then((res) => {
            getLabel(document.getElementById('recipeName').value)

        })
}
async function getLabel(analysis) {
    const calories = analysis.calories;
    const yeild = analysis.yeild;
    const saturatedFat = analysis.totalNutrients.FASAT.quantity;
    const transFat = analysis.totalNutrients.FATRN.quantity;
    const polyunsaturatedFat = analysis.totalNutrients.FAPU.quantity;
    const monounsaturatedFat = analysis.totalNutrients.FAMS.quantity;
    const totalFat = (saturatedFat + transFat + polyunsaturatedFat + monounsaturatedFat);
    const cholesterol = analysis.totalNutrients.CHOLE.quantity;
    const sodium = analysis.totalNutrients.NA.quantity;
    const totalCarb = analysis.totalNutrients.CHOCDF.quantity;
    const fiber = analysis.totalNutrients.FIBTG.quantity;
    const sugars = analysis.totalNutrients.SUGAR.quantity;
    const protein = analysis.totalNutrients.PROCNT.quantity;
    const vitaminA = analysis.totalNutrients.VITA_RAE.quantity;
    const vitaminC = analysis.totalNutrients.VITC.quantity;
    const calcium = analysis.totalNutrients.CA.quantity;
    const iron = analysis.totalNutrients.FE.quantity;
    const addedSugars = analysis.totalNutrients.SUGAR.quantity;
    const potassium = analysis.totalNutrients.K.quantity;
    const vitaminD = analysis.totalNutrients.VITD.quantity;
    const servingWeight = analysis.totalWeight;
    const fatCalories = totalFat*9;


    try {
        var vm = new Vue({
            el: '#app',
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
                        name: analysis.recipe_name,
                        serving: analysis.num_servings,
                        servingPerContainer: yeild,
                        servingUnitName: 'serving',
                        ingredientStatement: '',
                        nutrition: {
                            calories: calories,
                            fatCalories: fatCalories,
                            totalFat: totalFat,
                            saturatedFat: saturatedFat,
                            transFat: transFat,
                            polyunsaturatedFat: polyunsaturatedFat,
                            monounsaturatedFat: monounsaturatedFat,
                            cholesterol: cholesterol,
                            sodium: sodium,
                            totalCarb: totalCarb,
                            fiber: fiber,
                            sugars: sugars,
                            protein: protein,
                            vitaminA: vitaminA,
                            vitaminC: vitaminC,
                            calcium: calcium,
                            iron: iron,
                            addedSugars: addedSugars,
                            potassium: potassium,
                            vitaminD: vitaminD,
                            servingWeight: servingWeight
                        }
                    }
                };
            }
        });

    } catch (error) {
        console.error("getLabel", error);
    }
}


