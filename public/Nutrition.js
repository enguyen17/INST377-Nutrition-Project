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
    recipeAnalysis = await loadRecipeAnalysis();
    console.log(recipeAnalysis);

    nutrientInfo = recipeAnalysis.totalNutrients;

    console.log(Math.round(nutrientInfo.FAT['quantity']));

    const dishTypes = recipeAnalysis.dishType;
    dishTypeChart(dishTypes);

    // uses the post function to input the desired information into the database
    await fetch(`${host}/recipe`, {
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
    })
    .then((res) => res.json())
    .then((res) => {
        
    })

    document.forms['add-recipe'].reset()


}