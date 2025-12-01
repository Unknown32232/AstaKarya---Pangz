// File: assets/js/user.js (VERSI LENGKAP DENGAN WISHLIST)

document.addEventListener("DOMContentLoaded", function () {
  // 1. Cek Security
  const session = checkSession();
  if (!session || session.role !== "user") {
    window.location.href = "../index.html";
    return;
  }

  // Tampilkan Nama User
  const userSpan = document.getElementById("currentUser");
  if (userSpan) userSpan.textContent = session.name;

  // 2. Load Data
  const data = getData();
  updateCartCount();
  updateWishlistCount();

  // 3. Routing Logika (Otomatis deteksi halaman)

  // A. Jika di Home
  if (document.getElementById("featuredProducts")) {
    renderProducts(data.products, data.wishlist);
  }
  // B. Jika di Cart
  else if (document.getElementById("cartTableBody")) {
    renderCart(data.cart);
    setupCheckoutListeners();
  }
  // C. Jika di Wishlist (BARU)
  else if (document.getElementById("wishlistTableBody")) {
    renderWishlist(data.wishlist);
  }

  // Listener Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", () => logout());
});

// =========================================
// LOGIKA HOME
// =========================================
function renderProducts(products, wishlist) {
  const container = document.getElementById("featuredProducts");
  if (!container) return;
  container.innerHTML = "";

  products.forEach((product) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id);
    const col = document.createElement("div");
    col.className = "col-md-3 mb-4";
    col.innerHTML = `
      <div class="card h-100 product-card-hover">
        <div class="wishlist-btn" onclick="toggleWishlist(${product.id})">
          <i class="bi ${
            isInWishlist ? "bi-heart-fill text-danger" : "bi-heart"
          }"></i>
        </div>
        <img src="${product.image}" class="card-img-top product-image" alt="${
      product.name
    }">
        <div class="card-body d-flex flex-column">
          <span class="badge category-badge mb-2 align-self-start">${
            product.category
          }</span>
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text text-muted small">${product.description}</p>
          <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="fw-bold text-primary">${product.price}</span>
                <small><i class="bi bi-star-fill text-warning"></i> ${
                  product.rating
                }</small>
              </div>
              <button class="btn btn-primary w-100" onclick="addToCart(${
                product.id
              })">
                <i class="bi bi-cart-plus"></i> Tambah
              </button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// =========================================
// LOGIKA CART
// =========================================
function renderCart(cart) {
  const tableBody = document.getElementById("cartTableBody");
  const emptyMessage = document.getElementById("emptyCartMessage");
  const checkoutSection = document.getElementById("checkoutSection");
  if (!tableBody) return;

  tableBody.innerHTML = "";
  if (cart.length === 0) {
    emptyMessage.style.display = "block";
    checkoutSection.style.display = "none";
    document.querySelector(
      ".table-responsive"
    ).parentElement.parentElement.style.display = "none";
  } else {
    emptyMessage.style.display = "none";
    checkoutSection.style.display = "block";
    document.querySelector(
      ".table-responsive"
    ).parentElement.parentElement.style.display = "block";

    let grandTotal = 0;
    cart.forEach((item) => {
      const subtotal = item.priceValue * item.quantity;
      grandTotal += subtotal;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <div class="d-flex align-items-center">
            <img src="${
              item.image
            }" class="rounded me-3" width="60" height="60" style="object-fit: cover">
            <div><div class="fw-bold">${
              item.name
            }</div><small class="text-muted">${item.artisan}</small></div>
          </div>
        </td>
        <td class="align-middle">${item.price}</td>
        <td class="align-middle">
          <div class="input-group input-group-sm" style="width: 100px;">
            <button class="btn btn-outline-secondary" onclick="updateQty(${
              item.id
            }, -1)">-</button>
            <input type="text" class="form-control text-center" value="${
              item.quantity
            }" readonly>
            <button class="btn btn-outline-secondary" onclick="updateQty(${
              item.id
            }, 1)">+</button>
          </div>
        </td>
        <td class="align-middle fw-bold">Rp ${subtotal.toLocaleString(
          "id-ID"
        )}</td>
        <td class="align-middle">
          <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${
            item.id
          })"><i class="bi bi-trash"></i></button>
        </td>
      `;
      tableBody.appendChild(row);
    });
    updateSummary(grandTotal);
  }
}

function updateSummary(subtotal) {
  const shipping = 15000;
  document.getElementById(
    "subtotalDisplay"
  ).textContent = `Rp ${subtotal.toLocaleString("id-ID")}`;
  document.getElementById("totalDisplay").textContent = `Rp ${(
    subtotal + shipping
  ).toLocaleString("id-ID")}`;
}

function setupCheckoutListeners() {
  const options = document.querySelectorAll(".payment-option");
  options.forEach((opt) => {
    opt.addEventListener("click", function () {
      options.forEach((o) =>
        o.classList.remove("selected", "border-primary", "bg-light")
      );
      this.classList.add("selected", "border-primary", "bg-light");
    });
  });

  const payBtn = document.getElementById("payButton");
  if (payBtn) {
    payBtn.addEventListener("click", function () {
      if (!document.querySelector(".payment-option.selected")) {
        alert("Mohon pilih metode pembayaran!");
        return;
      }
      const modal = new bootstrap.Modal(
        document.getElementById("successModal")
      );
      modal.show();
      const data = getData();
      data.cart = [];
      saveData(data);
      renderCart([]);
      updateCartCount();
    });
  }
}

// =========================================
// LOGIKA WISHLIST (BARU)
// =========================================
function renderWishlist(wishlist) {
  const tableBody = document.getElementById("wishlistTableBody");
  const emptyMessage = document.getElementById("emptyWishlistMessage");
  const container = document.getElementById("wishlistContainer");

  if (!tableBody) return;
  tableBody.innerHTML = "";

  if (wishlist.length === 0) {
    emptyMessage.style.display = "block";
    container.style.display = "none";
  } else {
    emptyMessage.style.display = "none";
    container.style.display = "block";

    wishlist.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td class="ps-4">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" class="rounded me-3" width="60" height="60" style="object-fit: cover">
                        <div>
                            <div class="fw-bold">${item.name}</div>
                            <small class="text-muted">${item.artisan}</small>
                        </div>
                    </div>
                </td>
                <td class="align-middle text-primary fw-bold">${item.price}</td>
                <td class="align-middle"><span class="badge bg-success">Tersedia</span></td>
                <td class="align-middle text-end pe-4">
                    <button class="btn btn-sm btn-primary me-2" onclick="moveWishlistToCart(${item.id})">
                        <i class="bi bi-cart-plus"></i> Beli
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="toggleWishlist(${item.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
      tableBody.appendChild(row);
    });
  }
}

// =========================================
// FUNGSI GLOBAL & HELPER
// =========================================

function addToCart(productId) {
  const data = getData();
  const product = data.products.find((p) => p.id === productId);
  const existingItem = data.cart.find((item) => item.id === productId);

  if (existingItem) existingItem.quantity += 1;
  else data.cart.push({ ...product, quantity: 1 });

  saveData(data);
  updateCartCount();
  alert("Produk berhasil masuk keranjang!");
}

function updateQty(id, change) {
  const data = getData();
  const item = data.cart.find((i) => i.id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) data.cart = data.cart.filter((i) => i.id !== id);
    saveData(data);
    renderCart(data.cart);
    updateCartCount();
  }
}

function removeItem(id) {
  if (confirm("Hapus dari keranjang?")) {
    const data = getData();
    data.cart = data.cart.filter((i) => i.id !== id);
    saveData(data);
    renderCart(data.cart);
    updateCartCount();
  }
}

function toggleWishlist(productId) {
  const data = getData();
  const index = data.wishlist.findIndex((item) => item.id === productId);
  const product = data.products.find((p) => p.id === productId);

  if (index !== -1) data.wishlist.splice(index, 1);
  else data.wishlist.push(product);

  saveData(data);
  location.reload();
}

function moveWishlistToCart(productId) {
  addToCart(productId); // Tambah ke Cart
  toggleWishlist(productId); // Hapus dari Wishlist
}

function updateCartCount() {
  const count = getData().cart.reduce((t, i) => t + i.quantity, 0);
  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = count;
}

function updateWishlistCount() {
  const count = getData().wishlist.length;
  const badge = document.getElementById("wishlistCount");
  if (badge) badge.textContent = count;
}
