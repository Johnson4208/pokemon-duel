# Trình chiếu PDF / PowerPoint trên Little Lingua

Mở **Trình chiếu** trong menu của app (điện thoại: **More → Trình chiếu**) hoặc truy cập `presenter.html` trên cùng website. Không cần tài khoản admin, Firebase Functions, Blaze, Office Online hay dịch vụ chuyển đổi tài liệu.

## Dùng để dạy học

1. Khi còn mạng, mở trang Trình chiếu và chờ **Sẵn sàng offline trên thiết bị này**. Có thể nhấn **Chuẩn bị offline** để tải lại bộ xem; nút này cũng xin trình duyệt giữ dữ liệu lâu dài nếu được hỗ trợ.
2. Chọn **Mở PDF / PowerPoint** hoặc kéo thả PDF / `.pptx`. File hợp lệ sẽ tự lưu bản gốc trong IndexedDB của trình duyệt sau khi trang đầu render thành công. Chọn nhiều file để lưu lần lượt. Một file tối đa 80 MB và 500 trang/slide; `.ppt` cũ cần lưu thành `.pptx` trước.
3. Mở lại từ danh sách **Tài liệu đã lưu**. App khôi phục vị trí trang và nét vẽ. File trùng nội dung không tạo thêm bản sao. Tìm tài liệu theo tên, đổi tên hiển thị hoặc xóa bản lưu khi không còn cần.
4. Dùng nút trái/phải, Page Up / Page Down, Space, Home / End. Có ô nhập số trang và phóng to/thu nhỏ. Nhấn **Trình chiếu** để ẩn danh sách và mở toàn màn hình khi trình duyệt hỗ trợ. Esc hoặc nút **Thoát trình chiếu** để quay lại.
5. Dùng **Bút**, **Tô sáng**, **Con trỏ**, màu vẽ, hoàn tác hoặc xóa nét của trang. Nét vẽ và vị trí trang tự lưu. **Tải file gốc** tải đúng file đã nhập, không gắn nét vẽ vào file tải xuống.

## Lưu file và offline

- Bản gốc, tên, vị trí trang và nét vẽ được lưu **trên trình duyệt/thiết bị hiện tại**, không tải lên server và không đồng bộ giữa máy tính/điện thoại hoặc giữa các trình duyệt. Thư viện dùng chung trong cùng hồ sơ trình duyệt; nó không phải kho file riêng có xác thực theo tài khoản Firebase.
- Tự lưu không có nghĩa là lưu vào một thư mục hệ điều hành mà bạn chọn. Dùng **Tải file gốc** khi cần bản sao riêng. Xóa dữ liệu website, gỡ trình duyệt hoặc dùng chế độ riêng tư có thể làm mất thư viện và ghi chú. Nếu hết dung lượng, app báo **chưa lưu** thay vì hứa đã lưu thành công; thư viện cũ được giữ khi giao dịch lưu bị lỗi.
- Offline cần chuẩn bị một lần trên **từng thiết bị và trình duyệt**. Tất cả trình đọc PDF, worker, bản đồ ký tự, font PDF và trình đọc PowerPoint/biểu đồ được phục vụ cùng website, không lấy từ CDN khi trình chiếu. Service Worker chỉ cache bộ Trình chiếu, không tải cả kho audio hay các tính năng học/đấu Pokémon.
- Mở lại đúng địa chỉ `presenter.html` từ dấu trang khi offline. Sau khi bộ xem đã được cache, vào trang chính trong lúc mất mạng cũng có thể mở bản dự phòng Trình chiếu. Các phần tài khoản/học online khác không được biến thành app offline bởi thay đổi này.
- `presenter.html` là trang độc lập trong cùng app, có lối quay về Little Lingua; không phụ thuộc Firebase hoặc trạng thái đăng nhập để mở file cục bộ.

## PowerPoint

`.pptx` được phân tích và vẽ trực tiếp trên canvas trong trình duyệt. Không chạy macro, không cần upload để chuyển đổi. Các slide được hiển thị tĩnh; font không có trên thiết bị, SmartArt/phần tử phức tạp, video, animation và chuyển cảnh có thể khác hoặc không xuất hiện. Xuất sang PDF nếu buổi dạy cần bố cục giống hoàn toàn bản PowerPoint gốc. File mã hóa/mật khẩu và file không đúng cấu trúc sẽ báo lỗi.

Trang trình chiếu có CSP chỉ cho tải tài nguyên cùng nguồn, ảnh/font nhúng nội bộ; không cho tài liệu gọi tài nguyên web bên ngoài. File được giới hạn kích thước/số trang, và PPTX được kiểm tra tổng dung lượng giải nén trước khi render. Các giới hạn này không bảo đảm mọi slide rất nặng sẽ mượt trên điện thoại yếu.

## Build / triển khai

```sh
npm ci
npm run build:presenter
```

Mã nguồn giao diện nằm ở `presenter.html`, `presenter.css`, `presenter.mjs`; bộ nhớ ở `teaching-store.mjs`. Script build tạo `_site/presenter-vendor/`, `presenter-assets.json` và Service Worker có phiên bản nội dung. Các thư viện đã khóa phiên bản trong package-lock, thông báo bản quyền được gói cùng bộ xem.

GitHub Pages workflow đã cài dependencies, kiểm tra logic, build và kiểm tra trình chiếu bằng browser trước khi publish. Không commit node_modules hoặc `_site`.

```sh
node --test teaching-store.test.mjs
node scripts/build-presenter.mjs
node scripts/test-presenter-browser.mjs
```

Browser test tạo PDF/PPTX giả, kiểm tra vẽ chữ/hình/bảng, tự lưu/khôi phục/nét vẽ, tải đúng byte gốc, toàn màn hình, bàn phím, tải lại hoàn toàn offline và chuyển trang cả hai định dạng, chống trùng nội dung, lỗi file hỏng và giao diện điện thoại. Test dùng localhost, không gửi file vào tài khoản người dùng.

Thư viện: PDF.js (Apache-2.0), PptxViewJS (MIT), JSZip (MIT), Chart.js (MIT). Xem `presenter-vendor/LICENSES.txt` ở bản đã build để có đầy đủ thông báo.
