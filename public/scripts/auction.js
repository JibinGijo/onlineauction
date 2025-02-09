import { fetchAuctions, placeBid } from "./api.js";
import io from './utils/io';

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

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    
    // Handle real-time bid updates
    socket.on('bidUpdate', (data) => {
        const { auctionId, bidAmount, bidderId } = data;
        
        // Update UI with new bid information
        const currentPriceElement = document.getElementById(`price-${auctionId}`);
        if (currentPriceElement) {
            currentPriceElement.textContent = `$${bidAmount}`;
        }
        
        // Show notification
        showNotification(`New bid: $${bidAmount}`);
    });
    
    // Handle bid form submission
    const bidForm = document.getElementById('bidForm');
    if (bidForm) {
        bidForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const bidAmount = document.getElementById('bidAmount').value;
            const auctionId = bidForm.dataset.auctionId;
            
            try {
                const response = await fetch('/api/auctions/bid', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ auctionId, bidAmount })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification('Bid placed successfully!');
                } else {
                    showNotification(data.message || 'Error placing bid', 'error');
                }
            } catch (error) {
                console.error('Error placing bid:', error);
                showNotification('Error placing bid', 'error');
            }
        });
    }
});

function showNotification(message, type = 'success') {
    // Implement notification UI
}