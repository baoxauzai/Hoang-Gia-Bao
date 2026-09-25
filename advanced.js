/**
 * GMAK GAMING GEAR - ADVANCED FEATURES MODULE
 * 
 * 1. Y1.6: Countdown Clock Flash Sale Gaming Gear
 * 2. Y1.7 - Tự đề xuất 1: Bộ lọc thông số chuyên sâu (Switch/DPI, Kết nối, Giá, Sort)
 * 3. Y1.7 - Tự đề xuất 2: So sánh sản phẩm (Compare tối đa 3 sản phẩm dạng bảng)
 * 4. Y1.7 - Tự đề xuất 3: Hệ thống đánh giá sao 1-5★ & Bình luận lưu LocalStorage
 * 5. Y1.6 Extra: Geolocation Showroom Locator (Gợi ý showroom gần nhất)
 */

/* ==========================================================================
   1. COUNTDOWN CLOCK FLASH SALE (Y1.6)
   ========================================================================== */
function initFlashSaleCountdown() {
  const daysEl = document.getElementById('countdownDays');
  const hoursEl = document.getElementById('countdownHours');
  const minsEl = document.getElementById('countdownMins');
  const secsEl = document.getElementById('countdownSecs');

  if (!hoursEl || !minsEl || !secsEl) return;

  // Lấy hoặc tạo mốc thời gian kết thúc sale (24h kể từ lần đầu truy cập)
  let targetTime = localStorage.getItem('gmak_flash_sale_end');
  const now = new Date().getTime();

  if (!targetTime || parseInt(targetTime, 10) <= now) {
    // Đặt chu kỳ Flash Sale mới 24 tiếng tới
    const newTarget = now + (24 * 60 * 60 * 1000);
    localStorage.setItem('gmak_flash_sale_end', newTarget);
    targetTime = newTarget;
  } else {
    targetTime = parseInt(targetTime, 10);
  }

  function updateClock() {
    const currentTime = new Date().getTime();
    const distance = targetTime - currentTime;

    if (distance <= 0) {
      // Hết giờ -> tạo chu kỳ sale mới 24h tiếp theo
      const nextTarget = currentTime + (24 * 60 * 60 * 1000);
      localStorage.setItem('gmak_flash_sale_end', nextTarget);
      targetTime = nextTarget;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   2. TỰ ĐỀ XUẤT 1: BỘ LỌC SẢN PHẨM & TÌM KIẾM THEO THÔNG SỐ (Prompt 7)
   ========================================================================== */
const ProductFilterState = {
  category: 'all',     // all, keyboard, mouse
  connection: 'all',   // all, wired, wireless
  priceRange: 'all',   // all, under-1m, 1m-2m, over-2m
  sortBy: 'default',   // default, price-asc, price-desc, name-az, rating
  searchQuery: ''
};

function filterAndSortProducts(productsList) {
  return productsList.filter(product => {
    // 1. Lọc theo danh mục
    if (ProductFilterState.category !== 'all' && product.category !== ProductFilterState.category) {
      return false;
    }

    // 2. Lọc theo kết nối (wired vs wireless)
    if (ProductFilterState.connection !== 'all') {
      const isWireless = product.specs.connection && (
        product.specs.connection.toLowerCase().includes('wireless') || 
        product.specs.connection.toLowerCase().includes('2.4g') ||
        product.specs.connection.toLowerCase().includes('bluetooth') ||
        product.specs.connection.toLowerCase().includes('3-mode')
      );
      if (ProductFilterState.connection === 'wireless' && !isWireless) return false;
      if (ProductFilterState.connection === 'wired' && isWireless && !product.specs.connection.toLowerCase().includes('type-c tháo rời')) {
        // Chỉ chọn nếu là thuần có dây
        if (!product.specs.connection.toLowerCase().includes('có dây') && !product.specs.connection.toLowerCase().includes('usb dây')) {
          return false;
        }
      }
    }

    // 3. Lọc theo khoảng giá
    if (ProductFilterState.priceRange === 'under-1m' && product.price >= 1000000) return false;
    if (ProductFilterState.priceRange === '1m-2m' && (product.price < 1000000 || product.price > 2000000)) return false;
    if (ProductFilterState.priceRange === 'over-2m' && product.price <= 2000000) return false;

    // 4. Lọc theo từ khóa tìm kiếm
    if (ProductFilterState.searchQuery) {
      const q = ProductFilterState.searchQuery.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(q);
      const matchSpec = product.shortSpec ? product.shortSpec.toLowerCase().includes(q) : false;
      const matchDesc = product.description.toLowerCase().includes(q);
      if (!matchName && !matchSpec && !matchDesc) return false;
    }

    return true;
  }).sort((a, b) => {
    // Sắp xếp
    if (ProductFilterState.sortBy === 'price-asc') return a.price - b.price;
    if (ProductFilterState.sortBy === 'price-desc') return b.price - a.price;
    if (ProductFilterState.sortBy === 'name-az') return a.name.localeCompare(b.name);
    if (ProductFilterState.sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });
}

/* ==========================================================================
   3. TỰ ĐỀ XUẤT 2: SO SÁNH SẢN PHẨM (Tối đa 3 món) (Prompt 8)
   ========================================================================== */
const COMPARE_KEY = 'gmak_compare_items_v1';

function getCompareList() {
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCompareList(list) {
  try {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
    updateCompareUI();
  } catch (e) {
    console.error(e);
  }
}

function toggleCompareProduct(productId) {
  let list = getCompareList();
  const exists = list.includes(productId);

  if (exists) {
    list = list.filter(id => id !== productId);
    showToast('Đã xóa sản phẩm khỏi danh sách so sánh.', 'info');
  } else {
    if (list.length >= 3) {
      showToast('Bạn chỉ có thể so sánh tối đa 3 sản phẩm cùng lúc!', 'error');
      return;
    }
    list.push(productId);
    showToast('Đã thêm sản phẩm vào danh sách so sánh!', 'success');
  }

  saveCompareList(list);
}

function clearCompareList() {
  saveCompareList([]);
  showToast('Đã dọn sạch danh sách so sánh.', 'info');
}

function updateCompareUI() {
  const bar = document.getElementById('compareBar');
  const slotsContainer = document.getElementById('compareSlots');
  const list = getCompareList();

  // Cập nhật TẤT CẢ các badge đếm so sánh trên trang (có thể có nhiều)
  document.querySelectorAll('#compareCount').forEach(badge => {
    badge.textContent = list.length;
    badge.style.display = list.length > 0 ? 'flex' : 'none';
  });

  if (!bar) return;

  if (list.length > 0) {
    bar.classList.add('show');

    if (slotsContainer) {
      slotsContainer.innerHTML = [0, 1, 2].map(index => {
        const pId = list[index];
        if (pId) {
          const product = getProductById(pId);
          return `
            <div class="compare-slot">
              <img src="${product.image}" alt="${product.name}">
              <button class="slot-remove" onclick="toggleCompareProduct('${product.id}')">✕</button>
            </div>
          `;
        }
        return `<div class="compare-slot" style="color: var(--text-muted); font-size: 0.8rem;">+</div>`;
      }).join('');
    }
  } else {
    bar.classList.remove('show');
  }
}

function openCompareModal() {
  const list = getCompareList();
  if (list.length === 0) {
    showToast('Chưa có sản phẩm nào để so sánh!', 'error');
    return;
  }

  const modal = document.getElementById('compareModal');
  const content = document.getElementById('compareModalBody');
  if (!modal || !content) return;

  const products = list.map(id => getProductById(id)).filter(Boolean);

  content.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h3 style="font-family: var(--font-heading); color: var(--neon-cyan); font-size: 1.4rem;">
        BẢNG ĐỐI CHIẾU THÔNG SỐ GAMING GEAR
      </h3>
      <p style="color: var(--text-muted); font-size: 0.9rem;">So sánh trực quan chi tiết ${products.length} sản phẩm đang chọn.</p>
    </div>
    <div style="overflow-x: auto;">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Tiêu chí so sánh</th>
            ${products.map(p => `
              <td style="text-align: center;">
                <img src="${p.image}" style="width: 100px; height: 75px; object-fit: cover; margin: 0 auto 10px; border-radius: 6px;">
                <h4 style="font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 6px;">${p.name}</h4>
                <div style="color: var(--neon-cyan); font-family: var(--font-heading); font-weight: 800; font-size: 1.1rem; margin-bottom: 8px;">
                  ${formatPrice(p.price)}
                </div>
                <button class="btn btn-primary btn-sm" onclick="handleAddToCart('${p.id}', 1); closeCompareModal();">
                  + Thêm giỏ
                </button>
              </td>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Phân loại Gear</th>
            ${products.map(p => `<td>${p.category === 'keyboard' ? 'Bàn phím cơ' : 'Chuột Esport'}</td>`).join('')}
          </tr>
          <tr>
            <th>Switch / Cảm biến</th>
            ${products.map(p => `<td>${p.specs.switch || p.specs.sensor || 'GMAK Custom'}</td>`).join('')}
          </tr>
          <tr>
            <th>Kết nối</th>
            ${products.map(p => `<td>${p.specs.connection || 'Type-C'}</td>`).join('')}
          </tr>
          <tr>
            <th>Thông số nổi bật</th>
            ${products.map(p => `<td>${p.specs.dpi || p.specs.layout || p.specs.bundle || 'Đạt chuẩn thi đấu'}</td>`).join('')}
          </tr>
          <tr>
            <th>Trọng lượng / Pin</th>
            ${products.map(p => `<td>${p.specs.weight || p.specs.battery || 'Chuẩn công thái học'}</td>`).join('')}
          </tr>
          <tr>
            <th>Đánh giá khách hàng</th>
            ${products.map(p => `<td>★ ${p.rating} / 5 (${p.reviewsCount} nhận xét)</td>`).join('')}
          </tr>
        </tbody>
      </table>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCompareModal() {
  const modal = document.getElementById('compareModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   4. TỰ ĐỀ XUẤT 3: ĐÁNH GIÁ VÀ RATING SAO TƯƠNG TÁC (Prompt 9)
   ========================================================================== */
function getProductReviews(productId) {
  try {
    const raw = localStorage.getItem(`gmak_reviews_${productId}`);
    return raw ? JSON.parse(raw) : [
      { name: 'Nguyễn Tuấn Anh (Pro Gamer)', rating: 5, date: '15/09/2026', comment: 'Sản phẩm hoàn thiện quá tốt trong tầm giá, switch gõ cực êm mượt, không hề có độ trễ.' },
      { name: 'Trần Minh Đức', rating: 5, date: '18/09/2026', comment: 'Đóng gói cẩn thận 2 lớp, chuột cầm vừa tay 49g lướt pad sướng vô cùng!' }
    ];
  } catch (e) {
    return [];
  }
}

function saveProductReview(productId, reviewObj) {
  const reviews = getProductReviews(productId);
  reviews.unshift(reviewObj);
  localStorage.setItem(`gmak_reviews_${productId}`, JSON.stringify(reviews));
  return reviews;
}

function setupReviewStarsInteraction() {
  const starContainer = document.getElementById('starRatingSelect');
  const ratingInput = document.getElementById('selectedRatingInput');
  if (!starContainer || !ratingInput) return;

  const stars = starContainer.querySelectorAll('.star');

  stars.forEach((star, index) => {
    // Hover effect
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, i) => s.classList.toggle('hover', i <= index));
    });

    star.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.remove('hover'));
    });

    // Click select
    star.addEventListener('click', () => {
      const val = index + 1;
      ratingInput.value = val;
      stars.forEach((s, i) => s.classList.toggle('selected', i < val));
    });
  });
}

function handleReviewSubmit(e, productId) {
  e.preventDefault();
  const nameInput = document.getElementById('reviewAuthor');
  const commentInput = document.getElementById('reviewContent');
  const ratingInput = document.getElementById('selectedRatingInput');

  if (!nameInput || !commentInput) return;

  const author = nameInput.value.trim();
  const comment = commentInput.value.trim();
  const rating = parseInt(ratingInput ? ratingInput.value : 5, 10) || 5;

  if (!author || !comment) {
    showToast('Vui lòng nhập họ tên và nhận xét của bạn.', 'error');
    return;
  }

  const newReview = {
    name: author,
    rating: rating,
    date: new Date().toLocaleDateString('vi-VN'),
    comment: comment
  };

  saveProductReview(productId, newReview);
  showToast('Cảm ơn bạn đã gửi đánh giá cho sản phẩm GMAK!', 'success');

  // Reset form
  nameInput.value = '';
  commentInput.value = '';
  
  // Re-render danh sách nhận xét
  renderReviewsList(productId);
}

function renderReviewsList(productId) {
  const listEl = document.getElementById('reviewsListContainer');
  const avgEl = document.getElementById('reviewsAverageDisplay');
  if (!listEl) return;

  const reviews = getProductReviews(productId);
  if (reviews.length === 0) {
    listEl.innerHTML = '<p style="color: var(--text-muted);">Chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm!</p>';
    return;
  }

  const sumRating = reviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = (sumRating / reviews.length).toFixed(1);

  if (avgEl) {
    avgEl.innerHTML = `
      <span style="font-size: 2.2rem; font-family: var(--font-heading); color: var(--neon-yellow);">${avg}</span> / 5.0
      <div style="color: var(--text-muted); font-size: 0.85rem;">Dựa trên ${reviews.length} đánh giá thực tế từ game thủ</div>
    `;
  }

  listEl.innerHTML = reviews.map(r => `
    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 16px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <strong style="color: var(--neon-cyan);">${r.name}</strong>
        <span style="color: var(--text-muted); font-size: 0.8rem;">${r.date}</span>
      </div>
      <div style="color: var(--neon-yellow); margin-bottom: 8px; font-size: 0.9rem;">
        ${renderStarsHtml(r.rating)}
      </div>
      <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5;">${r.comment}</p>
    </div>
  `).join('');
}

/* ==========================================================================
   5. GEOLOCATION SHOWROOM FINDER (Y1.6)
   ========================================================================== */
const GMAK_SHOWROOMS = [
  { name: 'GMAK Flagship Store Hà Nội', lat: 21.0285, lng: 105.8542, address: 'Số 68 Đường Cầu Giấy, Q. Cầu Giấy, Hà Nội', phone: '1900 6868' },
  { name: 'GMAK Esport Hub TP.HCM', lat: 10.7769, lng: 106.7009, address: 'Số 135 Nguyễn Thị Minh Khai, P. Bến Thành, Q.1, TP.HCM', phone: '1900 8686' }
];

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
}

function findNearestShowroom() {
  const resultBox = document.getElementById('geoResultBox');
  if (!resultBox) return;

  if (!navigator.geolocation) {
    resultBox.innerHTML = '<span style="color: var(--neon-pink);">Trình duyệt của bạn không hỗ trợ Geolocation.</span>';
    return;
  }

  resultBox.innerHTML = '<span style="color: var(--neon-cyan);">Đang quét định vị GPS của bạn...</span>';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      let nearest = null;
      let minDistance = Infinity;

      GMAK_SHOWROOMS.forEach(store => {
        const dist = parseFloat(calculateDistanceKm(userLat, userLng, store.lat, store.lng));
        if (dist < minDistance) {
          minDistance = dist;
          nearest = { ...store, distance: dist };
        }
      });

      resultBox.innerHTML = `
        <div style="background: rgba(0, 240, 255, 0.1); border: 1px solid var(--neon-cyan); border-radius: 8px; padding: 16px; margin-top: 12px;">
          <h4 style="color: var(--neon-cyan); font-family: var(--font-heading); margin-bottom: 6px;">
            📍 SHOWROOM GẦN BẠN NHẤT (${nearest.distance} KM)
          </h4>
          <p style="font-weight: 700; color: #fff;">${nearest.name}</p>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">${nearest.address}</p>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">Hotline trải nghiệm: <strong>${nearest.phone}</strong></p>
        </div>
      `;
    },
    (error) => {
      resultBox.innerHTML = `<span style="color: var(--neon-pink);">Không thể lấy vị trí (${error.message}). Bạn có thể xem danh sách showroom bên dưới.</span>`;
    }
  );
}

/* ==========================================================================
   QUICK VIEW MODAL (Xem nhanh sản phẩm)
   ========================================================================== */
function openQuickView(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const modal = document.getElementById('quickViewModal');
  const body = document.getElementById('quickViewBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div style="background: #090d14; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto;">
      </div>
      <div>
        <span style="font-family: var(--font-tech); color: var(--neon-cyan); font-weight: 700; letter-spacing: 2px;">
          ${product.category === 'keyboard' ? 'BÀN PHÍM CƠ' : 'CHUỘT GAMING'}
        </span>
        <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin: 8px 0 12px; color: #fff;">
          ${product.name}
        </h3>
        <div style="color: var(--neon-cyan); font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; margin-bottom: 12px;">
          ${formatPrice(product.price)}
          ${product.originalPrice ? `<span style="font-size: 0.9rem; color: var(--text-muted); text-decoration: line-through; margin-left: 10px;">${formatPrice(product.originalPrice)}</span>` : ''}
        </div>
        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5; margin-bottom: 16px;">
          ${product.description}
        </p>
        <div style="background: var(--bg-card); padding: 12px; border-radius: 6px; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 20px;">
          <strong>Thông số chính:</strong> ${product.shortSpec || 'Đạt chuẩn thi đấu Esport'}
        </div>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-primary" onclick="handleAddToCart('${product.id}', 1); closeQuickView();">
            + THÊM VÀO GIỎ
          </button>
          <a href="product-detail.html?id=${product.id}" class="btn btn-outline">
            CHI TIẾT ĐẦY ĐỦ →
          </a>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Khởi chạy các thành phần nâng cao
document.addEventListener('DOMContentLoaded', () => {
  initFlashSaleCountdown();
  updateCompareUI();
});
