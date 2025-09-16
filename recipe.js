const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const mongoURL = "mongodb+srv://ReceipeUser:Pooja2906@receipe.hnkhrxa.mongodb.net/recipesDB?retryWrites=true&w=majority";
mongoose.connect(mongoURL)
  .then(() => console.log(" MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));


const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  steps: String,
  category: String
});

const Recipe = mongoose.model("Recipe", recipeSchema);


app.post("/recipes", async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).send(err);
  }
});


app.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).send(err);
  }
});


app.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.json(recipe);
  } catch (err) {
    res.status(500).send(err);
  }
});


app.put("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(recipe);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/recipes/:id", async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).send(err);
  }
});


app.listen(5000, () => console.log(" Server running on port 5000"));
