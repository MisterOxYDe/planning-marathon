const planning = {
  "2025-12-15": {
    morning: "Marche travail",
    evening: "Vélo 30’ très doux"
  },
  "2025-12-16": {
    morning: "Course EF 50’",
    evening: "Vélo 1h15 + Haut du corps"
  }
};

const today = new Date().toISOString().slice(0,10);
document.getElementById("date").innerText = today;

if (planning[today]) {
  document.getElementById("morningText").innerText = planning[today].morning;
  document.getElementById("eveningText").innerText = planning[today].evening;
} else {
  document.getElementById("morningText").innerText = "Repos";
  document.getElementById("eveningText").innerText = "Repos";
}

// sauvegarde des checks
document.getElementById("morning").checked =
  localStorage.getItem(today + "-morning") === "true";

document.getElementById("evening").checked =
  localStorage.getItem(today + "-evening") === "true";

document.getElementById("morning").addEventListener("change", e =>
  localStorage.setItem(today + "-morning", e.target.checked)
);

document.getElementById("evening").addEventListener("change", e =>
  localStorage.setItem(today + "-evening", e.target.checked)
);
