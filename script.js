// ================== SIDEBAR ==================
const sidebar = document.getElementById("sidebar");
const menuToggle = document.querySelector(".menu-toggle");
const closeBtn = document.querySelector(".close-btn");

if (menuToggle) {
  menuToggle.addEventListener("click", () => sidebar.classList.add("active"));
}
if (closeBtn) {
  closeBtn.addEventListener("click", () => sidebar.classList.remove("active"));
}

// ================== BANNER SLIDER (HOME) ==================
let currentBanner = 0;
const bannerSlides = document.querySelectorAll(".banner-slider .slide");
const bannerTrack = document.querySelector(".banner-slider .slides");
const prevBannerBtn = document.querySelector(".banner-slider .prev");
const nextBannerBtn = document.querySelector(".banner-slider .next");

function showBanner(index) {
  if (!bannerTrack || bannerSlides.length === 0) return;
  if (index < 0) currentBanner = bannerSlides.length - 1;
  else if (index >= bannerSlides.length) currentBanner = 0;
  else currentBanner = index;

  bannerTrack.style.transform = `translateX(-${currentBanner * 100}%)`;
}

// Auto slide
setInterval(() => {
  if (bannerSlides.length > 0) showBanner(currentBanner + 1);
}, 4000);

// ================== DETAIL PRODUK SLIDER ==================
function initDetailSlider() {
  const slidesContainer = document.querySelector(".detail-slider .slides");
  const slides = document.querySelectorAll(".detail-slider .slide");
  const prevBtn = document.querySelector(".detail-slider .prev");
  const nextBtn = document.querySelector(".detail-slider .next");

  if (!slidesContainer || slides.length === 0) return;

  let currentIndex = 0;

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
  }

  if (prevBtn) prevBtn.onclick = () => showSlide(currentIndex - 1);
  if (nextBtn) nextBtn.onclick = () => showSlide(currentIndex + 1);

  // Auto slide tiap 5 detik
  setInterval(() => {
    showSlide(currentIndex + 1);
  }, 5000);

  // Tampilkan slide pertama
  showSlide(0);
}

// ================== DATA PRODUK ==================
const products = [
  {
    id: 1,
    name: "White Tee KL",
    price: 149000,
    images: ["product1.png", "product1b.png"],
    desc: "Bahan premium, nyaman dipakai."
  },
  {
    id: 2,
    name: "White Tee KL",
    price: 149000,
    images: ["product2.png", "product2b.png"],
    desc: "Desain simple tapi elegan."
  },
  {
    id: 3,
    name: "Hoodie KL",
    price: 349000,
    images: ["product3.png", "product3b.png"],
    desc: "Cocok untuk streetwear style."
  },
  {
    id: 4,
    name: "Sweater KL",
    price: 299000,
    images: ["product4.png", "product4b.png"],
    desc: "Nyaman dan hangat dipakai."
  },
  {
    id: 5,
    name: "Sweater FO",
    price: 299000,
    images: ["product5.png", "product5b.png"],
    desc: "Cocok untuk streetwear style."
  },
  {
    id: 6,
    name: "White Tee FO",
    price: 149000,
    images: ["product6.png", "product6b.png"],
    desc: "Simple untuk daily wear."
  },
  {
    id: 7,
    name: "White Tee LM",
    price: 149000,
    images: ["product7.png", "product7b.png"],
    desc: "Simple untuk daily wear."
  },
  {
    id: 8,
    name: "White Tee TS",
    price: 149000,
    images: ["product8.png", "product8b.png"],
    desc: "Simple untuk daily wear."
  }
];

// ================== DETAIL PRODUK ==================
function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const product = products.find(p => p.id === id);

  if (!product) return;

  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = "IDR " + product.price.toLocaleString();
  document.getElementById("productDesc").textContent = product.desc;

  // Slider gambar
  const slidesContainer = document.querySelector(".detail-slider .slides");
  slidesContainer.innerHTML = "";
  product.images.forEach(src => {
    const div = document.createElement("div");
    div.className = "slide";
    div.innerHTML = `<img src="${src}" alt="${product.name}">`;
    slidesContainer.appendChild(div);
  });

  // Produk terkait
  const relatedContainer = document.getElementById("relatedProducts");
  if (relatedContainer) {
    relatedContainer.innerHTML = "";
    const related = products.filter(p => p.id !== id);
    related.forEach(p => {
      const div = document.createElement("a");
      div.href = `detail.html?id=${p.id}`;
      div.className = "related-card";
      div.innerHTML = `
        <img src="${p.images[0]}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>IDR ${p.price.toLocaleString()}</p>
      `;
      relatedContainer.appendChild(div);
    });
  }

  // Inisialisasi slider setelah gambar dimuat
  initDetailSlider();
}

// ================== KERANJANG ==================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsContainer = document.getElementById("cartItems");
const subtotalEl = document.getElementById("cartSubtotal");

function renderCart() {
  if (!cartItemsContainer) return;
  cartItemsContainer.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    if (!item.qty || isNaN(item.qty)) item.qty = 1;
    subtotal += item.price * item.qty;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p>IDR ${item.price.toLocaleString()}</p>
        <div class="quantity-control">
          <button onclick="updateQty(${index}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${index}, 1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeItem(${index})">✕</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  if (subtotalEl) {
    subtotalEl.textContent = "SUBTOTAL IDR " + subtotal.toLocaleString();
  }

  updateCartBadge();
}

function updateQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function clearCart() {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) {
    badge.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }
}

// ================== ADD TO CART ==================
const addCartBtn = document.getElementById("addCartBtn");
if (addCartBtn) {
  addCartBtn.addEventListener("click", () => {
    const name = document.getElementById("productName").textContent;
    const priceText = document.getElementById("productPrice").textContent;
    const price = parseInt(priceText.replace(/[^\d]/g, ""));
    const img = document.querySelector(".detail-slider img")?.src || "";

    let existing = cart.find(p => p.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ img, name, price, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
  });
}

// ================== COLLECTION PAGE ==================
function renderCollection() {
  const collectionContainer = document.getElementById("collectionProducts");
  if (!collectionContainer) return;

  collectionContainer.innerHTML = "";

  products.forEach(p => {
    const div = document.createElement("a");
    div.href = `detail.html?id=${p.id}`;
    div.className = "product-card";
    div.innerHTML = `
      <img src="${p.images[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>IDR ${p.price.toLocaleString()}</p>
    `;
    collectionContainer.appendChild(div);
  });
}

// ================== SORT & FILTER ==================
// ================== SORT & FILTER ==================
let currentSort = "default";
let currentFilter = "all";

const filters = ["all", "kl", "fo", "ts", "lm"];
let filterIndex = 0;

function applyCollectionControls() {
  const collectionContainer = document.getElementById("collectionProducts");
  if (!collectionContainer) return;

  let filtered = [...products];

  // 🔹 Filter berdasarkan nama produk
  if (currentFilter !== "all") {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(currentFilter)
    );
  }

  // 🔹 Urutkan berdasarkan harga
  if (currentSort === "lowToHigh") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === "highToLow") {
    filtered.sort((a, b) => b.price - a.price);
  }

  // 🔹 Render ulang produk
  collectionContainer.innerHTML = "";
  filtered.forEach(p => {
    const div = document.createElement("a");
    div.href = `detail.html?id=${p.id}`;
    div.className = "product-card";
    div.innerHTML = `
      <img src="${p.images[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>IDR ${p.price.toLocaleString()}</p>
    `;
    collectionContainer.appendChild(div);
  });

  // 🔹 Update label filter & sort
  const filterLabel = document.getElementById("filterLabel");
  const sortLabel = document.getElementById("sortLabel");
  if (filterLabel) filterLabel.textContent = `Filter: ${currentFilter.toUpperCase()}`;
  if (sortLabel) sortLabel.textContent = `Sort: ${currentSort}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const filterBtn = document.querySelector(".filter-btn");
  const sortBtn = document.querySelector(".sort-btn");

  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      // 🔄 Geser filter (ALL → KL → FO → TS → LM → ALL)
      filterIndex = (filterIndex + 1) % filters.length;
      currentFilter = filters[filterIndex];
      applyCollectionControls();
    });
  }

  if (sortBtn) {
    sortBtn.addEventListener("click", () => {
      // 🔄 Toggle urutan harga
      if (currentSort === "default") currentSort = "lowToHigh";
      else if (currentSort === "lowToHigh") currentSort = "highToLow";
      else currentSort = "default";
      applyCollectionControls();
    });
  }
});

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartBadge();
  loadProductDetail();
  applyCollectionControls();
});
