import { checkAdmin } from './auth.js';

document.addEventListener("DOMContentLoaded", async () => {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    alert("Access denied. Admins only.");
    window.location.href = "index.html";
  }
});
