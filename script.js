const apiUrl = "https://dishbook-backend.up.railway.app/recipes";
const recipeForm = document.getElementById("recipeForm");
const recipesList = document.getElementById("recipesList");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

recipeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const ingredients = document.getElementById("ingredients").value.split(",").map(i => i.trim());
  const steps = document.getElementById("steps").value.trim();
  const category = document.getElementById("category").value;

  if (!name || !ingredients[0] || !steps || !category) return alert("Please fill in all fields!");

  const recipe = { name, ingredients, steps, category };
  try {
    const recipeId = recipeForm.dataset.id;
    if (recipeId) {
      await fetch(`${apiUrl}/${recipeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe)
      });
      delete recipeForm.dataset.id;
    } else {
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe)
      });
    }
    recipeForm.reset();
    fetchRecipes();
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong. Check console.");
  }
});

async function fetchRecipes() {
  try {
    const res = await fetch(apiUrl);
    const recipes = await res.json();
    recipesList.innerHTML = "";
    recipes.forEach(r => {
      const div = document.createElement("div");
      div.className = "col-md-4"; 
      div.id = `recipe-${r._id}`;
      div.innerHTML = `
        <div class="recipe-card card p-3 h-100">
          <h5 class="card-title">${r.name}</h5>
          <p><strong>Category:</strong> ${r.category}</p>
          <p><strong>Ingredients:</strong> ${r.ingredients.join(", ")}</p>
          <p><strong>Steps:</strong> ${r.steps.substring(0, 50)}...</p>
          <div class="d-flex">
            <button class="btn btn-sm btn-outline-secondary me-2" onclick="editRecipe('${r._id}')">Update</button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteRecipe('${r._id}')">Delete</button>
          </div>
        </div>
      `;
      recipesList.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching recipes:", err);
    recipesList.innerHTML = "<p class='text-danger'>Unable to load recipes.</p>";
  }
}


async function deleteRecipe(id) {
  if (!confirm("Are you sure you want to delete this recipe?")) return;
  try {
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    fetchRecipes();
  } catch (err) {
    console.error("Error deleting recipe:", err);
    alert("Failed to delete recipe.");
  }
}


async function editRecipe(id) {
  try {
    const res = await fetch(`${apiUrl}/${id}`);
    const r = await res.json();
    document.getElementById("name").value = r.name;
    document.getElementById("ingredients").value = r.ingredients.join(", ");
    document.getElementById("steps").value = r.steps;
    document.getElementById("category").value = r.category;
    recipeForm.dataset.id = id;
  } catch (err) {
    console.error("Error editing recipe:", err);
    alert("Failed to fetch recipe for editing.");
  }
}

searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = "";
  if (!query) return;

  try {
    const res = await fetch(apiUrl);
    const recipes = await res.json();

    recipes.filter(r => r.name.toLowerCase().includes(query))
      .forEach(r => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "list-group-item list-group-item-action";
        item.textContent = r.name;

        item.addEventListener("click", () => {
          searchInput.value = "";
          searchResults.innerHTML = "";

          const card = document.getElementById(`recipe-${r._id}`);
          if (card) {
            card.scrollIntoView({ behavior: "smooth", block: "start" });
            card.classList.add("highlight");
            setTimeout(() => card.classList.remove("highlight"), 2000);
          }
        });

        searchResults.appendChild(item);
      });
  } catch (err) {
    console.error("Error fetching recipes:", err);
  }
});

document.addEventListener("click", e => {
  if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
    searchResults.innerHTML = "";
  }
});


fetchRecipes();

