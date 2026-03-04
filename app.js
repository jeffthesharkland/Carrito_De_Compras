// Arreglo con productos y sus especificaciones para la vista previa.
const products = [
  {
    id: 1,
    name: "Laptop ASUS VivoBook 15",
    priceGTQ: 4899,
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=900&q=80",
    specs: "Intel Core i5, 8GB RAM, SSD 512GB, pantalla Full HD de 15.6 pulgadas."
  },
  {
    id: 2,
    name: "Monitor LG 24\" IPS",
    priceGTQ: 1299,
    image: "https://images.unsplash.com/photo-1527443224154-c4d5886d621f?auto=format&fit=crop&w=900&q=80",
    specs: "Resolucion Full HD, panel IPS, 75Hz, puertos HDMI y DisplayPort."
  },
  {
    id: 3,
    name: "Teclado Mecanico Redragon",
    priceGTQ: 499,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80",
    specs: "Switches azules, iluminacion RGB, formato 60%, cable USB-C."
  },
  {
    id: 4,
    name: "Mouse Logitech G203",
    priceGTQ: 299,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80",
    specs: "Sensor de 8000 DPI, 6 botones programables, iluminacion LIGHTSYNC."
  },
  {
    id: 5,
    name: "Memoria RAM Kingston 16GB",
    priceGTQ: 620,
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=900&q=80",
    specs: "DDR4 3200MHz, latencia CL16, ideal para gaming y trabajo pesado."
  },
  {
    id: 6,
    name: "SSD NVMe 1TB WD Black",
    priceGTQ: 980,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=80",
    specs: "Lectura de hasta 5150 MB/s, interfaz PCIe Gen4, formato M.2."
  },
  {
    id: 7,
    name: "Auriculares HyperX Cloud II",
    priceGTQ: 799,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    specs: "Sonido 7.1 virtual, microfono desmontable, estructura de aluminio."
  },
  {
    id: 8,
    name: "Webcam Logitech C920",
    priceGTQ: 699,
    image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=900&q=80",
    specs: "Video Full HD 1080p, enfoque automatico, microfonos duales."
  },
  {
    id: 9,
    name: "Impresora HP Smart Tank",
    priceGTQ: 1999,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=900&q=80",
    specs: "Impresion, copia y escaneo, tinta continua, conexion Wi-Fi."
  },
  {
    id: 10,
    name: "Router TP-Link AX1800",
    priceGTQ: 849,
    image: "https://images.unsplash.com/photo-1648134859191-fd90b167f03f?auto=format&fit=crop&w=900&q=80",
    specs: "Wi-Fi 6, velocidad dual band, seguridad WPA3, 4 puertos LAN."
  }
];

// Tipo de cambio base: 1 USD = 7.8 GTQ.
const EXCHANGE_RATE_GTQ_TO_USD = 7.8;

const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const resultsInfo = document.getElementById("resultsInfo");
const cartItemsEl = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");
const clearCartBtn = document.getElementById("clearCart");
const checkoutBtn = document.getElementById("checkoutBtn");
const cartCountEl = document.getElementById("cartCount");
const currencySelect = document.getElementById("currencySelect");
const themeToggle = document.getElementById("themeToggle");
const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");

const previewModal = document.getElementById("previewModal");
const previewImage = document.getElementById("previewImage");
const previewName = document.getElementById("previewName");
const previewSpecs = document.getElementById("previewSpecs");
const closePreview = document.getElementById("closePreview");

const paymentModal = document.getElementById("paymentModal");
const closePayment = document.getElementById("closePayment");
const paymentForm = document.getElementById("paymentForm");
const paymentMethod = document.getElementById("paymentMethod");
const deliveryFields = document.getElementById("deliveryFields");
const cardFields = document.getElementById("cardFields");
const cardNumberInput = document.getElementById("cardNumber");

let cart = [];
let currentCurrency = localStorage.getItem("currency") || "GTQ";
let isDark = localStorage.getItem("theme") === "dark";

if (isDark) {
  document.body.classList.add("dark");
  themeToggle.textContent = "Modo Claro";
}

currencySelect.value = currentCurrency;

// Convierte el precio al formato de moneda seleccionado.
function formatPrice(priceGTQ) {
  if (currentCurrency === "USD") {
    return `$ ${(priceGTQ / EXCHANGE_RATE_GTQ_TO_USD).toFixed(2)}`;
  }
  return `Q ${priceGTQ.toFixed(2)}`;
}

function renderProducts(filterText = "") {
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(filterText.toLowerCase())
  );

  resultsInfo.textContent = `${filtered.length} producto${filtered.length === 1 ? "" : "s"}`;

  if (!filtered.length) {
    productsGrid.innerHTML = "<p>No se encontraron productos con ese termino.</p>";
    return;
  }

  productsGrid.innerHTML = filtered
    .map(
      (p) => `
      <article class="card">
        <img src="${p.image}" alt="${p.name}" />
        <div class="card-content">
          <h3>${p.name}</h3>
          <p class="price">${formatPrice(p.priceGTQ)}</p>
          <div class="card-actions">
            <button class="btn" data-add="${p.id}">Agregar al carrito</button>
            <button class="btn secondary" data-preview="${p.id}">Vista previa</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

// Agrega producto al carrito y suma cantidad si ya existe.
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p>No hay productos en el carrito.</p>";
    totalPriceEl.textContent = formatPrice(0);
    cartCountEl.textContent = "0";
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <small>Cantidad: ${item.quantity}</small>
          <small>Subtotal: ${formatPrice(item.priceGTQ * item.quantity)}</small>
        </div>
        <button class="btn danger" data-remove="${item.id}">Quitar</button>
      </div>
    `
    )
    .join("");

  const total = cart.reduce((acc, item) => acc + item.priceGTQ * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  totalPriceEl.textContent = formatPrice(total);
  cartCountEl.textContent = String(totalItems);
}

function showPreview(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  previewImage.src = product.image;
  previewName.textContent = product.name;
  previewSpecs.textContent = product.specs;
  previewModal.classList.remove("hidden");
}

function openPayment() {
  if (!cart.length) {
    alert("Debes agregar productos antes de pagar.");
    return;
  }
  paymentModal.classList.remove("hidden");
}

function validatePayment() {
  const method = paymentMethod.value;
  if (!method) {
    alert("Selecciona un metodo de pago.");
    return false;
  }

  if (method === "entrega") {
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const reference = document.getElementById("reference").value.trim();

    if (!address || !phone || !reference) {
      alert("Completa direccion, telefono y referencia para entrega.");
      return false;
    }
  }

  if (method === "tarjeta") {
    const cardNumber = document.getElementById("cardNumber").value.replace(/\s+/g, "");
    const cardExpiry = document.getElementById("cardExpiry").value;
    const cardCVV = document.getElementById("cardCVV").value.trim();

    const validCard = /^\d{16}$/.test(cardNumber);
    const validCVV = /^\d{3,4}$/.test(cardCVV);

    if (!validCard || !cardExpiry || !validCVV) {
      alert("Datos de tarjeta invalidos. Verifica numero, fecha y CVV.");
      return false;
    }
  }

  return true;
}

// Genera un recibo en PDF con el detalle de compra.
function generatePdfReceipt(customerName, method) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Recibo de compra - TechMarket GT", 12, 15);
  doc.setFontSize(11);
  doc.text(`Cliente: ${customerName}`, 12, 25);
  doc.text(`Metodo de pago: ${method}`, 12, 32);

  let y = 44;
  cart.forEach((item) => {
    const subtotal = item.priceGTQ * item.quantity;
    doc.text(`${item.name} x${item.quantity} - Q ${subtotal.toFixed(2)}`, 12, y);
    y += 8;
  });

  const total = cart.reduce((acc, item) => acc + item.priceGTQ * item.quantity, 0);
  doc.setFontSize(13);
  doc.text(`Total: Q ${total.toFixed(2)}`, 12, y + 8);

  doc.save("recibo-techmarket.pdf");
}

function closeModal(modalElement) {
  modalElement.classList.add("hidden");
}

productsGrid.addEventListener("click", (e) => {
  const addId = e.target.dataset.add;
  const previewId = e.target.dataset.preview;

  if (addId) addToCart(Number(addId));
  if (previewId) showPreview(Number(previewId));
});

cartItemsEl.addEventListener("click", (e) => {
  const removeId = e.target.dataset.remove;
  if (removeId) removeFromCart(Number(removeId));
});

searchInput.addEventListener("input", (e) => {
  renderProducts(e.target.value);
});

clearCartBtn.addEventListener("click", () => {
  cart = [];
  renderCart();
});

checkoutBtn.addEventListener("click", openPayment);

currencySelect.addEventListener("change", () => {
  currentCurrency = currencySelect.value;
  localStorage.setItem("currency", currentCurrency);
  renderProducts(searchInput.value);
  renderCart();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.textContent = isDark ? "Modo Claro" : "Modo Oscuro";
});

cartButton.addEventListener("click", () => {
  cartPanel.scrollIntoView({ behavior: "smooth" });
});

closePreview.addEventListener("click", () => closeModal(previewModal));
closePayment.addEventListener("click", () => closeModal(paymentModal));

previewModal.addEventListener("click", (e) => {
  if (e.target === previewModal) closeModal(previewModal);
});

paymentModal.addEventListener("click", (e) => {
  if (e.target === paymentModal) closeModal(paymentModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal(previewModal);
    closeModal(paymentModal);
  }
});

paymentMethod.addEventListener("change", () => {
  const method = paymentMethod.value;
  deliveryFields.classList.toggle("hidden", method !== "entrega");
  cardFields.classList.toggle("hidden", method !== "tarjeta");
});

// Formatea automaticamente la tarjeta en grupos de 4 digitos.
cardNumberInput.addEventListener("input", () => {
  const digits = cardNumberInput.value.replace(/\D/g, "").slice(0, 16);
  cardNumberInput.value = digits.replace(/(.{4})/g, "$1 ").trim();
});

paymentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!paymentForm.reportValidity()) return;
  if (!validatePayment()) return;

  const customerName = document.getElementById("fullName").value.trim();
  const method = paymentMethod.value === "entrega" ? "Efectivo contra entrega" : "Tarjeta";

  generatePdfReceipt(customerName, method);

  alert("Pago validado correctamente. Se genero el recibo en PDF.");
  cart = [];
  renderCart();
  paymentForm.reset();
  deliveryFields.classList.add("hidden");
  cardFields.classList.add("hidden");
  closeModal(paymentModal);
});

renderProducts();
renderCart();
