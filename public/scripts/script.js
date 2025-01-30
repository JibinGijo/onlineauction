// script.js

// Sample data for auctions
const auctions = [
    { id: 1, name: "Vintage Watch", image: "watch.jpg", currentBid: 50, timeLeft: "2h 30m" },
    { id: 2, name: "Antique Vase", image: "vase.jpg", currentBid: 120, timeLeft: "1h 45m" },
    { id: 3, name: "Rare Painting", image: "painting.jpg", currentBid: 300, timeLeft: "5h 10m" },
  ];
  
  // Function to display auction items
  function displayAuctions() {
    const auctionList = document.getElementById("auction-list");
    const allAuctions = document.getElementById("all-auctions");
  
    auctions.forEach(auction => {
      const auctionItem = document.createElement("div");
      auctionItem.className = "auction-item";
  
      auctionItem.innerHTML = `
        <img src="images/${auction.image}" alt="${auction.name}">
        <h3>${auction.name}</h3>
        <p>Current Bid: $${auction.currentBid}</p>
        <p>Time Left: ${auction.timeLeft}</p>
        <button onclick="placeBid(${auction.id})">Place Bid</button>
      `;
  
      auctionList.appendChild(auctionItem.cloneNode(true));
      allAuctions.appendChild(auctionItem);
    });
  }
  
  // Function to handle bidding
  function placeBid(auctionId) {
    const auction = auctions.find(a => a.id === auctionId);
    if (auction) {
      const newBid = prompt(`Enter your bid for ${auction.name} (Current Bid: $${auction.currentBid})`);
      if (newBid && !isNaN(newBid)) {
        auction.currentBid = parseFloat(newBid);
        alert(`Your bid of $${newBid} has been placed!`);
        displayAuctions(); // Refresh the auction list
      } else {
        alert("Invalid bid amount. Please enter a number.");
      }
    }
  }
  
  // Initialize the platform
  displayAuctions();