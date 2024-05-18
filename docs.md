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

3. Once you have added the file, push it to your remote repository
4. Navigate to vercel.com "https://vercel.com"
5. Create an account (linking with github, gitlab, or bitbucket are easiest)
6. Import the respotories you want to deploy to your vercel account
7. Deploy the repository/project.

## API Usage
This app utilizes the Nutrition Analysis API from Edamam. More information on how this API functions and documentation can be found [here](https://developer.edamam.com/edamam-nutrition-api).

Users input recipes with each ingredient with quantities on a new line. The Edamam API will return various nutrition information such as number of calories, cuisine type, etc. This information gets stored in the supabase through a POST function as noted in the Edamam Documentation.

### GET all recipes
This returns all of the recipes that have been analyzed through the app. It returns an array of all recipes with the following information:

id (integer) unique id assigned to each recipe
created_at (timestamp) indicates when the recipe was analyzed by our application
recipe_name (string) name of recipe
dish_type (string) 
recipe_calories
cuisine_type
num_servings
total_fat
saturated_fat
trans_fat
polyunsat_fat
monounsat_fat
cholesterol
sodium
total_carb
fiber
sugar
protein
vit_a
vit_c
calcium
iron
potassium
vit_d


