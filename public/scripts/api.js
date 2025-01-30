const API_URL = "http://localhost:3000";

export async function fetchAuctions() {
  const response = await fetch(`${API_URL}/auctions`);
  return await response.json();
}

export async function placeBid(auctionId, bidAmount) {
  const response = await fetch(`${API_URL}/auctions/${auctionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ current_bid: bidAmount }),
  });
  return await response.json();
}