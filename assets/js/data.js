// assets/js/data.js

const DATA_KEY = "astakarya_data";
const SESSION_KEY = "astakarya_session";

// 1. DATA DEFAULT
const defaultData = {
  products: [
    {
      id: 1,
      name: "Vas Bambu Handmade",
      price: "Rp 185.000",
      priceValue: 185000,
      category: "Dekorasi Rumah",
      // PATH BARU: Mundur -> Masuk Assets -> Masuk Img
      image: "../assets/img/vas-bambu.jpg",
      description: "Vas elegan dari anyaman bambu dengan desain tradisional.",
      rating: "4.8 (62)",
      artisan: "Sari Handmade",
      status: "active",
    },
    {
      id: 2,
      name: "Gelang Tenun Sumba",
      price: "Rp 75.000",
      priceValue: 75000,
      category: "Aksesoris",
      image: "../assets/img/gelang-tenun.png",
      description: "Gelang tangan dengan motif tenun khas Sumba, NTT.",
      rating: "4.9 (45)",
      artisan: "Tenun Nusantara",
      status: "active",
    },
    {
      id: 3,
      name: "Tas Rajut Bali",
      price: "Rp 250.000",
      priceValue: 250000,
      category: "Fashion",
      image: "../assets/img/tas-rajut-bali.jpg",
      description: "Tas cantik dengan teknik rajut tradisional dari Bali.",
      rating: "4.7 (38)",
      artisan: "Bali Craft Collective",
      status: "active",
    },
    {
      id: 4,
      name: "Lukisan Batik Kontemporer",
      price: "Rp 1.250.000",
      priceValue: 1250000,
      category: "Karya Seni",
      image: "../assets/img/lukisan-batik.jpg",
      description: "Karya seni batik dengan sentuhan modern dan tradisional.",
      rating: "5.0 (15)",
      artisan: "Bali Craft Collective",
      status: "active",
    },
  ],
  categories: [
    { name: "Dekorasi Rumah", count: 24, status: "active" },
    { name: "Aksesoris", count: 18, status: "active" },
    { name: "Fashion", count: 32, status: "active" },
    { name: "Karya Seni", count: 13, status: "active" },
  ],
  users: [
    {
      username: "user",
      password: "user",
      role: "user",
      name: "Fawwaz Al Ghifari",
    },
    {
      username: "admin",
      password: "admin",
      role: "admin",
      name: "Administrator",
    },
  ],
  cart: [],
  wishlist: [],
};

// 2. FUNGSI INISIALISASI
function initApp() {
  if (!localStorage.getItem(DATA_KEY)) {
    localStorage.setItem(DATA_KEY, JSON.stringify(defaultData));
    console.log("Database initialized");
  }
}

// 3. HELPER FUNCTIONS
function getData() {
  return JSON.parse(localStorage.getItem(DATA_KEY));
}

function saveData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

// 4. AUTHENTICATION
function login(username, password) {
  const data = getData();
  const user = data.users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const session = {
      username: user.username,
      role: user.role,
      name: user.name,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }
  return null;
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "../index.html";
}

function checkSession() {
  const session = JSON.parse(localStorage.getItem(SESSION_KEY));
  if (!session) {
    // Jika tidak ada session dan kita BUKAN di halaman index.html, lempar keluar
    if (!window.location.href.includes("index.html")) {
      window.location.href = "../index.html";
    }
  }
  return session;
}

initApp();
