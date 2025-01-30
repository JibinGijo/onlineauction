import { fetchAuctions, placeBid } from "./api.js";

async function displayAuctions() {
  const auctionList = document.getElementById("auction-list");
  const auctions = await fetchAuctions();

  auctionList.innerHTML = "";

  auctions.forEach((auction) => {
    const auctionItem = document.createElement("div");
    auctionItem.className = "auction-item";

    auctionItem.innerHTML = `
      <img src="${auction.image}" alt="${auction.name}">
      <h3>${auction.name}</h3>
      <p>Current Bid: $${auction.current_bid}</p>
      <p>Time Left: ${auction.time_left}</p>
      <button onclick="placeBid('${auction.id}')">Place Bid</button>
    `;

    auctionList.appendChild(auctionItem);
  });
}

window.placeBid = async function (auctionId) {
  const newBid = prompt("Enter your bid amount:");
  if (newBid && !isNaN(newBid)) {
    await placeBid(auctionId, parseFloat(newBid));
    displayAuctions(); // Refresh the auction list
  } else {
    alert("Invalid bid amount. Please enter a number.");
  }
};

// Initialize the platform
displayAuctions();