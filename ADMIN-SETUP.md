# Kích hoạt quản trị Firebase (chủ nền tảng)

Mã nguồn giao diện đã sẵn sàng; GitHub Pages không tự triển khai Firebase Functions, rules hoặc cấp quyền tài khoản. Chỉ thực hiện các bước dưới đây bằng tài khoản sở hữu dự án `little-lingua-ab674`. Không đưa service-account key, mật khẩu hay mã mở khóa vào mã nguồn công khai.

## Triển khai

1. Cài Node 22 và Firebase CLI trên máy chủ dự án; đăng nhập `firebase login`. Functions cần dự án có gói Blaze; chủ dự án tự quyết định việc bật thanh toán trước khi triển khai.
2. Chạy `npm ci --prefix functions` tại thư mục gốc repo.
3. **Triển khai rules trước khi bật Functions:** `firebase deploy --project little-lingua-ab674 --only firestore:rules`. Rules mới hỗ trợ trường `adminStarAdjustment`; người dùng thường không được sửa trường này. Không chạy Functions điều chỉnh sao với rules cũ: thao tác học/mua sau đó sẽ bị từ chối.
4. Chạy `firebase functions:secrets:set ADMIN_PANEL_CODE --project little-lingua-ab674`. Tại lời nhắc bảo mật, nhập mã đã yêu cầu trong cuộc trò chuyện. Mã chỉ được lưu trong Secret Manager, không ghi vào repo, command line hay cấu hình web. Nếu đổi mã, triển khai lại Function để dùng phiên bản secret mới.
5. Chạy `firebase deploy --project little-lingua-ab674 --only functions:adminPanel`. Endpoint callable ở `us-central1` phải cho phép invoker công khai ở lớp Cloud Run để Firebase callable kiểm tra ID token; ứng dụng vẫn yêu cầu quyền admin ở mọi lời gọi. Không nới quyền Firestore công khai.
6. Trên máy tin cậy của chủ dự án, chuẩn bị Application Default Credentials có quyền Firebase Authentication Admin. Ví dụ dùng `gcloud auth application-default login` và quyền IAM phù hợp; không gửi credentials qua chat hay commit chúng. Người được cấp quyền cần đã đăng ký trên web. Chạy `cd functions`, rồi `node scripts/grant-admin.mjs EMAIL_DA_DANG_KY grant`. Script cố định dự án, tra email bằng Auth Admin SDK và giữ nguyên các custom claims khác.
7. Đăng xuất rồi đăng nhập lại tài khoản admin. Mở **Settings / Cài đặt → Quản trị tài khoản → Kiểm tra quyền admin**, nhập mã để mở khóa. Tìm email người học; kiểm tra tên, email, số sao hiện tại; nhập số sao mới và lý do rồi lưu. Đóng Settings hoặc nhấn Khóa lại sẽ xóa phiên trên trình duyệt; phiên máy chủ tối đa 15 phút.

Thu hồi: `node scripts/grant-admin.mjs EMAIL_DA_DANG_KY revoke`. Máy chủ kiểm tra lại quyền hiện tại và trạng thái tài khoản ở mỗi yêu cầu, không chỉ dựa vào claim cũ trên trình duyệt. Mã mở khóa không tự biến tài khoản thường thành admin.

## Hành vi và kiểm tra sau triển khai

- Tìm email chính xác qua Firebase Auth, không tạo danh bạ email công khai trong Firestore. Không tìm tài khoản demo. Hồ sơ học tập phải tồn tại.
- Số sao mới là số nguyên 0–1.000.000. Ghi số sao cùng `adminStarAdjustment` trong một transaction; `totalEarned`, `totalSpent`, tiến độ và bộ sưu tập được giữ nguyên. Công thức ví: `stars = totalEarned - totalSpent + (adminStarAdjustment hoặc 0)`.
- `adminStarAudit` ghi người chỉnh, người nhận, trước/sau, lý do và thời gian. Nhật ký và phiên quản trị chỉ truy cập bởi máy chủ, không bởi trình duyệt. Giữ nhật ký theo chính sách vận hành của chủ dự án; không công khai collection.
- Nếu số dư đã thay đổi sau lúc tìm kiếm, thao tác bị từ chối. Tìm lại email để xem số dư mới. Retry cùng mã yêu cầu không áp dụng điều chỉnh hai lần.
- Sau 5 lần sai mã trong 15 phút, tài khoản admin cần chờ hết cửa sổ 15 phút. Đăng xuất/chuyển tài khoản xóa trạng thái quản trị cục bộ.
- Kiểm tra bằng 2 tài khoản thực: tài khoản thường không thể mở khóa dù biết mã; admin có thể tăng/giảm số sao người học; người học thấy số mới ở thiết bị thứ hai, học thêm +1 và đổi vật phẩm bình thường; nhật ký tồn tại; thu hồi admin chặn được phiên cũ. Kiểm tra cả điện thoại và máy tính.

## Kiểm tra tự động

`node --test *.test.mjs` kiểm tra service với adapter transaction mô phỏng: quyền, thu hồi, giới hạn thử mã, hết phiên, tìm email, số dư lỗi/thay đổi đồng thời, retry và phép tính ví sau học/mua. Đây không phải kiểm chứng triển khai Firebase thật. `admin-rules.test.mjs` kiểm tra rules trên Emulator khi đặt `FIRESTORE_EMULATOR_HOST`; xem hướng dẫn trong file test. Không tuyên bố tính năng đã hoạt động trên production trước khi hoàn tất bước triển khai và kiểm tra thực tế ở trên.

Tài liệu chính thức: https://firebase.google.com/docs/functions/callable ; https://firebase.google.com/docs/auth/admin/custom-claims ; https://firebase.google.com/docs/functions/config-env .
