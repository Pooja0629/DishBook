const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const mongoURL = "mongodb+srv://ReceipeUser:Pooja2906@receipe.hnkhrxa.mongodb.net/recipesDB?retryWrites=true&w=majority";
mongoose.connect(mongoURL)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log("MongoDB error:", err));

const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  steps: String,
  category: String
});
const Recipe = mongoose.model("Recipe", recipeSchema);

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
const User = mongoose.model("User", userSchema);

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    res.json({ message: `Welcome back, ${user.username}!`, user });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/recipes", async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Error saving recipe", error: err });
  }
});

app.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipes", error: err });
  }
});

app.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipe", error: err });
  }
});

app.put("/recipes/:id", async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Recipe not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating recipe", error: err });
  }
});

app.delete("/recipes/:id", async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting recipe", error: err });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
