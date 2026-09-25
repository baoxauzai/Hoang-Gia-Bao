/**
 * GMAK GAMING GEAR - CART ENGINE (JS THUẦN & LOCALSTORAGE)
 * Đáp ứng Y1.5:
 * - Thêm sản phẩm vào giỏ hàng
 * - Xoá sản phẩm
 * - Thay đổi số lượng (tăng/giảm/nhập trực tiếp)
 * - Dữ liệu giỏ hàng lưu bằng LocalStorage
 * - Reload trang không mất dữ liệu
 * - Đồng bộ icon giỏ hàng trên Header & Drawer giỏ hàng trượt
 */

const CART_STORAGE_KEY = 'gmak_shopping_cart_v1';

// Lấy danh sách sản phẩm trong giỏ từ LocalStorage
function getCartItems() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Lỗi đọc giỏ hàng từ localStorage:', e);
    return [];
  }
}

// Lưu giỏ hàng vào LocalStorage
function saveCartItems(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
  } catch (e) {
    console.error('Lỗi lưu giỏ hàng vào localStorage:', e);
  }
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId, quantity = 1) {
  const product = getProductById(productId);
  if (!product) {
    showToast('Không tìm thấy thông tin sản phẩm!', 'error');
    return;
  }

  let cart = getCartItems();
  const existingItemIndex = cart.findIndex(item => item.id === productId);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += Number(quantity);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: Number(quantity)
    });
  }

  saveCartItems(cart);
  showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
  openCartDrawer();
}

// Xoá sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
  let cart = getCartItems();
  const item = cart.find(i => i.id === productId);
  cart = cart.filter(item => item.id !== productId);
  saveCartItems(cart);
  
  if (item) {
    showToast(`Đã xoá "${item.name}" khỏi giỏ hàng!`, 'info');
  }
}

// Cập nhật số lượng sản phẩm
function updateCartQuantity(productId, newQty) {
  const qty = parseInt(newQty, 10);
  if (isNaN(qty) || qty <= 0) {
    removeFromCart(productId);
    return;
  }

  let cart = getCartItems();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = qty;
    saveCartItems(cart);
  }
}

// Tính tổng số lượng món hàng trong giỏ
function getCartTotalCount() {
  const cart = getCartItems();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Tính tổng giá trị đơn hàng
function getCartTotalPrice() {
  const cart = getCartItems();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Cập nhật toàn bộ giao diện liên quan đến giỏ hàng
function updateCartUI() {
  // 1. Cập nhật số lượng trên badge Header
  const badges = document.querySelectorAll('.cart-count-badge');
  const totalCount = getCartTotalCount();
  badges.forEach(b => {
    b.textContent = totalCount;
    b.style.display = totalCount > 0 ? 'flex' : 'none';
  });

  // 2. Render nội dung trong Drawer Giỏ Hàng
  const drawerBody = document.getElementById('cartDrawerBody');
  const drawerTotal = document.getElementById('cartDrawerTotal');
  const cart = getCartItems();

  if (drawerBody) {
    if (cart.length === 0) {
      drawerBody.innerHTML = `
        <div class="cart-empty-state">
          <div style="font-size: 3rem; margin-bottom: 12px;">🛒</div>
          <p style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-primary); margin-bottom: 6px;">Giỏ hàng của bạn đang trống</p>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">Hãy dạo qua các mẫu gear gaming để chọn món đồ yêu thích nhé!</p>
          <a href="products.html" class="btn btn-outline btn-sm" onclick="closeCartDrawer()">KHÁM PHÁ NGAY</a>
        </div>
      `;
    } else {
      drawerBody.innerHTML = cart.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <h4 class="cart-item-name">${item.name}</h4>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
            <div class="cart-qty-ctrl">
              <button class="qty-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
          </div>
          <button class="btn-remove-item" title="Xoá món này" onclick="removeFromCart('${item.id}')">
            🗑️
          </button>
        </div>
      `).join('');
    }
  }

  const totalPrice = getCartTotalPrice();
  if (drawerTotal) {
    drawerTotal.textContent = formatPrice(totalPrice);
  }
  // Đồng bộ subtotal nếu có
  const subTotalEl = document.getElementById('cartDrawerSubtotal');
  if (subTotalEl) {
    subTotalEl.textContent = formatPrice(totalPrice);
  }
}

// Điều khiển mở / đóng Drawer giỏ hàng
function openCartDrawer() {
  const overlay = document.getElementById('cartDrawerOverlay');
  const drawer = document.getElementById('cartDrawer');
  if (overlay && drawer) {
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const overlay = document.getElementById('cartDrawerOverlay');
  const drawer = document.getElementById('cartDrawer');
  if (overlay && drawer) {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Xử lý nút thanh toán nhanh từ Drawer
function handleCheckout() {
  const cart = getCartItems();
  if (cart.length === 0) {
    showToast('Giỏ hàng trống! Vui lòng chọn sản phẩm.', 'error');
    return;
  }
  
  const total = formatPrice(getCartTotalPrice());
  alert(`Cảm ơn bạn đã đặt hàng tại GMAK Gaming Gear!\nTổng giá trị đơn hàng: ${total}\nĐơn hàng đã được lưu và nhân viên GMAK sẽ gọi xác nhận trong 15 phút.`);
  localStorage.removeItem(CART_STORAGE_KEY);
  updateCartUI();
  closeCartDrawer();
}

// Lắng nghe sự kiện toàn cục thêm vào giỏ
function handleAddToCart(productId, qty = 1) {
  addToCart(productId, qty);
}

// Khởi chạy khi load trang
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
});
