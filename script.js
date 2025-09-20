// -------------------- Render Recipes (Inline Edit) --------------------
function renderRecipes(recipes) {
  const recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = "";

  recipes.forEach((recipe) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";

    col.innerHTML = `
      <div class="card p-3 shadow-sm recipe-card">
        <input type="text" id="name-${recipe._id}" class="form-control mb-1" value="${recipe.name}">
        <input type="text" id="ingredients-${recipe._id}" class="form-control mb-1" value="${recipe.ingredients.join(', ')}">
        <textarea id="steps-${recipe._id}" class="form-control mb-1">${recipe.steps}</textarea>
        <select id="category-${recipe._id}" class="form-select mb-2">
          <option value="Veg" ${recipe.category === 'Veg' ? 'selected' : ''}>Veg</option>
          <option value="Non-Veg" ${recipe.category === 'Non-Veg' ? 'selected' : ''}>Non-Veg</option>
        </select>
        <button class="btn btn-success btn-sm me-2" onclick="updateRecipe('${recipe._id}')">Save</button>
        <button class="btn btn-danger btn-sm" onclick="deleteRecipe('${recipe._id}')">Delete</button>
      </div>
    `;

    recipeList.appendChild(col);
  });
}

// -------------------- Update Recipe (Inline) --------------------
async function updateRecipe(id) {
  const name = document.getElementById(`name-${id}`).value.trim();
  const ingredients = document.getElementById(`ingredients-${id}`).value.split(",").map(i => i.trim());
  const steps = document.getElementById(`steps-${id}`).value.trim();
  const category = document.getElementById(`category-${id}`).value;

  if (!name || !ingredients.length || !steps || !category) {
    alert("Please fill all recipe fields!");
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/recipes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, ingredients, steps, category })
    });

    const data = await res.json();
    alert(data.message);
    fetchRecipes();
  } catch (err) {
    console.error(err);
    alert("Error updating recipe!");
  }
}
