# Kích hoạt admin — bản Firestore, không cần Cloud Functions

Dự án: `little-lingua-ab674`. Tài khoản được chỉ định:

- Email: `tungba5808@gmail.com`
- UID: `jhZjxzGCY7MCbyYjfRIwdSfAUZ62`

## Thao tác chủ dự án cần làm

1. Mở https://console.firebase.google.com/ bằng tài khoản sở hữu dự án và chọn **little-lingua-ab674**.
2. Vào **Firestore Database → Rules** (hoặc **Databases & Storage → Firestore → Rules**). Sao lưu rules đang dùng. Sao chép **toàn bộ** file `firestore.rules` trong repo này, thay toàn bộ nội dung trình soạn thảo rồi nhấn **Publish**. Không chỉ dán một đoạn admin vào rules cũ. Không bật public read/write.
3. Mở lại https://johnson4208.github.io/pokemon-duel/ hoặc tải lại trang. Đăng xuất rồi đăng nhập bằng **tungba5808@gmail.com**. Trong **Settings / Cài đặt → Quản trị tài khoản**, nhấn **Kiểm tra quyền admin**, nhập mã `admin2026` rồi nhấn **Mở khóa**.
4. Nhập email đã đăng ký của người học → **Tìm người dùng**. Kiểm tra tên/email/số sao, nhập số sao mới và lý do rồi **Lưu số sao mới**. Đóng Settings hoặc nhấn **Khóa lại** khi xong.

Không cần nâng gói Blaze, thẻ thanh toán, Functions, secret hay service-account key cho bản này. Firebase Authentication và Firestore vẫn chịu hạn mức thông thường của dự án. Nếu đã ở gói Blaze vì mục đích khác, thay đổi này không tự hủy các dịch vụ có phí đang dùng.

UID và email phải cùng khớp token đăng nhập. Không thể cấp quyền chỉ bằng mã mở khóa hoặc tự sửa giao diện trình duyệt. Mã `admin2026` là bước mở giao diện, có trong mã nguồn công khai; nó không phải bí mật hay lớp xác thực máy chủ. Quyền thật được kiểm tra bởi Firestore Rules ở mọi lần đọc/ghi.

## Nếu chưa tìm thấy người học

Hồ sơ cũ chưa có email sẽ được bổ sung từ Firebase Auth khi người đó đăng nhập bản web mới. Yêu cầu người học **đăng xuất rồi đăng nhập lại**, sau đó tìm lại đúng email. Không tìm tài khoản demo. Không có quyền miễn phí phía trình duyệt để liệt kê danh sách Firebase Authentication của tất cả người dùng.

Tìm kiếm sử dụng email lưu trong hồ sơ lần đồng bộ đăng nhập gần nhất. Nếu chủ dự án đổi/xóa tài khoản trực tiếp trong Authentication, cần cho người học đăng nhập lại hoặc xử lý hồ sơ cũ trong Console. Nếu trùng email ở nhiều hồ sơ, ứng dụng dừng chỉnh sửa để chủ dự án kiểm tra, không tự chọn một UID.

Nếu Kiểm tra quyền hoặc lưu sao báo permission-denied: kiểm tra đúng dự án, đúng UID/email và rules mới đã Publish. Rules có thể cần vài phút để cập nhật trên các kết nối đang mở; đăng xuất, tải lại và đăng nhập lại. Không đổi sang test-mode/public rules để khắc phục.

## Bảo vệ dữ liệu

- Người học chỉ đọc/sửa hồ sơ của chính mình theo các thao tác học, cài đặt và mua vật phẩm hợp lệ. Họ chỉ được đồng bộ email khớp email trong token Auth, không được gán email của người khác hay tự sửa số sao/điều chỉnh admin.
- Admin mở một phiên `adminSessions/{UID}` bằng timestamp máy chủ. Rules cho phiên tối đa 15 phút; nhập lại mã để mở phiên mới. Phiên mới thay thế khóa phiên trước, nên tab cũ cần mở khóa lại để lưu sao. Đồng hồ trình duyệt không thể kéo dài hạn máy chủ.
- Số sao mới phải nguyên trong khoảng 0–1.000.000. Giao dịch chỉ đổi `stars`, `adminStarAdjustment`, `lastAdminAdjustment`; giữ nguyên tiến độ, `totalEarned`, `totalSpent`, vật phẩm và thông tin cá nhân. Công thức: `stars = totalEarned - totalSpent + (adminStarAdjustment hoặc 0)`.
- Mọi lần chỉnh phải tạo receipt `adminStarAudit/{requestId}` khớp UID admin/người học, email người học, số trước/sau, lý do, timestamp máy chủ và khóa phiên. Rules bắt buộc ví và receipt được ghi nguyên tử. Không ai qua client, kể cả admin, được sửa/xóa receipt đã tạo.
- Nếu số dư hoặc email đổi sau lúc tìm, thao tác dừng và yêu cầu tìm lại. Gửi lại cùng requestId với cùng nội dung trả về receipt cũ, không tăng/giảm sao lần hai.
- Người dùng thường không đọc được hồ sơ người khác, nhật ký hay phiên admin. Admin chỉ đọc hồ sơ người học khi phiên còn hạn. Đóng Settings xóa trạng thái mở khóa trên trình duyệt và gửi yêu cầu khóa phiên. Nếu mất mạng, phiên máy chủ vẫn tự hết hạn. Khi đăng xuất, trạng thái cục bộ được xóa; phiên máy chủ có thể còn đến khi hết 15 phút.
- Thu hồi quyền bằng cách thay UID/email trong `designatedAdmin()` của rules rồi Publish; cập nhật cùng thay đổi trong `admin-model.mjs` và push để giao diện khớp. Xóa riêng document phiên chỉ khóa phiên hiện tại, không thu hồi quyền mở phiên mới.

## Kiểm tra

`node --test *.test.mjs` kiểm tra ví, nhận diện admin, đồng bộ email/khả năng dùng rules cũ và các tính năng hiện có. Test rules được bỏ qua nếu chưa bật Emulator.

Để kiểm tra quyền thực tế bằng Emulator trên máy phát triển:

```sh
npm install --prefix /tmp/lingua-admin-verify @firebase/rules-unit-testing firebase
firebase emulators:exec --only firestore --project demo-lingua-admin 'node --test admin-rules.test.mjs'
```

Test rules dùng dự án demo, không kết nối dữ liệu production. Bao phủ UID/email giả, phiên hết hạn, email giả mạo, tăng/giảm sao, retry, số dư cũ, receipt không khớp/thiếu, sửa/xóa nhật ký, học/mua sau điều chỉnh. Trước khi tuyên bố hoạt động production, chủ dự án cần Publish rules và kiểm tra bằng tài khoản thật trên hai thiết bị.

Tài liệu: https://firebase.google.com/docs/rules/manage-deploy ; https://firebase.google.com/docs/firestore/manage-data/transactions ; https://firebase.google.com/docs/firestore/security/rules-conditions .
