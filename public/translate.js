async function translateRecipe() {
  const lang = document.getElementById("langSelect").value;

  const ingredientEls = document.querySelectorAll(".ingredients li");
  const ingredients = Array.from(ingredientEls).map((el) => el.textContent);

  const stepEls = document.querySelectorAll(".steps li");
  const steps = Array.from(stepEls).map((el) => el.textContent);

  const allTexts = [...ingredients, ...steps];
  if (allTexts.length === 0) return;

  try {
    const res = await fetch("/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: allTexts, to: lang }),
    });

    const data = await res.json();
    if (!data.translated) return;

    data.translated.forEach((translatedText, i) => {
      if (i < ingredients.length) {
        ingredientEls[i].textContent = translatedText;
      } else {
        stepEls[i - ingredients.length].textContent = translatedText;
      }
    });

    window.steps = Array.from(document.querySelectorAll("#stepsList li")).map(
      (li) => li.innerText,
    );
  } catch (err) {
    console.log("Translation failed:", err);
  }
}

document
  .getElementById("translateBtn")
  .addEventListener("click", translateRecipe);
