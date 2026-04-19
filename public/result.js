const searchInput = document.getElementById("cuisine-search");
const resultsDiv = document.getElementById("cuisine-results");
const countEl = document.getElementById("count");

searchInput.addEventListener("input", async function () {
  const query = this.value.trim();
  const cuisine = this.dataset.cuisine;

  try {
    const res = await fetch(
      `/api/search?cuisine=${encodeURIComponent(cuisine)}&query=${encodeURIComponent(query)}`,
    );
    const data = await res.json();
    const recipes = data.results;

    if (countEl) countEl.textContent = recipes.length;

    if (recipes.length === 0) {
      resultsDiv.innerHTML = `
        <div class="col-12 text-center py-5 text-secondary">
          <i class="fa-solid fa-bowl-food fa-3x mb-3 d-block" style="color:#f0ddd0"></i>
          <p class="mb-0">No recipes found. Try a different search.</p>
        </div>
      `;
      return;
    }

    let html = "";
    recipes.forEach((r) => {
      html += `
        <div class="col-6 col-md-4 col-lg-3">
          <a class="recipe-tile text-decoration-none d-block h-100" href="/recipe/${r.id}">
            <img src="${r.image}" alt="${r.title}" loading="lazy" />
            <div class="p-3">
              <p class="recipe-tile-title mb-1">${r.title}</p>
              <small class="text-secondary">
                <i class="fa-regular fa-clock me-1"></i>${r.readyInMinutes || 30} min
              </small>
            </div>
          </a>
        </div>
      `;
    });

    resultsDiv.innerHTML = html;
  } catch (err) {
    console.log("Search error:", err);
  }
});
