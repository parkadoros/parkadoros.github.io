let parkingData = [];
let markers = []

fetch("data/parking.json")
  .then(res => res.json())
  .then(data => {
    parkingData = data;
    renderList();
  });


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
    const gmapsLink = `https://www.google.com/maps?q=${spot.lat},${spot.lng}`;

    // Add list item
    const div = document.createElement("div");
    div.className = "spot";
    div.innerHTML = `<h3>${spot.name}</h3>
                     <a href="${gmapsLink}" target="_blank">${spot.address}</a><br>
                     <p><strong>Τιμή:</strong> €${price}</p>`;
    list.appendChild(div);

    // Add new marker
    const marker = L.marker([spot.lat, spot.lng])
      .addTo(map)
      .bindPopup(`
        <b>${spot.name}</b><br>
        <a href="${gmapsLink}" target="_blank">${spot.address}</a><br>
        Τιμή: €${price}
      `)
    markers.push(marker);
  });
}
