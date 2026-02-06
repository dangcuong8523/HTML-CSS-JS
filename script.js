/* ===============================
   CONFIG
================================ */
const CART_KEY = "dc_argb_cart";

/* ===============================
   CART DATA
================================ */
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* ===============================
   ADD TO CART
================================ */
function addToCart(product) {
  const item = cart.find(p => p.id === product.id);

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart();
  alert("Đã thêm vào giỏ hàng ✔");
}

/* ===============================
   DOM READY
================================ */
document.addEventListener("DOMContentLoaded", () => {

  // SHOP / INDEX
  if (document.getElementById("product-grid")) {
    renderProducts(products);
    initFilter?.();
  }

  // PRODUCT DETAIL
  renderProductDetail();

  // CART PAGE
  if (document.getElementById("cart-items")) {
    renderCart();
  }
});

/* ===============================
   RENDER PRODUCTS
================================ */
function renderProducts(list) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-media" style="background-image:url('${p.image}')">
          ${p.badge ? `<span class="badge-hot">${p.badge}</span>` : ""}
        </div>
        <div class="card-meta">
          <h4>${p.name}</h4>
          <p class="card-price">${p.price.toLocaleString("vi-VN")}đ</p>
        </div>
        <div class="card-bottom">
          <span>⭐ ${p.rating}</span>
          <button class="card-btn">Thêm vào giỏ</button>
        </div>
      </div>
    `;

    // click card → product
    card.addEventListener("click", () => {
      window.location.href = `product.html?id=${p.id}`;
    });

    // click button → add cart
    card.querySelector(".card-btn").addEventListener("click", e => {
      e.stopPropagation();
      addToCart(p);
    });

    grid.appendChild(card);
  });
}

/* ===============================
   FILTER
================================ */
function initFilter() {
  document.querySelectorAll(".filter-tab").forEach(btn => {
    btn.onclick = () => {
      document.querySelector(".filter-tab.active")?.classList.remove("active");
      btn.classList.add("active");

      const type = btn.dataset.filter;
      renderProducts(
        type === "all"
          ? products
          : products.filter(p => p.category === type)
      );
    };
  });
}

/* ===============================
   PRODUCT DETAIL
================================ */
function renderProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  if (!id) return;

  const product = products.find(p => p.id === id);
  if (!product) return;

  const img = document.getElementById("pd-image");
  if (!img) return;

  document.getElementById("pd-name").innerText = product.name;
  document.getElementById("pd-price").innerText =
    product.price.toLocaleString("vi-VN") + "đ";
  document.getElementById("pd-rating").innerText =
    "⭐ ".repeat(Math.round(product.rating));
  document.getElementById("pd-badge").innerText = product.badge || "";

  img.src = product.image;

  document.getElementById("pd-add-cart").onclick = () => {
    addToCart(product);
  };
}

/* ===============================
   CART PAGE
================================ */
function renderCart() {
  const list = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");

  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = `<p class="empty">Giỏ hàng đang trống.</p>`;
    subtotalEl.textContent = "0đ";
    totalEl.textContent = "0đ";
    return;
  }

  let subtotal = 0;
  list.innerHTML = "";

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    list.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>${item.price.toLocaleString("vi-VN")}đ</p>

          <div class="qty-control">
            <button onclick="updateQty(${index}, -1)">−</button>
            <span>${item.quantity}</span>
            <button onclick="updateQty(${index}, 1)">+</button>
          </div>
        </div>

        <div class="cart-price">
          ${itemTotal.toLocaleString("vi-VN")}đ
        </div>
      </div>
    `;
  });

  subtotalEl.textContent = subtotal.toLocaleString("vi-VN") + "đ";
  totalEl.textContent = subtotal.toLocaleString("vi-VN") + "đ";
}

/* ===============================
   UPDATE QTY
================================ */
function updateQty(index, change) {
  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}
