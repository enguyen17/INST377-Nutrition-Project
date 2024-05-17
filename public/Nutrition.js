var host = window.location.origin;

// store dishType counts
let dishTypeCounts = {};
let chart;

// creates or updates chart
function dishTypeChart(dishTypes) {
    //update count for dishType
    dishTypes.forEach(type => {
        dishTypeCounts[type] = (dishTypeCounts[type] || 0) + 1;
    });

    if (chart) {
        //if chart exists update the data.
        chart.data.labels = Object.keys(dishTypeCounts);
        chart.data.datasets[0].data = Object.values(dishTypeCounts);
        chart.update();
    } else {
        //if chart doesnt exist create one.
        const ctx = document.getElementById('dishTypeChart');
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(dishTypeCounts),
                datasets: [{
                    label: 'Number of Recipes',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    data: Object.values(dishTypeCounts),
                }]
            },
            options: {
                scales: {
                    y: {
                        ticks: {
                            color: 'black',
                            stepSize: 1
                        }
                    },
                    x: {
                        ticks: {
                            color: 'black'
                        }
                    },
                }
            }
        });
    }
}

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
    const recipeAnalysis = await loadRecipeAnalysis();
   
    console.log(recipeAnalysis);

    const nutrientInfo = recipeAnalysis.totalNutrients;

    const dishTypes = recipeAnalysis.dishType;
    dishTypeChart(dishTypes);

    // uses the post function to input the desired information into the database
    const response = await fetch(`${host}/recipe`, {
        method: 'POST',
        body: JSON.stringify({
            "recipeName": `${document.getElementById('recipeName').value}`,
            "dishType": recipeAnalysis.dishType[0],
            "recipeCalories": recipeAnalysis.calories,
            "cuisineType": recipeAnalysis.cuisineType[0],
            "numServing": recipeAnalysis.yield,
            "totalFat": Math.round(nutrientInfo.FAT['quantity']),
            "satFat": Math.round(nutrientInfo.FASAT['quantity']),
            "transFat": Math.round(nutrientInfo.FATRN['quantity']),
            "polyunsatFat": Math.round(nutrientInfo.FAPU['quantity']),
            "monounsatFat": Math.round(nutrientInfo.FAMS['quantity']),
            "cholest": Math.round(nutrientInfo.CHOLE['quantity']),
            "sodi": Math.round(nutrientInfo.NA['quantity']),
            "totalCarb": Math.round(nutrientInfo.CHOCDF['quantity']),
            "fib": Math.round(nutrientInfo.FIBTG['quantity']),
            "suga": Math.round(nutrientInfo.SUGAR['quantity']),
            "prot": Math.round(nutrientInfo.PROCNT['quantity']),
            "vitA": Math.round(nutrientInfo.VITA_RAE['quantity']),
            "vitC": Math.round(nutrientInfo.VITC['quantity']),
            "calci": Math.round(nutrientInfo.CA['quantity']),
            "iro": Math.round(nutrientInfo.FE['quantity']),
            "potass": Math.round(nutrientInfo.K['quantity']),
            "vitD": Math.round(nutrientInfo.VITD['quantity'])
        }),
        headers: {
            "Content-type": "application/json"
        }
    });

    const newRecipe = await response.json();
    await updateRecipeTable();
    document.forms['add-recipe'].reset();
}

async function getLabel(analysis) {
    let recipeName = analysis.recipe_name;
    const calories = analysis.recipe_calories;
    const yield = analysis.num_servings;
    const saturatedFat = analysis.saturated_fat;
    const transFat = analysis.trans_fat;
    const polyunsaturatedFat = analysis.polyunsat_fat;
    const monounsaturatedFat = analysis.monounsat_fat;
    const totalFat = analysis.total_fat;
    const cholesterol = analysis.cholesterol;
    const sodium = analysis.sodium;
    const totalCarb = analysis.total_carb;
    const fiber = analysis.fiber;
    const sugars = analysis.sugar;
    const protein = analysis.protein;
    const vitaminA = analysis.vit_a;
    const vitaminC = analysis.vit_c;
    const calcium = analysis.calcium;
    const iron = analysis.iron;
    const potassium = analysis.potassium;
    const vitaminD = analysis.vit_d;
    const fatCalories = totalFat * 9;

    let ingredients = document.getElementById('ingr').value;

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
                        name: recipeName,
                        serving: yield,
                        servingPerContainer: yield,
                        servingUnitName: 'serving',
                        ingredientStatement: ingredients,
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
                            potassium: potassium,
                            vitaminD: vitaminD,
                        }
                    }
                };
            }
        });

    } catch (error) {
        console.error("getLabel", error);
    }
    document.forms['add-recipe'].reset();
}

// get the supabase database recipe information
async function getRecipes() {
   return fetch(`${host}/recipes`).then((res) => res.json());
}

// Function to update table with all recipes
async function updateRecipeTable() {
    const allRecipes = await getRecipes();

    const tableBody = document.getElementById('nutritionalTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; 

    allRecipes.forEach(recipe => {
        const row = document.createElement('tr');
        
        // Create cells for column
        const cell1 = document.createElement('td');
        cell1.textContent = recipe.recipe_name;
        const cell2 = document.createElement('td');
        cell2.textContent = recipe.recipe_calories;
        const cell3 = document.createElement('td');
        cell3.textContent = recipe.dish_type;
        const cell4 = document.createElement('td');
        cell4.textContent = recipe.cuisine_type;
        
        // Append cells to row
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        
        // Append row to table 
        tableBody.appendChild(row);
    });
}

// Initialize the table with existing recipes on page load
document.addEventListener('DOMContentLoaded', updateRecipeTable);
