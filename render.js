/**
 * GMAK GAMING GEAR - RENDER ENGINE
 * Phụ trách render giao diện HTML động từ mảng dữ liệu (Prompt 2 & Y1.2)
 * Hỗ trợ hiệu ứng box sản phẩm, zoom ảnh, action buttons, rating stars
 */

// Hàm tạo HTML hiển thị ngôi sao đánh giá
function renderStarsHtml(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let starsHtml = '';

  for (let i = 0; i < fullStars; i++) {
    starsHtml += '★';
  }
  if (hasHalfStar) {
    starsHtml += '★';
  }
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '☆';
  }

  return starsHtml;
}

// Hàm render một card sản phẩm hoàn chỉnh
function createProductCardHtml(product) {
  // Xác định badge theo nhóm
  let badgeHtml = '';
  if (product.group === 'moi') {
    badgeHtml = '<span class="card-badge badge-new">MỚI RA MẮT</span>';
  } else if (product.group === 'hot') {
    badgeHtml = '<span class="card-badge badge-hot">BÁN CHẠY 🔥</span>';
  } else if (product.group === 'khuyenmai') {
    badgeHtml = `<span class="card-badge badge-sale">-${product.discount || 25}%</span>`;
  }

  // Label danh mục
  const catLabel = product.category === 'keyboard' ? 'BÀN PHÍM CƠ' : 'CHUỘT GAMING';

  return `
    <article class="product-card" data-id="${product.id}" data-category="${product.category}">
      ${badgeHtml}
      
      <div class="card-img-wrap">
        <a href="product-detail.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </a>
        <div class="card-actions">
          <button class="btn-icon-action" title="Xem nhanh" onclick="openQuickView('${product.id}')">
            👁️
          </button>
          <button class="btn-icon-action" title="So sánh sản phẩm" onclick="toggleCompareProduct('${product.id}')">
            ⚖️
          </button>
          <a href="product-detail.html?id=${product.id}" class="btn-icon-action" title="Chi tiết sản phẩm">
            🔍
          </a>
        </div>
      </div>

      <div class="card-body">
        <div class="card-category">${catLabel}</div>
        <h3 class="card-title">
          <a href="product-detail.html?id=${product.id}">${product.name}</a>
        </h3>

        <div class="card-specs">
          <span class="spec-pill">${product.shortSpec || ''}</span>
        </div>

        <div class="card-rating">
          <span class="stars">${renderStarsHtml(product.rating)}</span>
          <span class="rating-num">(${product.rating} / ${product.reviewsCount} vote)</span>
        </div>

        <div class="card-price-box">
          <div class="price-values">
            <span class="current-price">${formatPrice(product.price)}</span>
            ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
          </div>
          <button class="card-cart-btn" title="Thêm vào giỏ hàng" onclick="handleAddToCart('${product.id}', 1)">
            🛒
          </button>
        </div>
      </div>
    </article>
  `;
}

// Hàm render danh sách sản phẩm vào một container bất kỳ
function renderProducts(containerId, productList) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!productList || productList.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <p style="font-size: 1.2rem; font-family: var(--font-heading); margin-bottom: 8px;">Không tìm thấy sản phẩm phù hợp</p>
        <p>Vui lòng thử lại với từ khoá hoặc tiêu chí lọc khác.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = productList.map(p => createProductCardHtml(p)).join('');
}
