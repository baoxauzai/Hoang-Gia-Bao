/**
 * GMAK GAMING GEAR - FORM VALIDATION ENGINE (JS THUẦN)
 * Đáp ứng Y1.4:
 * - Kiểm tra dữ liệu rỗng (Required fields)
 * - Kiểm tra định dạng Email hợp lệ (Regex standard)
 * - Kiểm tra định dạng Số điện thoại Việt Nam (10 chữ số)
 * - Hiển thị phản hồi lỗi trực quan (Border đỏ + Text thông báo)
 * - Tự động xóa lỗi khi người dùng chỉnh sửa trường (Live feedback)
 */

class FormValidator {
  constructor(formElement, customRules = {}) {
    this.form = typeof formElement === 'string' ? document.querySelector(formElement) : formElement;
    if (!this.form) return;

    this.rules = customRules;
    this.init();
  }

  init() {
    this.form.setAttribute('novalidate', 'true');

    // Lắng nghe sự kiện submit
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validateAll()) {
        this.onSuccess();
      }
    });

    // Lắng nghe sự kiện input/blur để xóa lỗi tức thì
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.clearError(input));
      input.addEventListener('blur', () => this.validateField(input));
    });
  }

  // Regex kiểm tra email chuẩn
  static isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  // Regex kiểm tra số điện thoại Việt Nam (đầu 03, 05, 07, 08, 09 hoặc +84)
  static isValidPhoneVN(phone) {
    const cleaned = phone.replace(/[\s.-]/g, '');
    const re = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
    return re.test(cleaned);
  }

  // Kiểm tra một trường đơn lẻ
  validateField(input) {
    const name = input.name || input.id;
    const value = input.value.trim();
    const group = input.closest('.form-group') || input.parentElement;

    // 1. Kiểm tra bắt buộc nhập (Required)
    if (input.hasAttribute('required') && !value) {
      this.showError(input, 'Trường này không được để trống.');
      return false;
    }

    // Nếu không required và rỗng thì pass
    if (!value && !input.hasAttribute('required')) {
      this.clearError(input);
      return true;
    }

    // 2. Kiểm tra độ dài tối thiểu
    const minLength = input.getAttribute('minlength');
    if (minLength && value.length < parseInt(minLength, 10)) {
      this.showError(input, `Vui lòng nhập tối thiểu ${minLength} ký tự.`);
      return false;
    }

    // 3. Kiểm tra kiểu Email
    if (input.type === 'email' || name.toLowerCase().includes('email')) {
      if (!FormValidator.isValidEmail(value)) {
        this.showError(input, 'Email không đúng định dạng (VD: gamer@gmak.vn).');
        return false;
      }
    }

    // 4. Kiểm tra kiểu Phone
    if (input.type === 'tel' || name.toLowerCase().includes('phone') || name.toLowerCase().includes('sdt')) {
      if (!FormValidator.isValidPhoneVN(value)) {
        this.showError(input, 'Số điện thoại không hợp lệ (10 số, đầu 03, 05, 07, 08, 09).');
        return false;
      }
    }

    // Nếu vượt qua tất cả kiểm tra
    this.showSuccess(input);
    return true;
  }

  // Kiểm tra toàn bộ các trường trong form
  validateAll() {
    let isValid = true;
    const inputs = this.form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      const fieldValid = this.validateField(input);
      if (!fieldValid && isValid) {
        input.focus(); // Focus vào trường lỗi đầu tiên
        isValid = false;
      }
    });

    return isValid;
  }

  // Hiển thị lỗi
  showError(input, message) {
    const group = input.closest('.form-group');
    input.classList.remove('success');
    input.classList.add('error');

    if (group) {
      group.classList.add('has-error');
      let errorSpan = group.querySelector('.error-message');
      if (!errorSpan) {
        errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        group.appendChild(errorSpan);
      }
      errorSpan.textContent = message;
    }
  }

  // Đánh dấu trường hợp lệ
  showSuccess(input) {
    input.classList.remove('error');
    input.classList.add('success');
    const group = input.closest('.form-group');
    if (group) {
      group.classList.remove('has-error');
    }
  }

  // Xóa trạng thái lỗi khi đang nhập
  clearError(input) {
    input.classList.remove('error');
    const group = input.closest('.form-group');
    if (group) {
      group.classList.remove('has-error');
    }
  }

  // Callback khi submit thành công
  onSuccess() {
    showToast('🎉 Gửi thông tin thành công! Tư vấn viên GMAK sẽ liên hệ bạn ngay.', 'success');
    this.form.reset();
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => input.classList.remove('success', 'error'));
  }
}

// Tự động khởi tạo cho các form có class .validate-form
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.validate-form');
  forms.forEach(form => new FormValidator(form));
});
