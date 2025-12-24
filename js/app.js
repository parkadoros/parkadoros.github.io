let parkingData = [];

fetch("data/parking.json")
  .then(res => res.json())
  .then(data => {
    parkingData = data;
    renderList();
  });

document.getElementById("hours").addEventListener("input", renderList);

function calculatePrice(pricing, hours) {
  let total = 0;

  for (let i = 0; i < hours; i++) {
    if (i < pricing.hourly.length) {
      total += pricing.hourly[i];
    } else {
      total += pricing.flatRate;
    }
  }

  return total.toFixed(2);
}

function renderList() {
  const hours = Number(document.getElementById("hours").value);
  const list = document.getElementById("parking-list");
  list.innerHTML = "";

  parkingData.forEach(spot => {
    const price = calculatePrice(spot.pricing, hours);

    const div = document.createElement("div");
    div.className = "spot";
    div.innerHTML = `
      <h3>${spot.name}</h3>
      <p>${spot.address}</p>
      <p><strong>Τιμή:</strong> €${price}</p>
    `;
    list.appendChild(div);
  });
}

