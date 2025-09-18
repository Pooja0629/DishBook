const BACKEND_URL = "https://dishbook-backend-production.up.railway.app";

let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (loggedInUser) {
  fetchRecipes();
} else if (window.location.pathname.includes("index.html")) {
  alert("Please login first!");
  window.location.href = "login.html";
}

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

async function fetchRecipes() {
  if (!loggedInUser) return;

  try {
    const res = await fetch(`${BACKEND_URL}/recipes/${loggedInUser.email}`);
    const recipes = await res.json();

    const recipeList = document.getElementById("recipeList");
    recipeList.innerHTML = "";

    recipes.forEach((recipe) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${recipe.name}</strong> (${recipe.category})<br>
        Ingredients: ${recipe.ingredients.join(", ")}<br>
        Steps: ${recipe.steps}<br>
      `;
      recipeList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert("Error fetching recipes!");
  }
}

document.getElementById("signupForm").addEventListener("submit", signup);
document.getElementById("loginForm").addEventListener("submit", login);
document.getElementById("recipeForm").addEventListener("submit", addRecipe);
