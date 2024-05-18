const supabaseClient = require('@supabase/supabase-js')
const bodyParser = require('body-parser')
const express = require('express')

const app = express()
const port = 3000
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public/'))

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

app.listen(port, () => {
    console.log('App is alive!')
})