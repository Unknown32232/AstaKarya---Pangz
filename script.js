document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // 1. DATA & STATE MANAGEMENT
  // ==========================================

  // Data produk
  const products = [
    {
      id: 1,
      name: "Vas Bambu Handmade",
      price: "Rp 185.000",
      priceValue: 185000,
      category: "Dekorasi Rumah",
      image: "img/vas-bambu.jpg",
      description: "Vas elegan dari anyaman bambu dengan desain tradisional.",
      rating: "4.8 (62)",
      artisan: "Sari Handmade",
    },
    {
      id: 2,
      name: "Gelang Tenun Sumba",
      price: "Rp 75.000",
      priceValue: 75000,
      category: "Aksesoris",
      image: "img/gelang-tenun.png",
      description: "Gelang tangan dengan motif tenun khas Sumba, NTT.",
      rating: "4.9 (45)",
      artisan: "Tenun Nusantara",
    },
    {
      id: 3,
      name: "Tas Rajut Bali",
      price: "Rp 250.000",
      priceValue: 250000,
      category: "Fashion",
      image: "img/tas-rajut-bali.jpg",
      description: "Tas cantik dengan teknik rajut tradisional dari Bali.",
      rating: "4.7 (38)",
      artisan: "Bali Craft Collective",
    },
    {
      id: 4,
      name: "Lukisan Batik Kontemporer",
      price: "Rp 1.250.000",
      priceValue: 1250000,
      category: "Karya Seni",
      image: "img/lukisan-batik.jpg",
      description: "Karya seni batik dengan sentuhan modern dan tradisional.",
      rating: "5.0 (15)",
      artisan: "Bali Craft Collective",
    },
  ];

  // State Variables
  let wishlist = [];
  let cart = [];
  let selectedPaymentMethod = null;
  let currentUser = null;

  // Variabel untuk menyimpan instance Chart (PENTING untuk perbaikan bug)
  let salesChartInstance = null;
  let categoryChartInstance = null;

  // DOM Elements
  const loginScreen = document.getElementById("loginScreen");
  const mainApp = document.getElementById("mainApp");
  const loginForm = document.getElementById("loginForm");
  const currentUserSpan = document.getElementById("currentUser");
  const logoutBtn = document.getElementById("logoutBtn");
  const viewSwitcher = document.getElementById("viewSwitcher");
  const backToUserView = document.getElementById("backToUserView");
  const userView = document.getElementById("userView");
  const adminView = document.getElementById("adminView");
  const featuredProducts = document.getElementById("featuredProducts");
  const wishlistContent = document.getElementById("wishlistContent");
  const wishlistCount = document.getElementById("wishlistCount");
  const cartContent = document.getElementById("cartContent");
  const cartCount = document.getElementById("cartCount");
  const checkoutSection = document.getElementById("checkoutSection");
  const orderSummary = document.getElementById("orderSummary");
  const payButton = document.getElementById("payButton");
  const successModal = new bootstrap.Modal(
    document.getElementById("successModal")
  );

  // ==========================================
  // 2. PRODUCT FUNCTIONS
  // ==========================================

  // Initialize products
  function initializeProducts() {
    featuredProducts.innerHTML = "";
    products.forEach((product) => {
      const isInWishlist = wishlist.some((item) => item.id === product.id);
      const productCard = createProductCard(product, isInWishlist);
      featuredProducts.appendChild(productCard);
    });
  }

  // Create product card
  function createProductCard(product, isInWishlist = false) {
    const col = document.createElement("div");
    col.className = "col-md-3 mb-4";

    col.innerHTML = `
            <div class="card">
              <div class="wishlist-btn" data-product-id="${product.id}">
                <i class="bi ${
                  isInWishlist ? "bi-heart-fill text-danger" : "bi-heart"
                }"></i>
              </div>
              <img
                src="${product.image}"
                class="card-img-top product-image"
                alt="${product.name}"
              />
              <div class="card-body">
                <span class="badge category-badge mb-2">${
                  product.category
                }</span>
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold text-primary">${product.price}</span>
                  <div>
                    <i class="bi bi-star-fill text-warning"></i>
                    <small>${product.rating}</small>
                  </div>
                </div>
                <button class="btn btn-primary w-100 mt-3 add-to-cart" data-product-id="${
                  product.id
                }">
                  <i class="bi bi-cart-plus"></i> Tambah ke Keranjang
                </button>
              </div>
            </div>
          `;

    return col;
  }

  // ==========================================
  // 3. WISHLIST & CART LOGIC
  // ==========================================

  // Update wishlist display
  function updateWishlistDisplay() {
    wishlistCount.textContent = wishlist.length;

    if (wishlist.length === 0) {
      wishlistContent.innerHTML = `
              <div class="empty-wishlist">
                <i class="bi bi-heart"></i>
                <h5>Wishlist Kamu Masih Kosong</h5>
                <p>Tambahkan produk favorit kamu ke wishlist dengan menekan tombol hati di produk</p>
              </div>
            `;
    } else {
      let tableHTML = `
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Produk</th>
                      <th>Harga</th>
                      <th>Stok</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
            `;

      wishlist.forEach((product) => {
        tableHTML += `
                <tr>
                  <td>
                    <div class="d-flex align-items-center">
                      <img
                        src="${product.image}"
                        class="me-3"
                        width="60"
                        height="60"
                        style="object-fit: cover"
                      />
                      <div>
                        <div>${product.name}</div>
                        <small class="text-muted">Oleh: ${product.artisan}</small>
                      </div>
                    </div>
                  </td>
                  <td>${product.price}</td>
                  <td>Tersedia</td>
                  <td>
                    <button class="btn btn-sm btn-primary add-to-cart-from-wishlist" data-product-id="${product.id}">
                      Tambah ke Keranjang
                    </button>
                    <button class="btn btn-sm btn-outline-danger remove-wishlist" data-product-id="${product.id}">
                      Hapus
                    </button>
                  </td>
                </tr>
              `;
      });

      tableHTML += `
                  </tbody>
                </table>
              </div>
            `;

      wishlistContent.innerHTML = tableHTML;

      // Event listeners for remove
      document.querySelectorAll(".remove-wishlist").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = parseInt(this.getAttribute("data-product-id"));
          removeFromWishlist(productId);
        });
      });

      // Event listeners for add to cart from wishlist
      document
        .querySelectorAll(".add-to-cart-from-wishlist")
        .forEach((button) => {
          button.addEventListener("click", function () {
            const productId = parseInt(this.getAttribute("data-product-id"));
            const product = products.find((p) => p.id === productId);
            addToCart(product);
          });
        });
    }
  }

  // Update cart display
  function updateCartDisplay() {
    cartCount.textContent = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    if (cart.length === 0) {
      cartContent.innerHTML = `
              <div class="empty-cart">
                <i class="bi bi-cart"></i>
                <h5>Keranjang Belanja Kamu Masih Kosong</h5>
                <p>Tambahkan produk ke keranjang dengan menekan tombol "Tambah ke Keranjang"</p>
              </div>
            `;
      checkoutSection.style.display = "none";
    } else {
      let tableHTML = `
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Produk</th>
                      <th>Harga</th>
                      <th>Jumlah</th>
                      <th>Subtotal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
            `;

      let total = 0;

      cart.forEach((item) => {
        const subtotal = item.priceValue * item.quantity;
        total += subtotal;

        tableHTML += `
                <tr>
                  <td>
                    <div class="d-flex align-items-center">
                      <img
                        src="${item.image}"
                        class="me-3"
                        width="60"
                        height="60"
                        style="object-fit: cover"
                      />
                      <div>
                        <div>${item.name}</div>
                        <small class="text-muted">Oleh: ${item.artisan}</small>
                      </div>
                    </div>
                  </td>
                  <td>${item.price}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-product-id="${
                        item.id
                      }">-</button>
                      <span class="mx-2">${item.quantity}</span>
                      <button class="btn btn-sm btn-outline-secondary increase-quantity" data-product-id="${
                        item.id
                      }">+</button>
                    </div>
                  </td>
                  <td>Rp ${subtotal.toLocaleString("id-ID")}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger remove-cart" data-product-id="${
                      item.id
                    }">
                      Hapus
                    </button>
                  </td>
                </tr>
              `;
      });

      tableHTML += `
                  </tbody>
                </table>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <h5>Total: Rp ${total.toLocaleString("id-ID")}</h5>
                  <button class="btn btn-primary btn-lg" id="checkoutButton">
                    <i class="bi bi-credit-card"></i> Checkout
                  </button>
                </div>
              </div>
            `;

      cartContent.innerHTML = tableHTML;

      // Event listeners
      document.querySelectorAll(".remove-cart").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = parseInt(this.getAttribute("data-product-id"));
          removeFromCart(productId);
        });
      });

      document.querySelectorAll(".increase-quantity").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = parseInt(this.getAttribute("data-product-id"));
          increaseQuantity(productId);
        });
      });

      document.querySelectorAll(".decrease-quantity").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = parseInt(this.getAttribute("data-product-id"));
          decreaseQuantity(productId);
        });
      });

      document
        .getElementById("checkoutButton")
        .addEventListener("click", showCheckout);
    }
  }

  // Update order summary
  function updateOrderSummary() {
    let total = cart.reduce(
      (sum, item) => sum + item.priceValue * item.quantity,
      0
    );
    const shippingCost = 15000;
    const finalTotal = total + shippingCost;

    orderSummary.innerHTML = `
            <div class="mb-3">
              <div class="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>Rp ${total.toLocaleString("id-ID")}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>Biaya Pengiriman:</span>
                <span>Rp ${shippingCost.toLocaleString("id-ID")}</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>Rp ${finalTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>
          `;
  }

  // Helper Functions
  function addToWishlist(product) {
    if (!wishlist.some((item) => item.id === product.id)) {
      wishlist.push(product);
      updateWishlistDisplay();
      updateProductWishlistButtons();
    }
  }

  function removeFromWishlist(productId) {
    wishlist = wishlist.filter((item) => item.id !== productId);
    updateWishlistDisplay();
    updateProductWishlistButtons();
  }

  function addToCart(product) {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCartDisplay();
    showToast("Produk berhasil ditambahkan ke keranjang!", "success");
  }

  function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    updateCartDisplay();
  }

  function increaseQuantity(productId) {
    const item = cart.find((item) => item.id === productId);
    if (item) {
      item.quantity += 1;
      updateCartDisplay();
    }
  }

  function decreaseQuantity(productId) {
    const item = cart.find((item) => item.id === productId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      updateCartDisplay();
    } else if (item && item.quantity === 1) {
      removeFromCart(productId);
    }
  }

  function updateProductWishlistButtons() {
    document.querySelectorAll(".wishlist-btn").forEach((button) => {
      const productId = parseInt(button.getAttribute("data-product-id"));
      const icon = button.querySelector("i");
      const isInWishlist = wishlist.some((item) => item.id === productId);
      icon.className = isInWishlist
        ? "bi bi-heart-fill text-danger"
        : "bi bi-heart";
    });
  }

  // Show checkout
  function showCheckout() {
    checkoutSection.style.display = "block";
    updateOrderSummary();

    document.querySelectorAll(".payment-option").forEach((option) => {
      option.addEventListener("click", function () {
        document.querySelectorAll(".payment-option").forEach((opt) => {
          opt.classList.remove("selected");
        });
        this.classList.add("selected");
        selectedPaymentMethod = this.getAttribute("data-method");
      });
    });

    checkoutSection.scrollIntoView({ behavior: "smooth" });
  }

  // Show toast notification
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.style.zIndex = "1060";
    toast.innerHTML = `
            <div class="d-flex">
              <div class="toast-body">${message}</div>
              <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
          `;
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    toast.addEventListener("hidden.bs.toast", () => {
      document.body.removeChild(toast);
    });
  }

  // ==========================================
  // 4. ADMIN FEATURES (ARTISAN & CATEGORY)
  // ==========================================

  // A. Manajemen Artisan
  function setupArtisanManagement() {
    document
      .querySelectorAll(".btn-outline-primary[disabled]")
      .forEach((btn) => {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          showToast("Fitur edit sedang tidak tersedia", "warning");
        });
      });

    const addArtisanBtn = document.getElementById("addArtisanBtn");
    if (addArtisanBtn) {
      addArtisanBtn.addEventListener("click", function (e) {
        e.preventDefault();
        showToast("Fitur tambah artisan sedang tidak tersedia", "warning");
      });
    }

    document.querySelectorAll(".toggle-artisan").forEach((btn) => {
      // Hapus listener lama dengan clone node (simple trick)
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      newBtn.addEventListener("click", function () {
        const action = this.getAttribute("data-action");
        const row = this.closest("tr");
        const statusBadge = row.querySelector(".badge");
        const artisanName = row.querySelector("td div div").textContent;

        if (action === "deactivate") {
          statusBadge.className = "badge bg-secondary";
          statusBadge.textContent = "Nonaktif";
          this.className = "btn btn-sm btn-outline-success toggle-artisan";
          this.innerHTML = "Aktifkan";
          this.setAttribute("data-action", "activate");
          showToast(`Artisan ${artisanName} berhasil dinonaktifkan`, "success");
        } else {
          statusBadge.className = "badge bg-success";
          statusBadge.textContent = "Aktif";
          this.className = "btn btn-sm btn-outline-danger toggle-artisan";
          this.innerHTML = "Nonaktifkan";
          this.setAttribute("data-action", "deactivate");
          showToast(`Artisan ${artisanName} berhasil diaktifkan`, "success");
        }
      });
    });
  }

  // B. Manajemen Kategori (Fitur Baru)
  function setupCategoryManagement() {
    // Cari elemen table berdasarkan struktur HTML (Header -> Row -> Col-7 -> Table)
    const categoryHeader = document.getElementById("category-management");
    if (!categoryHeader) return;

    // Navigasi ke tabel di kolom sebelah kanan
    const categoryTable = categoryHeader.nextElementSibling.querySelector(
      ".col-md-7 table tbody"
    );

    if (!categoryTable) return;

    // Ambil tombol Nonaktifkan/Aktifkan (tombol merah/hijau)
    const toggleButtons = categoryTable.querySelectorAll(
      ".btn-outline-danger, .btn-outline-success"
    );

    toggleButtons.forEach((btn) => {
      // Clone untuk reset event listener
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      newBtn.addEventListener("click", function () {
        const row = this.closest("tr");
        const statusBadge = row.querySelector(".badge");
        const categoryName = row.cells[0].textContent;

        // Cek teks tombol untuk menentukan aksi
        if (this.textContent.trim() === "Nonaktifkan") {
          // Aksi Nonaktifkan
          statusBadge.className = "badge bg-secondary";
          statusBadge.textContent = "Nonaktif";

          this.className = "btn btn-sm btn-outline-success";
          this.textContent = "Aktifkan";

          showToast(
            `Kategori <b>${categoryName}</b> berhasil dinonaktifkan`,
            "warning"
          );
        } else {
          // Aksi Aktifkan
          statusBadge.className = "badge bg-success";
          statusBadge.textContent = "Aktif";

          this.className = "btn btn-sm btn-outline-danger";
          this.textContent = "Nonaktifkan";

          showToast(`Kategori <b>${categoryName}</b> kembali aktif`, "success");
        }
      });
    });

    // Handle tombol Edit (hanya visual warning)
    const editButtons = categoryTable.querySelectorAll(".btn-outline-primary");
    editButtons.forEach((btn) => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener("click", () => {
        showToast("Fitur edit kategori belum tersedia", "info");
      });
    });
  }

  // ==========================================
  // 5. AUTHENTICATION & NAVIGATION
  // ==========================================

  // Login form handler
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "user" && password === "user") {
      currentUser = { username: "user", role: "user" };
      showMainApp();
    } else if (username === "admin" && password === "admin") {
      currentUser = { username: "admin", role: "admin" };
      showMainApp();
    } else {
      alert("Username atau password salah! Coba: user/user atau admin/admin");
    }
  });

  // Logout handler
  logoutBtn.addEventListener("click", function () {
    currentUser = null;
    wishlist = [];
    cart = [];
    showLoginScreen();
  });

  // Pay button handler
  payButton.addEventListener("click", function () {
    if (!selectedPaymentMethod) {
      showToast("Pilih metode pembayaran terlebih dahulu!", "warning");
      return;
    }
    showToast("Memproses pembayaran...", "info");
    setTimeout(() => {
      successModal.show();
      cart = [];
      updateCartDisplay();
      checkoutSection.style.display = "none";
      selectedPaymentMethod = null;
    }, 2000);
  });

  function showMainApp() {
    loginScreen.style.display = "none";
    mainApp.style.display = "block";
    currentUserSpan.textContent = currentUser.username;

    initializeProducts();
    updateWishlistDisplay();
    updateCartDisplay();

    if (currentUser.role === "user") {
      userView.style.display = "block";
      adminView.style.display = "none";
      viewSwitcher.style.display = "none";
    } else {
      userView.style.display = "block";
      adminView.style.display = "none";
      viewSwitcher.style.display = "block";
      viewSwitcher.innerHTML =
        '<i class="bi bi-person-gear"></i> Switch to Admin View';
      viewSwitcher.classList.remove("btn-info");
      viewSwitcher.classList.add("btn-secondary");
    }

    // Bind events for main app elements
    document.querySelectorAll(".wishlist-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-product-id"));
        const product = products.find((p) => p.id === productId);
        const isInWishlist = wishlist.some((item) => item.id === productId);

        if (isInWishlist) {
          removeFromWishlist(productId);
          showToast("Produk dihapus dari wishlist", "info");
        } else {
          addToWishlist(product);
          showToast("Produk ditambahkan ke wishlist", "success");
        }
      });
    });

    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-product-id"));
        const product = products.find((p) => p.id === productId);
        addToCart(product);
      });
    });
  }

  function showLoginScreen() {
    mainApp.style.display = "none";
    loginScreen.style.display = "flex";
    loginForm.reset();
  }

  // View switcher
  viewSwitcher.addEventListener("click", function () {
    if (userView.style.display === "none") {
      // Kembali ke User View
      userView.style.display = "block";
      adminView.style.display = "none";
      viewSwitcher.innerHTML =
        '<i class="bi bi-person-gear"></i> Switch to Admin View';
      viewSwitcher.classList.remove("btn-info");
      viewSwitcher.classList.add("btn-secondary");
    } else {
      // Masuk ke Admin View
      userView.style.display = "none";
      adminView.style.display = "block";
      viewSwitcher.innerHTML = '<i class="bi bi-shop"></i> Switch to User View';
      viewSwitcher.classList.remove("btn-secondary");
      viewSwitcher.classList.add("btn-info");

      // Inisialisasi fitur Admin
      initCharts(); // Chart sudah aman (tidak menumpuk)
      setupArtisanManagement();
      setupCategoryManagement(); // Fitur baru dipanggil di sini
    }
  });

  backToUserView.addEventListener("click", function (e) {
    e.preventDefault();
    userView.style.display = "block";
    adminView.style.display = "none";
    viewSwitcher.innerHTML =
      '<i class="bi bi-person-gear"></i> Switch to Admin View';
    viewSwitcher.classList.remove("btn-info");
    viewSwitcher.classList.add("btn-secondary");
  });

  // ==========================================
  // 6. CHART INITIALIZATION (FIXED)
  // ==========================================
  function initCharts() {
    // FIX: Hancurkan instance chart sebelumnya jika ada
    if (salesChartInstance) {
      salesChartInstance.destroy();
    }
    if (categoryChartInstance) {
      categoryChartInstance.destroy();
    }

    // Sales Chart
    const salesCtx = document.getElementById("salesChart").getContext("2d");
    salesChartInstance = new Chart(salesCtx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Agu",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ],
        datasets: [
          {
            label: "Pendapatan (dalam Juta)",
            data: [8, 9.5, 7, 10, 9, 11, 8.5, 10.5, 11, 12.5, 0, 0],
            borderColor: "#4e6c50",
            backgroundColor: "rgba(78, 108, 80, 0.1)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: "Pendapatan Bulanan 2023" },
        },
        scales: { y: { beginAtZero: true } },
      },
    });

    // Category Chart
    const categoryCtx = document
      .getElementById("categoryChart")
      .getContext("2d");
    categoryChartInstance = new Chart(categoryCtx, {
      type: "doughnut",
      data: {
        labels: ["Dekorasi Rumah", "Aksesoris", "Fashion", "Karya Seni"],
        datasets: [
          {
            data: [35, 25, 30, 10],
            backgroundColor: ["#4e6c50", "#aa8b56", "#f0ebce", "#395144"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } },
      },
    });
  }
});
