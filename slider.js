/**
 * GMAK GAMING GEAR - SLIDER ENGINE (JS THUẦN)
 * Đáp ứng Y1.3:
 * - Slider banner chuyển động bằng JavaScript (không dùng slider tĩnh)
 * - Nút điều khiển Next / Prev
 * - Chấm điều hướng (Dots indicator)
 * - Tự động trượt sau 5 giây (Auto play 5000ms)
 * - Tự dừng khi hover chuột vào banner và chạy tiếp khi rê chuột ra ngoài
 */

class GmakSlider {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.slides = this.container.querySelectorAll('.slide');
    this.dotsContainer = this.container.querySelector('.slider-dots');
    this.btnPrev = this.container.querySelector('.slider-btn.prev');
    this.btnNext = this.container.querySelector('.slider-btn.next');

    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.autoPlayInterval = options.interval || 5000;
    this.timer = null;

    this.init();
  }

  init() {
    if (this.totalSlides <= 1) return;

    // Tạo các chấm tròn (dots) dựa trên số slide
    this.renderDots();

    // Hiển thị slide đầu tiên
    this.goToSlide(0);

    // Bắt sự kiện nút bấm Next / Prev
    if (this.btnPrev) {
      this.btnPrev.addEventListener('click', () => {
        this.prev();
        this.resetTimer();
      });
    }

    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => {
        this.next();
        this.resetTimer();
      });
    }

    // Tự động chuyển sau 5s
    this.startAutoPlay();

    // Tạm dừng khi rê chuột vào slider
    this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.container.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  renderDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('span');
      dot.className = `dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', () => {
        this.goToSlide(i);
        this.resetTimer();
      });
      this.dotsContainer.appendChild(dot);
    }
  }

  goToSlide(index) {
    if (index < 0) {
      this.currentIndex = this.totalSlides - 1;
    } else if (index >= this.totalSlides) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = index;
    }

    // Cập nhật class active cho slide
    this.slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === this.currentIndex);
    });

    // Cập nhật class active cho dot
    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === this.currentIndex);
      });
    }
  }

  next() {
    this.goToSlide(this.currentIndex + 1);
  }

  prev() {
    this.goToSlide(this.currentIndex - 1);
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.timer = setInterval(() => {
      this.next();
    }, this.autoPlayInterval);
  }

  stopAutoPlay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  resetTimer() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}

// Khởi tạo slider khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  const mainSlider = document.querySelector('.slider-container');
  if (mainSlider) {
    window.gmakSliderInstance = new GmakSlider('.slider-container', { interval: 5000 });
  }
});
