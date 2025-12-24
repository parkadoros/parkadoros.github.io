fetch("data/parking.json")
  .then(res => res.json())
  .then(spots => {
    const list = document.getElementById("parking-list");

    spots.forEach(spot => {
      const div = document.createElement("div");
      div.className = "spot";

      div.innerHTML = `
        <h3>${spot.name}</h3>
        <div class="address">${spot.address}</div>
        <div class="price">${spot.price}</div>
        <div class="notes">${spot.notes}</div>
      `;

      list.appendChild(div);
    });
  });
