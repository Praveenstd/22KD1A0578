// localStorage lo data save chestam
let urls = JSON.parse(localStorage.getItem("urls")) || [];

function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

function shortenURL(event) {
  event.preventDefault();
  const longUrl = document.getElementById("longUrl").value;
  const validity = document.getElementById("validity").value || 30; // default 30 min
  const customCode = document.getElementById("customCode").value;

  let shortCode = customCode || generateShortCode();

  // check uniqueness
  if (urls.find(u => u.code === shortCode)) {
    alert("Shortcode already exists! Try different one.");
    return;
  }

  const now = new Date();
  const expiry = new Date(now.getTime() + validity * 60000);

  const urlObj = {
    longUrl,
    code: shortCode,
    createdAt: now.toISOString(),
    expiry: expiry.toISOString(),
    clicks: 0
  };

  urls.push(urlObj);
  localStorage.setItem("urls", JSON.stringify(urls));

  document.getElementById("result").innerHTML =
    `Short URL: <a href="#" onclick="redirect('${shortCode}')">http://short.ly/${shortCode}</a>`;
}

function redirect(code) {
  const obj = urls.find(u => u.code === code);
  if (!obj) return alert("URL not found!");
  
  const now = new Date();
  if (now > new Date(obj.expiry)) {
    return alert("Link expired!");
  }

  obj.clicks++;
  localStorage.setItem("urls", JSON.stringify(urls));
  window.open(obj.longUrl, "_blank");
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(page).style.display = "block";
  if (page === "stats") showStats();
}

function showStats() {
  const list = document.getElementById("statsList");
  list.innerHTML = "";
  urls.forEach(u => {
    const li = document.createElement("li");
    li.textContent = `${u.code} → ${u.longUrl} | Clicks: ${u.clicks} | Expiry: ${u.expiry}`;
    list.appendChild(li);
  });
}
