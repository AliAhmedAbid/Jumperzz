
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); 
      }
    });
  },
  {
    threshold: 0.1
  }
);

function observeProductCards() {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => observer.observe(card));
}

document.addEventListener("DOMContentLoaded", () => {

  


  
  const profileBtn = document.querySelector('.nav-icons .nav-icon-btn[aria-label="Profile"]');

  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

      if (isLoggedIn) {
        window.location.href = 'profile.html';
      } else {
        window.location.href = 'login.html';
      }
    });
  }

  
  const filterBtn = document.getElementById("filterBtn");
  const filterPanel = document.getElementById("filterPanel");
  const closeFilterBtn = document.getElementById("closeFilterBtn");
  const teamList = document.getElementById("teamList");
  const productGrid = document.querySelector(".product-grid");
  const filterSearch = document.getElementById("filterSearch");
  const productSearchInput = document.getElementById("productSearch");

  const products = [
    { id: 1, name: "Real Madrid Shirt", team: "Real Madrid", price: "599kr 6̶9̶9̶kr", img: "images/imagess/RMCFMZ0195-01-1.jpg" },
    { id: 2, name: "Barcelona Classic Shirt", team: "Barcelona", price: "699kr", img: "images/imagess/barca.jpg" },
    { id: 3, name: "Manchester United Shirt", team: "Manchester United", price: "699kr", img: "images/imagess/manchester.jpg" },
    { id: 4, name: "Liverpool Classic Shirt", team: "Liverpool", price: "699kr", img: "images/imagess/Nike-Liverpool-FC-Stadium-Home-Jersey-2022-23.jpg" },
    { id: 5, name: "Juventus White Shirt", team: "Juventus", price: "699kr", img: "images/imagess/Juventus.jpg" },
    { id: 6, name: "Paris Saint-Germain Shirt", team: "Paris Saint-Germain", price: "699kr", img: "images/imagess/Paris.jpg" },
    { id: 7, name: "Bayern Munich Shirt", team: "Bayern Munich", price: "699kr", img: "images/imagess/byern.jpg" },
  ];

function renderProducts(filteredProducts) {
  if (!productGrid) return;

  productGrid.innerHTML = "";

  if (!filteredProducts.length) {
    productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#555;">No products found.</p>`;
    return;
  }

  filteredProducts.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.productId = product.id;

    card.innerHTML = `
      <a href="product.html?id=${product.id}" class="product-link">
        <img src="${product.img}" alt="${product.name}" />
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>Team: ${product.team}</p>
          <p class="price">${product.price}</p>
        </div>
      </a>
    `;

    productGrid.appendChild(card);

    
    
  });
}


  
  const originalRenderProducts = renderProducts;

  renderProducts = function(filteredProducts) {
    originalRenderProducts(filteredProducts);
    observeProductCards();
  };

  
  renderProducts(products);

  // Filter panel logic
  if (filterBtn && filterPanel && closeFilterBtn) {
    filterBtn.addEventListener("click", () => {
      filterPanel.classList.add("active");
      filterPanel.setAttribute("aria-hidden", "false");
      if (filterSearch) {
        filterSearch.value = "";
        filterSearch.focus();
        filterTeams("");
      }
    });

    closeFilterBtn.addEventListener("click", () => {
      filterPanel.classList.remove("active");
      filterPanel.setAttribute("aria-hidden", "true");
    });
  }

  const teams = [...new Set(products.map((p) => p.team))].sort();

  function filterTeams(searchTerm) {
    if (!teamList) return;

    const filteredTeams = teams.filter((team) =>
      team.toLowerCase().includes(searchTerm.toLowerCase())
    );
    teamList.innerHTML = "";

    if (!filteredTeams.length) {
      teamList.innerHTML = `<li style="color:#999;">No teams found.</li>`;
      return;
    }

    filteredTeams.forEach((team) => {
      const li = document.createElement("li");
      li.textContent = team;
      li.tabIndex = 0;
      li.setAttribute("role", "button");
      li.addEventListener("click", () => {
        filterPanel.classList.remove("active");
        filterPanel.setAttribute("aria-hidden", "true");
        const filteredProducts = products.filter((p) => p.team === team);
        renderProducts(filteredProducts);
      });
      li.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          li.click();
        }
      });
      teamList.appendChild(li);
    });
  }

  if (filterSearch) {
    filterSearch.addEventListener("input", () => {
      filterTeams(filterSearch.value);
    });
  }

  if (teamList) {
    filterTeams("");
  }

  if (productSearchInput) {
    productSearchInput.addEventListener("input", () => {
      const searchTerm = productSearchInput.value.toLowerCase();
      const filteredProducts = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.team.toLowerCase().includes(searchTerm)
      );
      renderProducts(filteredProducts);
    });
  }

  // Banner slider logic
  const banners = document.querySelectorAll(".banner-slider img");
  let currentBanner = 0;

  function showNextBanner() {
    banners[currentBanner].classList.remove("active");
    currentBanner = (currentBanner + 1) % banners.length;
    banners[currentBanner].classList.add("active");
  }

  if (banners.length > 0) {
    banners[0].classList.add("active");
    setInterval(showNextBanner, 4000);
  }

  // ===== Navbar hide/show on scroll =====
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    let lastScrollTop = 0;
    const delta = 5;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (Math.abs(scrollTop - lastScrollTop) <= delta) {
        return;
      }

      if (scrollTop > lastScrollTop) {
        navbar.classList.add('navbar--hidden');
      } else {
        navbar.classList.remove('navbar--hidden');
      }

      lastScrollTop = scrollTop;
    });
  }

  // ===== Smooth scrolling for internal anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // ===== Cart Side Panel Logic =====
  const cartBtn = document.querySelector('.nav-icon-btn[aria-label="Cart"]');
  const cartPanel = document.getElementById('cartPanel');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsContainer = document.getElementById('cartItems');
  const checkoutBtn = document.getElementById('checkoutBtn');

  
  let cartProducts = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCartItems() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";

    if (cartProducts.length === 0) {
      cartItemsContainer.innerHTML = `<p>Your cart is empty.</p>`;
      checkoutBtn.disabled = true;
      return;
    }

    checkoutBtn.disabled = false;

    cartProducts.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';

      cartItem.innerHTML = `
        <button class="remove-cart-item remove-btn" aria-label="Remove product">−</button>
        <a href="product.html?id=${item.id}" class="product-link">
          <img src="${item.img}" alt="${item.name}" />
          <div class="product-info">
            <h3>${item.name}</h3>
            <p class="price">${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
          </div>
        </a>
      `;

      const removeBtn = cartItem.querySelector('.remove-cart-item');
      removeBtn.addEventListener('click', () => {
        cartProducts = cartProducts.filter(p => p.id !== item.id);
        renderCartItems();
      });

      cartItemsContainer.appendChild(cartItem);
    });
  }

  renderCartItems();

  if (cartBtn && cartPanel) {
    cartBtn.addEventListener('click', () => {
      cartPanel.classList.add('active');
      cartPanel.setAttribute('aria-hidden', 'false');
    });
  }

  if (closeCartBtn && cartPanel) {
    closeCartBtn.addEventListener('click', () => {
      cartPanel.classList.remove('active');
      cartPanel.setAttribute('aria-hidden', 'true');
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartProducts.length === 0) return;
      alert('Thank you for your purchase!');
      cartProducts = [];
      renderCartItems();
      cartPanel.classList.remove('active');
      cartPanel.setAttribute('aria-hidden', 'true');
    });
  }

const buyButton = document.getElementById('buyButton');

buyButton.addEventListener('click', () => {
  // Extract product details from the product page elements
  const productId = parseInt(new URLSearchParams(window.location.search).get('id')) || Date.now(); // fallback id if no query param
  const productName = document.getElementById('product-name').textContent.trim();
  const productPrice = document.getElementById('product-price').textContent.trim();
  const productImg = document.getElementById('product-img').src;
  
  // Check if product already in cart
  const existingProduct = cartProducts.find(p => p.id === productId);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cartProducts.push({
      id: productId,
      name: productName,
      price: productPrice,
      img: productImg,
      quantity: 1
    });
  }
  
localStorage.setItem("cart", JSON.stringify(cartProducts));

// When removing a product
cartProducts = cartProducts.filter(p => p.id !== item.id);
localStorage.setItem("cart", JSON.stringify(cartProducts));
renderCartItems();


  renderCartItems();

  // Show cart panel after adding
  if (cartPanel) {
    cartPanel.classList.add('active');
    cartPanel.setAttribute('aria-hidden', 'false');
  }
});


});
