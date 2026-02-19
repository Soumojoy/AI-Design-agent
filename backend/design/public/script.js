async function generateDesign() {

  const prompt = document.getElementById("prompt").value;

  const response = await fetch("/api/design", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });


  const data = await response.json();

  window.latestDesign = data;  // IMPORTANT

  displayDesign(data);

}

function displayDesign(design) {

  const output = document.getElementById("output");
  output.innerHTML = "";

  const title = document.createElement("h2");
  title.innerText = design.appName;
  output.appendChild(title);

  design.screens.forEach(screen => {

    const card = document.createElement("div");
    card.className = "card";

    const screenTitle = document.createElement("h3");
    screenTitle.innerText = screen.name;
    card.appendChild(screenTitle);

    const list = document.createElement("ul");

    screen.components.forEach(comp => {
      const li = document.createElement("li");
      li.innerText = comp;
      list.appendChild(li);
    });

    card.appendChild(list);
    output.appendChild(card);
  });
}
async function generateCode(design) {
  await fetch("/api/generate-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ design })
  });

  alert("Code generated in generated-apps folder 🚀");
}