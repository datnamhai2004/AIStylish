import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Paypage.css";

const locations = {
    "Hà Nội": [
      "Ba Đình", "Hoàn Kiếm", "Tây Hồ", "Long Biên", "Cầu Giấy", "Đống Đa", "Hai Bà Trưng", "Hoàng Mai", "Thanh Xuân",
      "Sóc Sơn", "Đông Anh", "Gia Lâm", "Nam Từ Liêm", "Thanh Trì", "Bắc Từ Liêm", "Mê Linh", "Hà Đông"
    ],
    "TP Hồ Chí Minh": [
      "Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10",
      "Quận 11", "Quận 12", "Bình Tân", "Bình Thạnh", "Gò Vấp", "Phú Nhuận", "Tân Bình", "Tân Phú", "Thủ Đức"
    ],
    "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu", "Hòa Vang"],
  "Hải Phòng": ["Hồng Bàng", "Lê Chân", "Ngô Quyền", "Hải An", "Dương Kinh"],
  "Cần Thơ": ["Ninh Kiều", "Bình Thủy", "Cái Răng", "Ô Môn", "Thốt Nốt"],
  "An Giang": ["Long Xuyên", "Châu Đốc", "Tân Châu", "Châu Thành"],
  "Bà Rịa - Vũng Tàu": ["Bà Rịa", "Vũng Tàu", "Xuyên Mộc", "Châu Đức"],
  "Bắc Giang": ["Bắc Giang", "Yên Thế", "Lục Nam", "Hiệp Hòa"],
  "Bắc Kạn": ["Bắc Kạn", "Na Rì", "Ba Bể", "Chợ Đồn"],
  "Bạc Liêu": ["Bạc Liêu", "Hồng Dân", "Giá Rai", "Phước Long"],
  "Bắc Ninh": ["Bắc Ninh", "Quế Võ", "Gia Bình", "Thuận Thành"],
  "Bến Tre": ["Bến Tre", "Châu Thành", "Mỏ Cày", "Ba Tri"],
  "Bình Định": ["Quy Nhơn", "An Nhơn", "Hoài Nhơn", "Phù Cát"],
  "Bình Dương": ["Thủ Dầu Một", "Thuận An", "Dĩ An", "Tân Uyên"],
  "Bình Phước": ["Đồng Xoài", "Bình Long", "Phước Long", "Lộc Ninh"],
  "Bình Thuận": ["Phan Thiết", "La Gi", "Tuy Phong", "Bắc Bình"],
  "Cà Mau": ["Cà Mau", "Năm Căn", "Ngọc Hiển", "Cái Nước"],
  "Cao Bằng": ["Cao Bằng", "Bảo Lạc", "Trùng Khánh", "Nguyên Bình"],
  "Đắk Lắk": ["Buôn Ma Thuột", "Buôn Hồ", "Ea Kar", "Krông Pắc"],
  "Đắk Nông": ["Gia Nghĩa", "Đắk Mil", "Cư Jút", "Đắk Glong"],
  "Điện Biên": ["Điện Biên Phủ", "Mường Lay", "Mường Chà", "Tuần Giáo"],
  "Đồng Nai": ["Biên Hòa", "Long Khánh", "Nhơn Trạch", "Trảng Bom"],
  "Đồng Tháp": ["Cao Lãnh", "Sa Đéc", "Hồng Ngự", "Tam Nông"],
  "Gia Lai": ["Pleiku", "An Khê", "Ayun Pa", "Kbang"],
  "Hà Giang": ["Hà Giang", "Đồng Văn", "Yên Minh", "Mèo Vạc"],
  "Hà Nam": ["Phủ Lý", "Duy Tiên", "Kim Bảng", "Thanh Liêm"],
  "Hà Tĩnh": ["Hà Tĩnh", "Hồng Lĩnh", "Kỳ Anh", "Lộc Hà"],
  "Hải Dương": ["Hải Dương", "Chí Linh", "Nam Sách", "Kinh Môn"],
  "Hậu Giang": ["Vị Thanh", "Ngã Bảy", "Châu Thành A", "Phụng Hiệp"],
  "Hòa Bình": ["Hòa Bình", "Lương Sơn", "Mai Châu", "Tân Lạc"],
  "Hưng Yên": ["Hưng Yên", "Mỹ Hào", "Khoái Châu", "Yên Mỹ"],
  "Khánh Hòa": ["Nha Trang", "Cam Ranh", "Ninh Hòa", "Vạn Ninh"],
  "Kiên Giang": ["Rạch Giá", "Hà Tiên", "Phú Quốc", "Giồng Riềng"],
  "Kon Tum": ["Kon Tum", "Đắk Hà", "Đắk Tô", "Ngọc Hồi"],
  "Lai Châu": ["Lai Châu", "Mường Tè", "Phong Thổ", "Sìn Hồ"],
  "Lâm Đồng": ["Đà Lạt", "Bảo Lộc", "Di Linh", "Lạc Dương"],
  "Lạng Sơn": ["Lạng Sơn", "Cao Lộc", "Văn Lãng", "Hữu Lũng"],
  "Lào Cai": ["Lào Cai", "Sa Pa", "Bát Xát", "Bảo Thắng"],
  "Long An": ["Tân An", "Bến Lức", "Cần Giuộc", "Đức Hòa"],
  "Nam Định": ["Nam Định", "Mỹ Lộc", "Giao Thủy", "Trực Ninh"],
  "Nghệ An": ["Vinh", "Cửa Lò", "Thái Hòa", "Nghi Lộc"],
  "Ninh Bình": ["Ninh Bình", "Tam Điệp", "Gia Viễn", "Hoa Lư"],
  "Ninh Thuận": ["Phan Rang-Tháp Chàm", "Ninh Hải", "Thuận Bắc", "Thuận Nam"],
  "Phú Thọ": ["Việt Trì", "Phú Thọ", "Lâm Thao", "Thanh Sơn"],
  "Phú Yên": ["Tuy Hòa", "Sông Cầu", "Đồng Xuân", "Sơn Hòa"],
  "Quảng Bình": ["Đồng Hới", "Ba Đồn", "Quảng Trạch", "Tuyên Hóa"],
  "Quảng Nam": ["Tam Kỳ", "Hội An", "Điện Bàn", "Duy Xuyên"],
  "Quảng Ngãi": ["Quảng Ngãi", "Đức Phổ", "Ba Tơ", "Bình Sơn"],
  "Quảng Ninh": ["Hạ Long", "Cẩm Phả", "Móng Cái", "Uông Bí"],
  "Quảng Trị": ["Đông Hà", "Quảng Trị", "Hải Lăng", "Triệu Phong"],
  "Sóc Trăng": ["Sóc Trăng", "Vĩnh Châu", "Trần Đề", "Ngã Năm"],
  "Sơn La": ["Sơn La", "Mộc Châu", "Mai Sơn", "Thuận Châu"],
  "Tây Ninh": ["Tây Ninh", "Hòa Thành", "Trảng Bàng", "Tân Châu"],
  "Thái Bình": ["Thái Bình", "Kiến Xương", "Tiền Hải", "Vũ Thư"],
  "Thái Nguyên": ["Thái Nguyên", "Sông Công", "Phổ Yên", "Định Hóa"],
  "Thanh Hóa": ["Thanh Hóa", "Bỉm Sơn", "Sầm Sơn", "Tĩnh Gia"],
  "Thừa Thiên Huế": ["Huế", "Hương Trà", "Phú Lộc", "Phong Điền"],
  "Tiền Giang": ["Mỹ Tho", "Gò Công", "Cai Lậy", "Cái Bè"],
  "Trà Vinh": ["Trà Vinh", "Duyên Hải", "Tiểu Cần", "Cầu Ngang"],
  "Tuyên Quang": ["Tuyên Quang", "Chiêm Hóa", "Lâm Bình", "Hàm Yên"],
  "Vĩnh Long": ["Vĩnh Long", "Bình Minh", "Trà Ôn", "Long Hồ"],
  "Vĩnh Phúc": ["Vĩnh Yên", "Phúc Yên", "Tam Đảo", "Yên Lạc"],
  "Yên Bái": ["Yên Bái", "Nghĩa Lộ", "Lục Yên", "Văn Chấn"],
};
  

const Paypage = () => {
  const [orderItems, setOrderItems] = useState([]);
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [customerInfo, setCustomerInfo] = useState({
    name: storedUser ? storedUser.name : "",
    email: storedUser ? storedUser.email : "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    shippingMethod: "standard",
    paymentMethod: "cod",
  });

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("cart")) || [];
    setOrderItems(storedOrder);
  }, []);

  const totalAmount = orderItems.reduce((total, item) => total + item.totalPrice, 0);

  // Cập nhật thông tin khách hàng
  const handleInputChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  // Cập nhật danh sách quận/huyện khi chọn thành phố
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCustomerInfo({ ...customerInfo, city: selectedCity, district: "" });
  };

  // Xử lý thanh toán
  const handleConfirmPayment = () => {
    if (!customerInfo.phone || !customerInfo.address || !customerInfo.city || !customerInfo.district) {
      alert("Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }

    alert(`Thanh toán thành công! Cảm ơn bạn đã mua hàng.`);
    localStorage.removeItem("cart");
    navigate("/");
  };

  return (
    <div className="paypage-container">
      <div className="paypage">
        {/* THÔNG TIN GIAO HÀNG */}
        <div className="customer-info">
          <h2>Thông tin giao hàng</h2>
          <input type="text" name="name" value={customerInfo.name} readOnly />
          <input type="email" name="email" value={customerInfo.email} readOnly />
          <input type="text" name="phone" placeholder="Số điện thoại" value={customerInfo.phone} onChange={handleInputChange} required />

          {/* Chọn thành phố */}
          <select name="city" value={customerInfo.city} onChange={handleCityChange} required>
            <option value="">Chọn thành phố</option>
            {Object.keys(locations).map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          {/* Chọn quận/huyện */}
          <select name="district" value={customerInfo.district} onChange={handleInputChange} required>
            <option value="">Chọn quận/huyện</option>
            {customerInfo.city && locations[customerInfo.city]?.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>

          {/* Nhập phường/xã */}
          <input type="text" name="ward" placeholder="Nhập phường/xã" value={customerInfo.ward} onChange={handleInputChange} required />
        {/* Nhập Địa chỉ cụ thể  */}
          <input type="text" name="address" placeholder="Địa chỉ cụ thể" value={customerInfo.address} onChange={handleInputChange} required />

          {/* PHƯƠNG THỨC VẬN CHUYỂN */}
          <h3>Phương thức vận chuyển</h3>
          <select name="shippingMethod" value={customerInfo.shippingMethod} onChange={handleInputChange}>
            <option value="standard">Giao hàng tiêu chuẩn (3-5 ngày)</option>
            <option value="express">Giao hàng nhanh (1-2 ngày)</option>
          </select>
        </div>

        {/* GIỎ HÀNG */}
        <div className="order-summary">
          <h2>Đơn hàng của bạn</h2>
          <ul className="order-list">
            {orderItems.map((item, index) => (
              <li key={index} className="order-item">
                <img src={item.img} alt={item.name} className="order-image" />
                <div className="order-info">
                  <p className="order-name">{item.name}</p>
                  <p className="order-price">Giá: {item.price}</p>
                  <p className="order-total">Tổng: ₫{item.totalPrice.toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* CHỌN PHƯƠNG THỨC THANH TOÁN */}
          <h3>Phương thức thanh toán</h3>
          <div className="payment-method">
            <label>
              <input type="radio" name="paymentMethod" value="cod" checked={customerInfo.paymentMethod === "cod"} onChange={handleInputChange} />
              Thanh toán khi nhận hàng (COD)
            </label>
            <label>
              <input type="radio" name="paymentMethod" value="qr" checked={customerInfo.paymentMethod === "qr"} onChange={handleInputChange} />
              Thanh toán qua mã QR ngân hàng
            </label>
          </div>

          {/* NẾU CHỌN THANH TOÁN QR HIỂN THỊ ẢNH */}
          {customerInfo.paymentMethod === "qr" && (
            <div className="qr-payment">
              <p>Quét mã QR để thanh toán:</p>
              <img src="/qr-code.png" alt="QR Code Thanh Toán" />
            </div>
          )}

          {/* HIỂN THỊ TỔNG TIỀN VÀ THANH TOÁN */}
          <div className="payment-summary">
            <h3>Tổng thanh toán: <span className="total-amount">₫{totalAmount.toLocaleString()}</span></h3>
            <button className="confirm-payment-btn" onClick={handleConfirmPayment}>Xác nhận thanh toán</button>
          </div>
        </div>
      </div>

      {/* NÚT QUAY LẠI TRANG CHỦ */}
      <button className="back-btn" onClick={() => navigate("/")}>Quay lại trang chủ</button>
    </div>
  );
};

export default Paypage;
