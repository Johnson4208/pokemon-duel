# Giáo trình và bài kiểm tra — nội dung biên soạn mới

## Phạm vi

24 bài: 12 tiếng Việt, 12 tiếng Trung. Mỗi ngôn ngữ có bốn chặng nội bộ (Khởi đầu, Sơ cấp, Trung cấp, Nâng cao), mỗi chặng ba bài. Đây là chuỗi bài định hướng từ nền tảng đến một số cấu trúc nâng cao; không tuyên bố bao phủ trọn trình độ CEFR, HSK hay chứng chỉ năng lực tiếng Việt.

Mỗi bài có mục tiêu có thể thực hiện, bài nên học trước, 6–8 mục từ trọng tâm, 4 điểm ngữ pháp tiếng Việt hoặc 2 điểm ngữ pháp tiếng Trung với giải thích và ví dụ, đoạn đọc nguyên tác kèm bản dịch, 2–4 bài điền cấu trúc với đáp án giải thích, nhiệm vụ viết và gợi ý ôn lại. Tiếng Trung có pinyin cho từ trọng tâm và nghĩa tiếng Việt. Phần giải thích hiện bằng tiếng Việt, ví dụ kèm bản dịch tiếng Anh.

## Cơ sở tham khảo (tra cứu 16/10/2026, Asia/Shanghai)

- Bộ GD&ĐT, Khung năng lực tiếng Việt dùng cho người nước ngoài: https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=128668 — mô tả giao tiếp tăng dần; không dùng làm bảng phân cấp ngữ pháp cứng. Trang tra cứu trả 403 khi mở toàn văn trong phiên này, chỉ truy xuất được phần mô tả được chỉ mục.
- Chinese Tests Service: https://www.chinesetest.cn/syllabus — tổ chức kết hợp nhiệm vụ, chủ đề, từ vựng, chữ Hán và ngữ pháp; không coi bốn chặng của app là HSK 1–9.
- Council of Europe, CEFR Companion Volume 2020: https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions — mục tiêu theo khả năng thực hiện; tăng từ câu đơn đến đoạn nối ý và lập luận.
- Julian K. Wheatley, MIT OCW, Learning Chinese: A Foundation Course in Mandarin: https://www.ocw.mit.edu/courses/res-21g-003-learning-chinese-a-foundation-course-in-mandarin-spring-2011/pages/online-textbook/part-ii-units-5-7-character-lessons-4-6/ — đối chiếu trình tự phát âm, V+de, V+guò, liên kết câu; Unit 3 được đọc để đối chiếu lượng từ, câu hỏi và nguyên nhân: https://ocw.mit.edu/courses/res-21g-003-learning-chinese-a-foundation-course-in-mandarin-spring-2011/7413ef603a88dea457928c1f6f8230bc_MITRES_21G_003S11_unit03.pdf
- Binh Ngo, Vietnamese: An Essential Grammar, Routledge 2020: https://www.routledge.com/Vietnamese-An-Essential-Grammar/Ngo/p/book/9781315454610 — tham khảo mô tả và mục lục từ nhà xuất bản về danh ngữ, động ngữ, câu và phát âm; không truy cập được toàn văn sách trong phiên này.

Toàn bộ giải thích, ví dụ, đoạn đọc và bài tập mới trong app được biên soạn riêng; không sao chép bài đọc giáo trình nguồn. Nội dung cần tiếp tục được giáo viên rà soát khi dùng làm giáo trình chính thức.

## Tạo bài kiểm tra

Nút ＋ chỉ nằm trên topbar; mở hộp thoại lớp phủ trên trang hiện tại, có ghi chú hướng dẫn. Không có mục tạo bài kiểm tra trong sidebar hoặc menu More. Đóng bằng nút Đóng hoặc Escape để trở lại trang trước; nội dung đang nhập được giữ khi chỉ đóng lớp phủ. Có thể chọn từ thư viện hiện có hoặc chọn nhiều bài giảng; từ trùng được gộp, đồng thời vẫn giữ liên hệ với các bài. Bộ từ được chụp lại trong bài kiểm tra để lần làm sau không phụ thuộc thay đổi danh mục.

- Điền nghĩa: tiếng Việt → tiếng Anh; tiếng Trung → tiếng Việt hoặc tiếng Anh. Khi chọn nghĩa tiếng Việt chỉ hiện từ có bản dịch đã biên soạn.
- Tráo chữ tiếng Việt: các ký tự được xáo lại, ký hiệu ␣ thể hiện khoảng trắng. Người học gõ lại đúng từ/cụm từ có dấu.
- Viết theo chủ đề: bật tùy chọn, chủ đề lấy từ bài đầu tiên đã chọn hoặc tự viết; không có chấm điểm tự luận giả lập. Bài làm có bốn tiêu chí tự đánh giá.
- Đáp án chỉ hiển thị trong giao diện sau khi nộp. Chấm tự động chuẩn hóa Unicode, hoa/thường, khoảng trắng và dấu câu; giữ dấu thanh. Các nghĩa phân cách bằng / được chấp nhận. Đây là đối chiếu đáp án thư viện, không phải bộ đánh giá ngữ nghĩa toàn diện.
- Không cấp sao tự động cho bài kiểm tra tùy tạo.

## Lưu trữ

Danh sách hoàn thành bài học, tối đa 20 bài kiểm tra và kết quả gần nhất được lưu ở localStorage theo UID tài khoản (hoặc guest). Nội dung này chưa dùng Firestore và không tự đồng bộ thiết bị. Có tải/nhập file JSON để chuyển bài giữa trình duyệt; bài làm và kết quả cũng có thể tải riêng. File bài kiểm tra chứa đáp án để phục vụ luyện tập, không phải cơ chế bảo mật thi cử.

Dữ liệu hiển thị được escape; file nhập giới hạn kích thước, số câu, loại câu hỏi và độ dài trường. Bài làm được xóa khỏi DOM khi đổi tài khoản.

## Kiểm tra bản cập nhật

- 47/47 kiểm thử Node hiện có và mới đều qua.
- Chromium: luồng khách → giáo trình → chọn bài → tạo kiểm tra → nộp và xem kết quả chạy ở 1440 px, 390 px, 320 px; không có lỗi JavaScript hay tràn ngang ở màn hình kiểm tra.
- Đối chiếu nghĩa tiếng Việt cho tiếng Trung, tráo chữ tiếng Việt, lưu bài viết và điểm phần tự động đã được kiểm tra; các kiểm tra này không thay thế thử nghiệm đăng nhập trên thiết bị vật lý.

## Nâng cấp liên kết tiếng Việt (16/10/2026)

12 bài tiếng Việt có thêm 24 điểm ngữ pháp (tổng 48 điểm tiếng Việt), từ nối đưa vào bộ từ theo bài để chọn kiểm tra. Mỗi bài thêm đoạn trước/sau biên tập, lý do sửa và yêu cầu viết vận dụng. Sổ tay trong trang Giáo trình có 10 nhóm chức năng, tìm kiếm, ví dụ, lỗi theo ý định giao tiếp, cách sửa và bài luyện kèm giải thích. Sổ tay chỉ hiện khi chọn giáo trình tiếng Việt.

Các phân biệt được nhấn mạnh: quan hệ nội dung trước hình thức nối; trình tự khác nguyên nhân; điều kiện cần khác giả thiết; diễn giải lại khác mở phương diện; thực tế nhượng bộ khác giả định; tổng kết không mở luận điểm mới. Không khẳng định mọi từ nối thuộc một từ loại hay dấu phẩy luôn bắt buộc.

Nguồn đối chiếu bổ sung: Nguyễn Hoàng Phương, “Chức năng của giới từ tiếng Việt (xét trên bình diện ngữ pháp và ngữ nghĩa)”, https://journal.hcmue.edu.vn/index.php/hcmuejos/article/view/1213 — đọc tóm tắt về khác biệt giới từ/liên từ và sự gộp chung quan hệ từ. Nguồn này hỗ trợ cách trình bày thuật ngữ, không được coi là xác nhận riêng từng ví dụ của app. Đã đối chiếu thêm phần chỉ mục của bài về liên kết văn bản https://www.vjol.info.vn/index.php/tctbgd/article/download/103665/87397/ ; toàn văn trả lỗi 502 trong phiên này. Không sử dụng các trang SEO mang tên vjol.info làm nguồn học thuật.

Mọi ví dụ và đoạn trước/sau đều được biên soạn riêng. Các bài luyện ở sổ tay là tự học có gợi ý, chưa thêm dạng đề ngữ pháp vào công cụ tạo bài kiểm tra.
