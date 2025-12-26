let parkingData = [];
let markers = []

fetch("data/parking.json")
  .then(res => res.json())
  .then(data => {
    parkingData = data;
    renderList();
  });


//Button for changing colours
const toggleInput = document.getElementById("theme-toggle");
toggleInput.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});


//Map functionality
const map = L.map("map").setView([40.6401, 22.9444], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);


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

  // Remove old markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  parkingData.forEach(spot => {
  const price = calculatePrice(spot.pricing, hours);

  // create card
  const div = document.createElement("div");
  div.className = "spot";
  div.innerHTML = `
    <div class="info">
      <h3>${spot.name}</h3>
      <p class="address"><a href="https://www.google.com/maps?q=${spot.lat},${spot.lng}" target="_blank">${spot.address}</a></p>
    </div>
    <div class="price">€${price}</div>
  `;
  list.appendChild(div);

  // add marker
  const priceIcon = L.divIcon({
    className: "price-marker",
    html: `€${price}`,
    iconSize: [40, 24],
    iconAnchor: [27, 35]
  });

  const marker = L.marker([spot.lat, spot.lng], { icon: priceIcon })
    .addTo(map)
    .bindPopup(`<b>${spot.name}</b><br>
                <a href="https://www.google.com/maps?q=${spot.lat},${spot.lng}" target="_blank">
                ${spot.address}
                </a><br>
                Τιμή: €${price}`,
  );

  marker.on("popupopen", () => {
    document.querySelectorAll(".price-marker").forEach(el => {
      el.style.opacity = "0.4";
    });
    marker.getElement().style.display = "none";
  });

  marker.on("popupclose", () => {
    document.querySelectorAll(".price-marker").forEach(el => {
      el.style.opacity = "1";
    });
    marker.getElement().style.display = "";
  });

  markers.push(marker);
  });
}
