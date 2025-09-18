const BACKEND_URL = "https://dishbook-backend-production.up.railway.app";

let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
let allRecipes = [];

if (loggedInUser) {
  fetchRecipes();
} else if (window.location.pathname.includes("index.html")) {
  alert("Please login first!");
  window.location.href = "login.html";
}

// -------------------- Signup --------------------
async function signup(event) {
  event.preventDefault();

  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const res = await fetch(`${BACKEND_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      loggedInUser = data.user;
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      window.location.href = "index.html";
    }
  } catch (err) {
    console.error(err);
    alert("Signup failed!");
  }
}

// -------------------- Login --------------------
async function login(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    loggedInUser = data.user;
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    alert(data.message);
    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
    alert("Login failed!");
  }
}

// -------------------- Add Recipe --------------------
async function addRecipe(event) {
  event.preventDefault();

  if (!loggedInUser) {
    alert("Please login first!");
    return;
  }

  const name = document.getElementById("recipeName").value;
  const ingredients = document.getElementById("recipeIngredients").value.split(",");
  const steps = document.getElementById("recipeSteps").value;
  const category = document.getElementById("recipeCategory").value;

  try {
    const res = await fetch(`${BACKEND_URL}/recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        ingredients,
        steps,
        category,
        userEmail: loggedInUser.email
      })
    });

    const data = await res.json();
    alert("Recipe added successfully!");
    document.getElementById("recipeForm").reset();
    fetchRecipes();
  } catch (err) {
    console.error(err);
    alert("Error adding recipe!");
  }
}

// -------------------- Fetch Recipes --------------------
async function fetchRecipes() {
  if (!loggedInUser) return;

  try {
    const res = await fetch(`${BACKEND_URL}/recipes/${loggedInUser.email}`);
    allRecipes = await res.json();
    renderRecipes(allRecipes);
  } catch (err) {
    console.error(err);
    alert("Error fetching recipes!");
  }
}

// -------------------- Render Recipes --------------------
function renderRecipes(recipes) {
  const recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = "";

  recipes.forEach((recipe) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";

    col.innerHTML = `
      <div class="card p-3 shadow-sm">
        <h5>${recipe.name}</h5>
        <p><strong>Category:</strong> ${recipe.category}</p>
        <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
        <p><strong>Steps:</strong> ${recipe.steps}</p>
        <button class="btn btn-warning btn-sm me-2" onclick='updateRecipe("${recipe._id}")'>Update</button>
        <button class="btn btn-danger btn-sm" onclick='deleteRecipe("${recipe._id}")'>Delete</button>
      </div>
    `;

    recipeList.appendChild(col);
  });
}

// -------------------- Delete Recipe --------------------
async function deleteRecipe(id) {
  if (!confirm("Are you sure you want to delete this recipe?")) return;

  try {
    const res = await fetch(`${BACKEND_URL}/recipes/${id}`, { method: "DELETE" });
    const data = await res.json();
    alert(data.message);
    fetchRecipes();
  } catch (err) {
    console.error(err);
    alert("Error deleting recipe!");
  }
}

// -------------------- Update Recipe --------------------
async function updateRecipe(id) {
  const recipe = allRecipes.find(r => r._id === id);
  if (!recipe) return;

  const name = prompt("Enter new recipe name:", recipe.name) || recipe.name;
  const ingredients = prompt("Enter ingredients (comma separated):", recipe.ingredients.join(",")) || recipe.ingredients.join(",");
  const steps = prompt("Enter steps:", recipe.steps) || recipe.steps;
  const category = prompt("Enter category (Veg/Non-Veg):", recipe.category) || recipe.category;

  try {
    const res = await fetch(`${BACKEND_URL}/recipes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, ingredients: ingredients.split(","), steps, category })
    });

    const data = await res.json();
    alert(data.message);
    fetchRecipes();
  } catch (err) {
    console.error(err);
    alert("Error updating recipe!");
  }
}

// -------------------- Search Recipes --------------------
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allRecipes.filter(r => r.name.toLowerCase().includes(query));
  renderRecipes(filtered);
});

// -------------------- Event Listeners --------------------
document.getElementById("signupForm")?.addEventListener("submit", signup);
document.getElementById("loginForm")?.addEventListener("submit", login);
document.getElementById("recipeForm")?.addEventListener("submit", addRecipe);
