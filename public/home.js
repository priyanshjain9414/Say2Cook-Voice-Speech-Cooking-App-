const searchInput = document.getElementById("home-search");
const resultsDiv = document.getElementById("home-results");

const cuisines = window.cuisines || [];
const emoji = window.emoji || {};

function showCuisines() {
  resultsDiv.className = "row g-3";
  let html = "";

  cuisines.forEach((c) => {
    html += `
      <div class="col-6 col-sm-4 col-md-3 col-lg-2">
        <a class="cuisine-tile d-flex flex-column align-items-center justify-content-center text-center gap-2 p-3 h-100" href="/cuisine/${c}">
          <span class="cuisine-emoji">${emoji[c] || "🍽️"}</span>
          <strong class="small">${c}</strong>
        </a>
      </div>
    `;
  });

  resultsDiv.innerHTML = html;
}

function showResults(recipes) {
  resultsDiv.className = "row g-3";

  if (recipes.length === 0) {
    resultsDiv.innerHTML = `<div class="col-12"><p class="text-secondary">No recipes found. Try another search.</p></div>`;
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
}

searchInput.addEventListener("input", async function () {
  const query = this.value.trim();

  if (!query) {
    showCuisines();
    return;
  }

  try {
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    showResults(data.results);
  } catch (err) {
    console.log("Search failed:", err);
    resultsDiv.innerHTML = `<div class="col-12"><p class="text-danger">Something went wrong. Try again.</p></div>`;
  }
});
