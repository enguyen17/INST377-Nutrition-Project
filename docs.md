# Developer Manual

## Installation

Users should have Node.js and Node Package Manager installed. 

Node.js can be installed through Node Version Manager - follow https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/

Once Node Verson Manager is installed, Node.js can be installed using the following command:

`nvm install node`

Installaton via Node Version Manager automatically installs Node Package Maanager.

### Dependencies
Express.js and Nodemon were used to develop the back-end. They can be installed using the following commands:

`npm install express`

`npm install nodemon`

Body-parser was used to parse the data for the POST request. Install using the following command:

`npm install body-parser`


This app uses a Suapbase database. Install Supabase using the following command:

`npm install @supabase/supabase-js`

### Running Application on a Server
To deploy the application using vercel: 
1. Create a new file named "vercel.json" 
2. Add the following lines:
```.json
    {
        "version": 2,
        "builds":[
            {
                "src": "./index.js",
                "use": "@vercel/node"
            }
        ],
        "routes": [
            {
                "src": "/(.*)",
                "dest": "/"
            }
        ]
    }
```
4. Once you have added the file, push it to your remote repository
5. Navigate to vercel.com "https://vercel.com"
6. Create an account (linking with github, gitlab, or bitbucket are easiest)
7. Import the respotories you want to deploy to your vercel account
8. Deploy the repository/project.

## API Usage
This app utilizes the Nutrition Analysis API from Edamam. More information on how this API functions and documentation can be found [here](https://developer.edamam.com/edamam-nutrition-api).

Users input recipes with each ingredient with quantities on a new line. The Edamam API will return various nutrition information such as number of calories, cuisine type, etc. This information gets stored in the supabase through a POST function as noted in the Edamam Documentation.

Recipe Information fields in Supabase: 
`id (integer)` unique id assigned to each recipe

`created_at (timestamp)` indicates when the recipe was analyzed by our application

`recipe_name (string)` name of recipe

The following variables are generated from the Edamam APi:

`dish_type (string)` categorizaton of the recipe

`recipe_calories (integer)` number of calories in the recipe

`cuisine_type (string)` cuisine categorization of the recipe

`num_servings (integer)` number of servings generated from the recipe

`total_fat (integer)` Total lipid (fat) in grams

`saturated_fat (integer)` Fatty acids, total saturated in grams

`trans_fat (integer)` Fatty acids, total trans in grams'

`polyunsat_fat (integer)` Fatty acids, total polyunsaturated	

`monounsat_fat (integer)` Fatty acids, total monounsaturated	

`cholesterol (integer)` Cholesterol in mg

`sodium (integer)` Sodium in mg

`total_carb (integer)` Total Carbohydrates in grams

`fiber (integer)` Fiber, total dietary in grams

`sugar (integer)` Sugars, total in grams

`protein (integer)` Protein in grams

`vit_a (integer)` Vitamin A, RAE in µg

`vit_c (integer)` Vitamin C, total ascorbic acid in mg

`calcium (integer)` Calcium, Ca in mg

`iron (integer)` Iron, Fe in mg

`potassium (integer)` Potassium, K in mg

`vit_d (integer)` Vitamin D (D2 + D3)	in µg

### GET all recipes /recipes
This returns all of the recipes that have been analyzed through the app. The GET function is as follows:
```javascript
app.get('/recipes', async (req, res) => {
    console.log('Attempting to GET recipe analysis')
    const { data, error } = await supabase
        .from('NutritionApp')
        .select()

    if (error) {
        console.log("Error")
        res.send(error)
    } else {
        res.send(data)
    }

    console.log('Data:', data)
    console.log('Error:', error)
})
```

### Post Adding a new recipe /recipe
This returns the recipe information based on a POST request of the recipe content. The POST request submits the recipe content which is pulled from the Edamam API call. The response the API returns, will contain the recipe information for the recipe based on the information provided. The POST fuction is as follows:
```javascript
app.post('/recipe', async (req, res) => {
    console.log('Adding Recipe')

    console.log(req.body)
    var recipeName = req.body.recipeName;
    var dishType = req.body.dishType;
    var recipeCalories = req.body.recipeCalories;
    var cuisineType = req.body.cuisineType;
    var numServing = req.body.numServing;
    var totalFat = req.body.totalFat;
    var satFat = req.body.satFat;
    var transFat = req.body.transFat;
    var polyunsatFat = req.body.polyunsatFat;
    var monounsatFat = req.body.monounsatFat;
    var cholest = req.body.cholest;
    var sodi = req.body.sodi;
    var totalCarb = req.body.totalCarb;
    var fib = req.body.fib;
    var suga = req.body.suga;
    var prot = req.body.prot;
    var vitA = req.body.vitA;
    var vitC = req.body.vitC;
    var calci = req.body.calci;
    var iro = req.body.iro;
    var potass = req.body.potass;
    var vitD = req.body.vitD;

    const { data, error } = await supabase
        .from('NutritionApp')
        .insert({ 
            recipe_name: recipeName, 
            dish_type: dishType, 
            recipe_calories: recipeCalories, 
            cuisine_type: cuisineType, 
            num_servings: numServing,
            total_fat: totalFat,
            saturated_fat: satFat,
            trans_fat: transFat,
            polyunsat_fat: polyunsatFat,
            monounsat_fat: monounsatFat,
            cholesterol: cholest,
            sodium: sodi,
            total_carb: totalCarb,
            fiber: fib,
            sugar: suga,
            protein: prot,
            vit_a: vitA,
            vit_c: vitC,
            calcium: calci,
            iron: iro,
            potassium: potass,
            vit_d: vitD
        })
        .select()

    if (error) {
        console.log("Error")
        res.send(error)
    } else {
        res.send(data) 
    }
})
```

### A clear set of expencations around known bugs
- The Edamam api receiveies a list of ingredients, but requires a certain "quality" of ingredients. Firstly, when adding the ingredients cheese or bread, water needs to also be added as an ingredient. Secondly, when entering ingredients, You can submit items without a quantity. The Edamame api will try to assign a quantitiy to them base on the expected serving size. Thirdly, the api will not use raw ingredients. And fourthly, the api can use single and two part compound. Any issues with the "quality" of the recipe will be represented by a 555 error. Other possible reasons are: too high or too low weight of a serving, unrecognized ingredients or ingredients to which no weight can be assigned. 
- In our experience with the api we found that you cannot simply add a verw ingrediants like salt, and pepper, but you have to make a list of ingredients that represent a more full recipie, as opposed to a few ingredients.
- To use the Edemam api you need to create an account with Edeam and aquire credientials. These credentials (ap_key and app_id) can be found in the dashboard.
Upgraded plans are not required for the use of the api.
- To get the best results: Always include an ingredient quantity: “3 oz butter cookies” is preferable to “butter cookies or tuiles”
Shorten and simplify the line: “2 cans garbanzo beans, drained” is preferable to “2-2 1/2 cans of washed and drained garbanzo beans”
If oil is used for frying, indicate so in the ingredient line (add the words “for frying”), so we can accurately calculate how much gets absorbed.
For stocks and broths, include “stock” or “broth” in the recipe title, so we can accurately calculate the remaining nutritional value once it’s strained.
