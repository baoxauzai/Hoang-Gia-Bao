/**
 * GMAK GAMING GEAR - MAIN APP CONTROLLER
 * Điều khiển luồng hoạt động chính của website, kết nối các module
 */

// Toast notification helper
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '⚡';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '⚠️';
  if (type === 'info') icon = 'ℹ️';

  toast.innerHTML = `
    <span style="font-size: 1.2rem;">${icon}</span>
    <span style="font-size: 0.9rem; font-weight: 500;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Khởi tạo các sự kiện chung
document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // 2. Sticky Header Scroll Effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 3. Xử lý mở/đóng Giỏ hàng từ nút Header
  const cartBtn = document.getElementById('headerCartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  const closeCartBtn = document.getElementById('closeCartDrawer');
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCartDrawer);
  }

  const cartOverlay = document.getElementById('cartDrawerOverlay');
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCartDrawer);
  }

  // 4. Router logic theo từng trang
  initCurrentPage();
});

// Điều phối khởi tạo theo từng trang cụ thể
function initCurrentPage() {
  const path = window.location.pathname.toLowerCase();

  if (path.includes('products.html')) {
    initCatalogPage();
  } else if (path.includes('product-detail.html')) {
    initProductDetailPage();
  } else if (path.includes('contact.html')) {
    initContactPage();
  } else {
    // Mặc định là Trang chủ index.html
    initHomePage();
  }
}

/* ==========================================================================
   TRANG CHỦ (index.html)
   ========================================================================== */
function initHomePage() {
  // Render 3 nhóm sản phẩm chính theo Y1.2:
  // 1. Sản phẩm mới
  renderProducts('gridNewProducts', getProductsByGroup('moi'));
  
  // 2. Sản phẩm hot / bán chạy
  renderProducts('gridHotProducts', getProductsByGroup('hot'));

  // 3. Sản phẩm khuyến mãi Flash Sale
  renderProducts('gridSaleProducts', getProductsByGroup('khuyenmai'));

  // Tabs lọc nhanh trên trang chủ
  const tabs = document.querySelectorAll('.product-tabs .tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const group = tab.getAttribute('data-group');
      const filtered = getProductsByGroup(group);
      renderProducts('gridFeaturedProducts', filtered);
    });
  });

  // Render danh sách nổi bật mặc định
  renderProducts('gridFeaturedProducts', GMAK_PRODUCTS);
}

/* ==========================================================================
   TRANG DANH MỤC SẢN PHẨM (products.html)
   ========================================================================== */
function initCatalogPage() {
  const containerId = 'catalogProductsGrid';
  const searchInput = document.getElementById('catalogSearch');
  const sortSelect = document.getElementById('catalogSort');
  const categoryInputs = document.querySelectorAll('input[name="categoryFilter"]');
  const connectionInputs = document.querySelectorAll('input[name="connectionFilter"]');
  const priceInputs = document.querySelectorAll('input[name="priceFilter"]');
  const resetBtn = document.getElementById('resetFiltersBtn');

  // Đọc category từ URL query (nếu có: ?cat=keyboard hoặc ?cat=mouse)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    ProductFilterState.category = catParam;
    categoryInputs.forEach(input => {
      if (input.value === catParam) input.checked = true;
    });
  }

  function applyFilters() {
    const filtered = filterAndSortProducts(GMAK_PRODUCTS);
    renderProducts(containerId, filtered);

    // Cập nhật số lượng sản phẩm hiển thị
    const countEl = document.getElementById('catalogProductCount');
    if (countEl) {
      countEl.textContent = `Hiển thị ${filtered.length} sản phẩm`;
    }
  }

  // Lắng nghe thay đổi tìm kiếm (live search)
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      ProductFilterState.searchQuery = e.target.value;
      applyFilters();
    });
  }

  // Lắng nghe thay đổi sắp xếp
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      ProductFilterState.sortBy = e.target.value;
      applyFilters();
    });
  }

  // Lắng nghe chọn danh mục
  categoryInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      if (e.target.checked) {
        ProductFilterState.category = e.target.value;
        applyFilters();
      }
    });
  });

  // Lắng nghe chọn kết nối
  connectionInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      if (e.target.checked) {
        ProductFilterState.connection = e.target.value;
        applyFilters();
      }
    });
  });

  // Lắng nghe chọn khoảng giá
  priceInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      if (e.target.checked) {
        ProductFilterState.priceRange = e.target.value;
        applyFilters();
      }
    });
  });

  // Nút đặt lại bộ lọc
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      ProductFilterState.category = 'all';
      ProductFilterState.connection = 'all';
      ProductFilterState.priceRange = 'all';
      ProductFilterState.searchQuery = '';
      ProductFilterState.sortBy = 'default';

      if (searchInput) searchInput.value = '';
      if (sortSelect) sortSelect.value = 'default';
      
      document.querySelector('input[name="categoryFilter"][value="all"]').checked = true;
      document.querySelector('input[name="connectionFilter"][value="all"]').checked = true;
      document.querySelector('input[name="priceFilter"][value="all"]').checked = true;

      applyFilters();
      showToast('Đã đặt lại toàn bộ bộ lọc!', 'info');
    });
  }

  applyFilters();
}

/* ==========================================================================
   TRANG CHI TIẾT SẢN PHẨM (product-detail.html)
   ========================================================================== */
function initProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'gmak-p1';
  const product = getProductById(productId);

  if (!product) {
    document.getElementById('detailContainer').innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <h2 style="font-family: var(--font-heading); color: var(--neon-pink); margin-bottom: 16px;">Sản phẩm không tồn tại</h2>
        <a href="products.html" class="btn btn-primary">QUAY LẠI CỬA HÀNG</a>
      </div>
    `;
    return;
  }

  // Điền dữ liệu vào giao diện chi tiết
  document.title = `${product.name} - GMAK Gaming Gear`;
  const imgEl = document.getElementById('detailMainImg');
  const titleEl = document.getElementById('detailTitle');
  const priceEl = document.getElementById('detailPrice');
  const oldPriceEl = document.getElementById('detailOldPrice');
  const descEl = document.getElementById('detailDesc');
  const specsTableEl = document.getElementById('detailSpecsTable');
  const catBreadcrumb = document.getElementById('detailCatBreadcrumb');

  if (imgEl) imgEl.src = product.image;
  if (titleEl) titleEl.textContent = product.name;
  if (priceEl) priceEl.textContent = formatPrice(product.price);
  if (oldPriceEl && product.originalPrice) {
    oldPriceEl.textContent = formatPrice(product.originalPrice);
  }
  if (descEl) descEl.textContent = product.description;
  if (catBreadcrumb) {
    catBreadcrumb.textContent = product.category === 'keyboard' ? 'Bàn phím cơ' : 'Chuột gaming';
    catBreadcrumb.href = `products.html?cat=${product.category}`;
  }

  // Render bảng thông số kỹ thuật chi tiết
  if (specsTableEl && product.specs) {
    specsTableEl.innerHTML = Object.entries(product.specs).map(([key, val]) => `
      <tr>
        <td style="text-transform: capitalize;">${key}</td>
        <td>${val}</td>
      </tr>
    `).join('');
  }

  // Điều khiển tăng giảm số lượng mua
  const qtyInput = document.getElementById('detailQty');
  const btnPlus = document.getElementById('detailQtyPlus');
  const btnMinus = document.getElementById('detailQtyMinus');

  if (btnPlus && qtyInput) {
    btnPlus.addEventListener('click', () => {
      qtyInput.value = parseInt(qtyInput.value, 10) + 1;
    });
  }
  if (btnMinus && qtyInput) {
    btnMinus.addEventListener('click', () => {
      const val = parseInt(qtyInput.value, 10);
      if (val > 1) qtyInput.value = val - 1;
    });
  }

  // Nút thêm vào giỏ hàng
  const addCartBtn = document.getElementById('detailAddToCartBtn');
  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
      addToCart(product.id, qty);
    });
  }

  // Nút so sánh nhanh
  const compareBtn = document.getElementById('detailCompareBtn');
  if (compareBtn) {
    compareBtn.addEventListener('click', () => {
      toggleCompareProduct(product.id);
    });
  }

  // Khởi tạo đánh giá sao và danh sách nhận xét
  setupReviewStarsInteraction();
  renderReviewsList(product.id);

  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => handleReviewSubmit(e, product.id));
  }

  // Render sản phẩm cùng loại liên quan
  const related = GMAK_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  renderProducts('gridRelatedProducts', related);
}

/* ==========================================================================
   TRANG LIÊN HỆ (contact.html)
   ========================================================================== */
function initContactPage() {
  const geoBtn = document.getElementById('btnFindShowroom');
  if (geoBtn) {
    geoBtn.addEventListener('click', findNearestShowroom);
  }
}
