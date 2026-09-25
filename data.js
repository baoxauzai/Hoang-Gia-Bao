/**
 * GMAK GAMING GEAR - PRODUCT DATA REPOSITORY
 * Chứa mảng dữ liệu sản phẩm (Array of Objects)
 * Đạt chuẩn Y1.2:
 * - 3 nhóm: Sản phẩm mới (moi), Sản phẩm hot (hot), Sản phẩm khuyến mãi (khuyenmai)
 * - Tối thiểu: Tên, Giá, Hình ảnh, Nút xem chi tiết / Thêm giỏ
 * - Mở rộng: Thông số switch, DPI, kết nối wired/wireless, đánh giá rating
 */

const GMAK_PRODUCTS = [
  // =================== NHÓM 1: SẢN PHẨM MỚI (moi) ===================
  {
    id: 'gmak-p1',
    name: 'Bàn phím cơ GMAK Rainy 75 Pro (Anodized Aluminum)',
    category: 'keyboard',
    group: 'moi',
    price: 2450000,
    originalPrice: 2850000,
    discount: 14,
    image: 'assets/images/p1-rainy75.svg',
    specs: {
      switch: 'HMX Violet Linear',
      layout: '75% (81 phím + Knob)',
      connection: '3-Mode (Type-C / 2.4G / BT 5.0)',
      led: 'RGB 16.8 triệu màu từng phím',
      battery: '7000 mAh (dùng đến 2 tháng)',
      keycap: 'PBT Doubleshot Cherry Profile'
    },
    shortSpec: 'HMX Violet • 3-Mode Wireless',
    rating: 4.9,
    reviewsCount: 38,
    description: 'Phiên bản Rainy 75 Pro khung nhôm CNC nguyên khối trứ danh. Âm thanh clacky đanh giòn, gasket mount 5 lớp tiêu âm cực đỉnh, núm xoay kim loại đa năng.'
  },
  {
    id: 'gmak-p2',
    name: 'Bàn phím cơ GMAK LP GM68 Low Profile Ultra-Slim',
    category: 'keyboard',
    group: 'moi',
    price: 1390000,
    originalPrice: 1650000,
    discount: 16,
    image: 'assets/images/p2-lpgm68.svg',
    specs: {
      switch: 'Gateron Low Profile Red/Blue',
      layout: '68 phím siêu gọn nhẹ',
      connection: 'Wireless 2.4GHz & Bluetooth',
      led: 'White Backlight 15 chế độ',
      battery: '3000 mAh',
      keycap: 'PBT Ultra-Thin'
    },
    shortSpec: 'Low Profile Red • Siêu mỏng 16mm',
    rating: 4.7,
    reviewsCount: 22,
    description: 'Bàn phím cơ Low Profile siêu mỏng nhẹ chỉ 16mm, lý tưởng cho góc làm việc tối giản và game thủ di động thường xuyên mang theo laptop.'
  },
  {
    id: 'gmak-p3',
    name: 'Chuột Gaming GMAK G4Pro Superlight 49g PAW3395',
    category: 'mouse',
    group: 'moi',
    price: 1250000,
    originalPrice: 1550000,
    discount: 19,
    image: 'assets/images/p3-g4pro.svg',
    specs: {
      sensor: 'PixArt PAW3395 Flagship',
      dpi: '26,000 DPI (650 IPS, 50G)',
      switch: 'Huano Blue Pink Dot 80M',
      connection: 'Wireless 2.4GHz & Type-C',
      weight: '49 gram siêu nhẹ không lỗ',
      pollingRate: '4000Hz Support'
    },
    shortSpec: 'PAW3395 26K • 49g Superlight',
    rating: 4.9,
    reviewsCount: 54,
    description: 'Chuột gaming thi đấu chuyên nghiệp trọng lượng siêu nhẹ 49g, mắt đọc PAW3395 26K DPI chuẩn xác từng milimet, feet chuột 100% PTFE lướt cực êm.'
  },
  {
    id: 'gmak-p8',
    name: 'Bàn phím cơ GMAK Phantom 98 Tri-mode Gasket',
    category: 'keyboard',
    group: 'moi',
    price: 1890000,
    originalPrice: 2190000,
    discount: 14,
    image: 'assets/images/p8-phantom98.svg',
    specs: {
      switch: 'Outemu White Jade Tactile',
      layout: '98 phím (Có Numpad kế thừa)',
      connection: '3-Mode (Dây, 2.4G, Bluetooth)',
      led: 'RGB South-facing rực rỡ',
      battery: '4000 mAh',
      keycap: 'MDA Profile PBT Dye-sub'
    },
    shortSpec: 'Tactile Switch • Đầy đủ Numpad',
    rating: 4.8,
    reviewsCount: 19,
    description: 'Sự kết hợp hoàn hảo giữa kích thước gọn gàng và cụm phím số Numpad tiện lợi cho cả chơi game MOBA/MMO lẫn làm việc văn phòng.'
  },

  // =================== NHÓM 2: SẢN PHẨM BÁN CHẠY (hot) ===================
  {
    id: 'gmak-p4',
    name: 'Bàn phím cơ GMAK Reaper 87 Esport Red Switch',
    category: 'keyboard',
    group: 'hot',
    price: 990000,
    originalPrice: 1290000,
    discount: 23,
    image: 'assets/images/p4-reaper87.svg',
    specs: {
      switch: 'GMAK Custom Optical Red (45g)',
      layout: 'Tenkeyless (TKL 87 phím)',
      connection: 'Có dây Type-C bọc dù 1.8m',
      led: 'RGB Chroma 18 hiệu ứng',
      pollingRate: '1000Hz / 1ms response',
      keycap: 'ABS Double-shot xuyên LED'
    },
    shortSpec: 'Optical Red • 1ms Tốc độ cao',
    rating: 4.8,
    reviewsCount: 142,
    description: 'Bàn phím cơ quốc dân dành cho phòng máy và tuyển thủ CS:GO, Valorant. Switch quang học phản hồi 1ms siêu tốc, độ bền 100 triệu lần nhấn.'
  },
  {
    id: 'gmak-p5',
    name: 'Bàn phím cơ GMAK Thunderstrike X RGB Fullsize',
    category: 'keyboard',
    group: 'hot',
    price: 1550000,
    originalPrice: 1950000,
    discount: 20,
    image: 'assets/images/p5-thunderstrike.svg',
    specs: {
      switch: 'Cherry MX Blue/Brown/Red',
      layout: 'Fullsize 104 phím tiêu chuẩn',
      connection: 'Dây cáp bọc dù mạ vàng',
      led: 'RGB Per-key + Viền Aura Light',
      wristRest: 'Kê tay đệm da hít nam châm',
      keycap: 'PBT Doubleshot'
    },
    shortSpec: 'Cherry MX • Kê tay nam châm',
    rating: 4.7,
    reviewsCount: 88,
    description: 'Bàn phím Fullsize cao cấp trang bị kê tay da cao cấp từ tính, nút xoay âm lượng đa phương tiện, hoàn hảo cho góc máy gaming hầm hố.'
  },
  {
    id: 'gmak-p6',
    name: 'Chuột Gaming GMAK Mamba Ultra 8K Polling Rate',
    category: 'mouse',
    group: 'hot',
    price: 890000,
    originalPrice: 1190000,
    discount: 25,
    image: 'assets/images/p6-mambaultra.svg',
    specs: {
      sensor: 'PMW3389 Pro Esport',
      dpi: '16,000 DPI tuỳ chỉnh 6 mức',
      switch: 'Omron 50M siêu nhạy',
      connection: 'Dây cáp bện Paracord siêu mềm',
      weight: '62g công thái học tay phải',
      pollingRate: '8000Hz (0.125ms cực nhạy)'
    },
    shortSpec: 'PMW3389 • 8000Hz Tần số quét',
    rating: 4.8,
    reviewsCount: 96,
    description: 'Chuột thi đấu FPS đỉnh cao với tần số phản hồi 8000Hz nhanh gấp 8 lần chuột thông thường, loại bỏ hoàn toàn độ trễ điều khiển.'
  },
  {
    id: 'gmak-p9',
    name: 'Chuột Gaming GMAK Viper Pro 4K Wireless',
    category: 'mouse',
    group: 'hot',
    price: 1690000,
    originalPrice: 2050000,
    discount: 18,
    image: 'assets/images/p9-viper4k.svg',
    specs: {
      sensor: 'PixArt PAW3395 Nordic 52840',
      dpi: '26,000 DPI thực tế',
      switch: 'Optical Switches 90M chống double click',
      connection: 'Dongle 4KHz đi kèm + Type-C',
      weight: '53g',
      battery: '80 giờ chơi liên tục'
    },
    shortSpec: '4K Dongle • Optical Switch 90M',
    rating: 4.9,
    reviewsCount: 67,
    description: 'Trang bị sẵn Dongle 4KHz không dây trong hộp, switch quang học chống hiện tượng double-click vĩnh viễn, thiết kế đối xứng thích hợp mọi kiểu cầm.'
  },

  // =================== NHÓM 3: SẢN PHẨM KHUYẾN MÃI (khuyenmai) ===================
  {
    id: 'gmak-p7',
    name: 'Bàn phím GMAK CyberKey 61 (Tặng Lót Chuột XXL)',
    category: 'keyboard',
    group: 'khuyenmai',
    price: 690000,
    originalPrice: 1100000,
    discount: 37,
    image: 'assets/images/p7-cyberkey61.svg',
    specs: {
      switch: 'GMAK Custom Yellow Linear',
      layout: 'Mini 60% (61 phím)',
      connection: 'Có dây Type-C tháo rời',
      led: 'Rainbow Gaming 12 chế độ',
      gift: 'Lót chuột Speed 900x400mm trị giá 200k',
      keycap: 'ABS Xuyên LED'
    },
    shortSpec: 'Yellow Switch • Tặng Pad XXL 90x40',
    rating: 4.6,
    reviewsCount: 115,
    description: 'Ưu đãi sốc mùa tựu trường: Mua bàn phím mini 60% phím linear gõ siêu êm, nhận ngay lót chuột gaming khổ lớn bo viền chống trượt trị giá 200.000đ.'
  },
  {
    id: 'gmak-p10',
    name: 'Combo GMAK Cyber Starter (Bàn phím + Chuột RGB)',
    category: 'keyboard',
    group: 'khuyenmai',
    price: 1090000,
    originalPrice: 1890000,
    discount: 42,
    image: 'assets/images/p10-cyberstarter.svg',
    specs: {
      bundle: '1 Phím cơ TKL + 1 Chuột 7200 DPI',
      switch: 'Blue Switch Clicky vui tai',
      connection: 'USB Dây dù đồng bộ',
      led: 'Đồng bộ RGB Sync',
      warranty: '24 tháng 1 đổi 1'
    },
    shortSpec: 'Combo 2 Món • Giảm sốc 42%',
    rating: 4.8,
    reviewsCount: 204,
    description: 'Bộ đôi khởi động góc máy gaming chiến mọi tựa game LOL, FIFA, Valorant với mức giá tiết kiệm hơn 800k so với mua lẻ từng món.'
  },
  {
    id: 'gmak-p11',
    name: 'Chuột GMAK Neon Blade Honeycomb Wireless',
    category: 'mouse',
    group: 'khuyenmai',
    price: 590000,
    originalPrice: 950000,
    discount: 38,
    image: 'assets/images/p11-neonblade.svg',
    specs: {
      sensor: 'PMW3325 Gaming Sensor',
      dpi: '10,000 DPI (6 nấc tùy chỉnh)',
      switch: 'Huano 20M clicks',
      connection: 'Wireless 2.4G nano receiver',
      weight: '58g thiết kế tổ ong thoáng khí',
      led: 'RGB Matrix bên trong vỏ'
    },
    shortSpec: 'Vỏ tổ ong 58g • RGB Matrix',
    rating: 4.5,
    reviewsCount: 78,
    description: 'Thiết kế vỏ lỗ tổ ong thoáng khí chống mồ hôi tay khi try-hard trong thời gian dài. Hiệu ứng LED RGB ma trận tỏa sáng cực đẹp mắt.'
  },
  {
    id: 'gmak-p12',
    name: 'Bàn phím cơ GMAK Apex 65 Gasket Aluminum',
    category: 'keyboard',
    group: 'khuyenmai',
    price: 1750000,
    originalPrice: 2350000,
    discount: 26,
    image: 'assets/images/p12-apex65.svg',
    specs: {
      switch: 'KTT Strawberry Cream Linear',
      layout: '65% (67 phím có điều hướng)',
      connection: '3-Mode Wireless Hot-swap 5-pin',
      led: 'RGB từng phím mạch xuôi',
      battery: '4000 mAh',
      plate: 'FR4 Flex-cut gõ cực nhún'
    },
    shortSpec: 'KTT Strawberry • Mạch xuôi Hot-swap',
    rating: 4.9,
    reviewsCount: 43,
    description: 'Flash sale giới hạn chỉ 30 chiếc: Bàn phím cơ gasket mount mạch xuôi không cấn keycap cherry, switch KTT bôi trơn sẵn tại xưởng êm ru.'
  }
];

// Helper functions for data access
function getProductById(id) {
  return GMAK_PRODUCTS.find(p => p.id === id);
}

function getProductsByGroup(group) {
  if (!group || group === 'all') return GMAK_PRODUCTS;
  return GMAK_PRODUCTS.filter(p => p.group === group);
}

function getProductsByCategory(category) {
  if (!category || category === 'all') return GMAK_PRODUCTS;
  return GMAK_PRODUCTS.filter(p => p.category === category);
}

function formatPrice(number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}
