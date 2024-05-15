const supabaseClient = require('@supabase/supabase-js')
const bodyParser = require('body-parser')
const express = require('express')

const app = express()
const port = 3000
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

const supabaseUrl = 'https://tchabdxeyblwtuuenvoq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjaGFiZHhleWJsd3R1dWVudm9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ1MDQzMDUsImV4cCI6MjAzMDA4MDMwNX0.u_NbXEqNxQtsopda8sF-2vwjLkl9K3kJeS4dyDu1A_M'
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey)

app.get('/', (req, res) => {
    res.sendFile('public/HomePage.html', { root: __dirname })
})

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

app.post('/recipe', async (req, res) => {
    console.log('Adding Recipe')

    console.log(req.body)
    var recipeName = req.body.recipeName;
    var dishType = req.body.dishType;
    var recipeCalories = req.body.recipeCalories;
    var cuisineType = req.body.cuisineType;
    var numServing = req.body.numServing;


    const { data, error } = await supabase
        .from('NutritionApp')
        .insert({ recipe_name: recipeName, dish_type: dishType, recipe_calories: recipeCalories, cuisine_type: cuisineType, num_servings: numServing })
        .select()

    if (error) {
        console.log("Error")
        res.send(error)
    } else {
        res.send(data) 
    }
})

app.listen(port, () => {
    console.log('App is alive!')
})