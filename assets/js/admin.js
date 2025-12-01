document.addEventListener("DOMContentLoaded", function () {
  // =========================================
  // 1. CEK KEAMANAN (Wajib Login Admin)
  // =========================================
  const session = checkSession();
  if (!session || session.role !== "admin") {
    window.location.href = "../index.html";
    return;
  }

  // =========================================
  // 2. LOAD DATA DARI LOCALSTORAGE
  // =========================================
  const data = getData();

  // =========================================
  // 3. LOGIKA ROUTING (Cek sedang di halaman mana)
  // =========================================

  // A. Jika di Halaman Dashboard (Ada elemen grafik)
  if (document.getElementById("salesChart")) {
    renderStats(data);
    initCharts();
  }

  // B. Jika di Halaman Manajemen Data (Ada tabel produk)
  if (document.getElementById("productTableBody")) {
    renderProductTable(data.products);
  }

  // =========================================
  // 4. EVENT LISTENER GLOBAL
  // =========================================

  // Tombol Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      logout();
    });
  }

  // Tombol Reset Data
  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (
        confirm(
          "PERINGATAN: Semua data akan di-reset ke kondisi awal. Lanjutkan?"
        )
      ) {
        localStorage.removeItem("astakarya_data");
        location.reload();
      }
    });
  }
});

// =========================================
// BAGIAN A: FUNGSI DASHBOARD
// =========================================

function renderStats(data) {
  document.getElementById("totalRevenue").textContent = "Rp 12.5JT";
  document.getElementById("totalOrders").textContent = "142";
  const activeProducts = data.products.filter(
    (p) => p.status === "active"
  ).length;
  document.getElementById("totalProducts").textContent = activeProducts;
}

function initCharts() {
  const ctx1 = document.getElementById("salesChart");
  if (ctx1) {
    new Chart(ctx1, {
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
            label: "Pendapatan (Juta)",
            data: [12, 19, 3, 5, 2, 3, 10, 15, 8, 12, 20, 25],
            borderColor: "#0f172a",
            tension: 0.1,
            fill: true,
            backgroundColor: "rgba(15, 23, 42, 0.1)",
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  const ctx2 = document.getElementById("categoryChart");
  if (ctx2) {
    new Chart(ctx2, {
      type: "doughnut",
      data: {
        labels: ["Dekorasi", "Fashion", "Seni", "Aksesoris"],
        datasets: [
          {
            data: [35, 30, 10, 25],
            backgroundColor: ["#0f172a", "#ca8a04", "#64748b", "#e2e8f0"],
          },
        ],
      },
    });
  }
}

// =========================================
// BAGIAN B: FUNGSI MANAJEMEN PRODUK (CRUD)
// =========================================

function renderProductTable(products) {
  const tbody = document.getElementById("productTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  products.forEach((product) => {
    const row = document.createElement("tr");

    const statusBadge =
      product.status === "active"
        ? '<span class="badge bg-success">Aktif</span>'
        : '<span class="badge bg-secondary">Nonaktif</span>';

    const toggleBtnClass =
      product.status === "active"
        ? "btn-outline-danger"
        : "btn-outline-success";
    const toggleBtnText =
      product.status === "active" ? "Nonaktifkan" : "Aktifkan";

    row.innerHTML = `
            <td class="ps-3">
                <div class="d-flex align-items-center">
                    <img src="${product.image}" class="product-thumb me-2" alt="${product.name}">
                    <div><div class="fw-bold">${product.name}</div><small class="text-muted">${product.category}</small></div>
                </div>
            </td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm ${toggleBtnClass} py-0" onclick="toggleStatus(${product.id})">
                    ${toggleBtnText}
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function toggleStatus(id) {
  const data = getData();
  const product = data.products.find((p) => p.id === id);
  if (product) {
    product.status = product.status === "active" ? "inactive" : "active";
    saveData(data);
    renderProductTable(data.products);
  }
}

// ==========================================================
// BAGIAN C: LOGIKA INTERAKTIF MANAGEMENT (Verif & Kategori)
// ==========================================================

// 1. FUNGSI VERIFIKASI PRODUK (Update Angka Badge Realtime)
function verifyProduct(rowId, action) {
  const row = document.getElementById(rowId);
  if (!row) return;

  // Ambil Elemen Badge Angka di Tab
  const badgePending = document.querySelector(
    '#verifikasiTabs button[data-bs-target="#pending"] .badge'
  );
  const badgeVerified = document.querySelector(
    '#verifikasiTabs button[data-bs-target="#verified"] .badge'
  );
  const badgeRejected = document.querySelector(
    '#verifikasiTabs button[data-bs-target="#rejected"] .badge'
  );

  // Ubah text "2" jadi angka 2
  let countPending = parseInt(badgePending.textContent);
  let countVerified = parseInt(badgeVerified.textContent);
  let countRejected = parseInt(badgeRejected.textContent);

  if (action === "approve") {
    // Logika: Pending berkurang, Verified bertambah
    if (countPending > 0) badgePending.textContent = countPending - 1;
    badgeVerified.textContent = countVerified + 1;

    // Efek baris jadi hijau lalu hilang
    row.style.backgroundColor = "#d1e7dd";
    setTimeout(() => {
      row.remove();
    }, 300);
  } else if (action === "reject") {
    // Logika: Pending berkurang, Rejected bertambah
    if (countPending > 0) badgePending.textContent = countPending - 1;
    badgeRejected.textContent = countRejected + 1;

    // Efek baris jadi merah lalu hilang
    row.style.backgroundColor = "#f8d7da";
    setTimeout(() => {
      row.remove();
    }, 300);
  }
}

// 2. FUNGSI ON/OFF STATUS (Untuk Kategori & Pengrajin)
function toggleRowStatus(button) {
  const row = button.closest("tr");
  const badge = row.querySelector(".badge"); // Cari badge di baris itu

  if (
    button.textContent.trim() === "Nonaktifkan" ||
    button.textContent.trim() === "Off"
  ) {
    // Ubah jadi Mati
    badge.className = "badge bg-secondary";
    badge.textContent = "Nonaktif";

    button.className = "btn btn-sm btn-outline-success py-0 toggle-btn";
    button.textContent = "Aktifkan";
  } else {
    // Ubah jadi Hidup
    badge.className = "badge bg-success";
    badge.textContent = "Aktif";

    button.className = "btn btn-sm btn-outline-danger py-0 toggle-btn";
    button.textContent = "Nonaktifkan";
  }
}
// =========================================
// BAGIAN 4: LOGIKA INTERAKTIF (Update Real-time)
// =========================================

// 1. FUNGSI TOGGLE STATUS KATEGORI (On/Off)
function toggleCategoryStatus(button) {
  // Cari baris (tr) tempat tombol ini berada
  const row = button.closest("tr");
  // Cari badge status di baris tersebut
  const statusBadge = row.querySelector(".badge"); // Pastikan ambil class .badge

  // Cek teks tombol sekarang
  if (button.textContent.trim() === "Nonaktifkan") {
    // UBAH KE NONAKTIF
    statusBadge.className = "badge bg-secondary"; // Warna Abu
    statusBadge.textContent = "Nonaktif";

    button.className = "btn btn-sm btn-outline-success py-0"; // Tombol jadi Hijau
    button.textContent = "Aktifkan";
  } else {
    // UBAH KE AKTIF
    statusBadge.className = "badge bg-success"; // Warna Hijau
    statusBadge.textContent = "Aktif";

    button.className = "btn btn-sm btn-outline-danger py-0"; // Tombol jadi Merah
    button.textContent = "Nonaktifkan";
  }
}
