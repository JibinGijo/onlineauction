document.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = await checkLogin();
  if (isLoggedIn) {
    document.getElementById("profile-section").style.display = "block";
    document.getElementById("past-sales-section").style.display = "block";
    document.getElementById("bought-items-section").style.display = "block";
    fetchPastSales();
    fetchBoughtItems();
  } else {
    alert("Please log in to view your profile.");
    window.location.href = "login.html";
  }

  const updateProfileForm = document.getElementById("update-profile-form");
  updateProfileForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newEmail = document.getElementById("new-email").value;
    const username = document.getElementById("username").value;
    const mobile = document.getElementById("mobile").value;

    try {
      if (newEmail) {
        await updateEmail(newEmail);
      }
      if (username) {
        await updateUsername(username);
      }
      if (mobile) {
        await updateMobile(mobile);
      }
      alert("Profile updated successfully");
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
  });
});

async function checkLogin() {
  const response = await fetch("/auth/check-login");
  return response.ok;
}

async function updateEmail(newEmail) {
  const response = await fetch("/user/update-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newEmail }),
  });
  if (!response.ok) {
    throw new Error("Failed to update email");
  }
}

async function updateUsername(username) {
  const response = await fetch("/user/update-username", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  if (!response.ok) {
    throw new Error("Failed to update username");
  }
}

async function updateMobile(mobile) {
  const response = await fetch("/user/update-mobile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mobile }),
  });
  if (!response.ok) {
    throw new Error("Failed to update mobile");
  }
}

async function fetchPastSales() {
  const response = await fetch("/user/past-sales");
  const sales = await response.json();
  const pastSalesDiv = document.getElementById("past-sales");
  sales.forEach(sale => {
    const saleItem = document.createElement("div");
    saleItem.innerHTML = `<p>${sale.title} - $${sale.final_price}</p>`;
    pastSalesDiv.appendChild(saleItem);
  });
}

async function fetchBoughtItems() {
  const response = await fetch("/user/bought-items");
  const items = await response.json();
  const boughtItemsDiv = document.getElementById("bought-items");
  items.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.innerHTML = `<p>${item.auctions.title} - $${item.bid_amount}</p>`;
    boughtItemsDiv.appendChild(itemDiv);
  });
}
