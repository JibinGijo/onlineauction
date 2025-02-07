document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const identifier = document.getElementById("identifier").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier, password }),
  });

  const result = await response.json();
  if (result.success) {
    window.location.href = "dashboard.html";
  } else {
    alert(result.message);
  }
});
