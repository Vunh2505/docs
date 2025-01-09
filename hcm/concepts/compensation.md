# Compensation & Base Pay


> Dưới đây là một tài liệu **Concept** (khái niệm tổng quan) cho **Module “Compensation & Base Pay”** trong giải pháp HR. Tài liệu này giúp tất cả thành viên dự án – từ đội ngũ business, phân tích nghiệp vụ, đến đội ngũ kỹ thuật – có cái nhìn **thống nhất** về các **thực thể** (entities), **khái niệm** và **luồng dữ liệu** (data flow) trong module. Tài liệu cũng kèm **ví dụ minh hoạ** (sample data) để làm rõ cách các thực thể liên kết và tương tác.



## 1. Mục tiêu

- Cung cấp **khung khái niệm** thống nhất về **cách thức quản lý lương cơ bản (Base Pay)** và **lương thưởng (Compensation)** trong giải pháp HR.  
- Giúp doanh nghiệp quản trị **cấu trúc lương** (grade, ladder, step) và **các chương trình lương thưởng** (compensation program, plan, cycle…) một cách linh hoạt.  
- Hỗ trợ người dùng (khách hàng, quản trị hệ thống, team triển khai) nắm bắt cách **khai báo**, **tính toán** và **phê duyệt** các thay đổi lương thưởng.  
- Làm nền tảng để phát triển các tính năng liên quan như **Payroll**, **Hiệu suất (Performance)**, **Talent Management**, v.v.

---

## 2. Tổng quan

**Module “Compensation & Base Pay”** bao gồm hai mảng chính:

1. **Base Pay**: Xây dựng và quản lý **lương cơ bản** dựa trên các **Grade**, **Grade Range**, **Bậc thang (Ladder)**, **Bậc (Step)**, **Salary Basis** (phương thức trả lương theo tháng, năm, giờ…) và lưu lịch sử lương của nhân viên.  
2. **Compensation**: Triển khai các **chương trình** (program) và **kế hoạch** (plan) lương thưởng, thiết lập **ngân sách** (budget), **tiêu chí** (eligibility), thực hiện **chu kỳ** (cycle) đề xuất tăng/ thưởng, cho đến **final allocation** (phân bổ cuối).

Module này phù hợp cho mọi loại doanh nghiệp, từ **công ty phần mềm nhỏ** (với 3 bậc Junior, Senior, Principal) đến **tập đoàn lớn** (nhiều grade, nhiều kỳ thưởng). Ngoài ra, module hỗ trợ:

- **Nhiều “Rate Component”** (Derived Rate, Grade Rate, Value-by-Criteria…) để công ty tính lương một cách **tùy biến**.  
- **Chu kỳ phê duyệt** (Manager Worksheet) rõ ràng, dễ theo dõi.  
- **Kết nối** sang Payroll (nếu muốn tính tiền lương chính thức) hoặc sang Performance Management (lấy kết quả đánh giá để tính bonus).

---

## 3. Các Thực thể Chính và Ý nghĩa

### 3.1. Grade, Grade Range, Grade Ladder
- **Grade**: Thể hiện **cấp bậc** nhân sự (Ví dụ: “Dev Junior”, “Dev Senior”).  
- **Grade Range**: Định nghĩa **khoảng lương tối thiểu – trung bình – tối đa** cho mỗi Grade (tùy chính sách công ty).  
- **Grade Ladder**: Tập hợp nhiều Grade thành một **lộ trình bậc thang** (Junior -> Senior -> Principal). Có thể thêm **Step** (bậc nhỏ bên trong mỗi Grade).  
- **Ý nghĩa**:  
  - Xây dựng khung **Base Pay** có tính minh bạch, rõ ràng.  
  - Khi nhân viên lên bậc, hệ thống có thể tự đề xuất mức lương mới dựa trên Grade Range.

### 3.2. Salary Basis & Salary Basis Component
- **Salary Basis**: Định nghĩa **cách trả lương** (hàng tháng, hàng năm, theo giờ…), gắn với đơn vị tiền tệ (USD, VND…), và có thể liên kết với một **Grade** hay **Grade Ladder**.  
- **Salary Basis Component**: Mỗi Salary Basis có thể chia thành **các thành phần “tính lương”** (Rate Components), ví dụ:  
  - *Base Rate* (lương cơ bản),  
  - *Derived Rate* (công thức nhân, so sánh với thị trường…),  
  - *Grade Rate* (lấy theo bậc),  
  - *Value by Criteria* (tùy địa điểm, phòng ban…).  
- **Ý nghĩa**: Cho phép **tùy biến** các quy tắc tính lương, đáp ứng nhu cầu phức tạp của nhiều doanh nghiệp.

### 3.3. Employee Salary Record
- **Mục đích**: Lưu **mức lương cơ bản** hiện tại của nhân viên (theo Salary Basis) và **lịch sử thay đổi**.  
- **Thuộc tính**: Grade, Ladder, Step, Số tiền lương, Ngày hiệu lực, Lý do tăng lương…  
- **Ví dụ**: “Anh A” có lương monthly 2.000 USD, Grade “Dev Senior”, bắt đầu từ 01/01/2023.

### 3.4. Compensation Program & Plan
- **Compensation Program**: Một “chương trình” tổng, có thể là “Annual Compensation 2025” hoặc “Mid-Year Bonus 2025”,…  
- **Compensation Plan**: Mỗi Program có thể gồm **nhiều** Plan, ví dụ “Salary Review Plan” (tăng lương cốt lõi), “Bonus Plan” (thưởng dự án), “Stock Plan” (cổ phiếu) v.v.  
- **Khi**: Thường được **khởi tạo theo giai đoạn** (năm, quý…).

### 3.5. Plan Component
- **Mục đích**: Bên trong 1 Plan, có thể có **các thành phần** chi tiết (ví dụ: Bonus % theo performance, Allowance cố định…).  
- **Thông tin**: Công thức tính (*calculation_rule*), giới hạn tối thiểu – tối đa, bắt buộc hay không…

### 3.6. Eligibility Profile & Plan Eligibility
- **Eligibility Profile**: Mô tả **điều kiện** để nhân viên được tham gia Plan (dựa trên Grade, phòng ban, thâm niên, v.v.).  
- **Plan Eligibility**: Nhiều Plan có thể áp dụng 1 Profile, hoặc 1 Plan có thể gán nhiều Profile.  
- **Ví dụ**: Bonus Plan dành riêng cho “Senior trở lên”.

### 3.7. Budget Pool
- **Mục đích**: Xác định **ngân sách** cho 1 Plan, chia theo phòng ban hoặc theo cấp.  
- **Ví dụ**: Quỹ Bonus 20.000 USD do “Trưởng phòng R&D” quản lý.  
- **Ý nghĩa**: Giúp kiểm soát **tổng chi** khi manager đề xuất tăng lương, thưởng.

### 3.8. Compensation Cycle & Manager Worksheet
- **Compensation Cycle**: Mỗi Program có thể chia **chu kỳ** (Annual, Mid-Year, Quarter…). Trong chu kỳ, các bước mở form, duyệt… diễn ra.  
- **Manager Worksheet**: Giao diện (bảng tính) để quản lý nhập đề xuất tăng lương/ thưởng cho từng nhân viên. Mỗi dòng (manager_worksheet_detail) ghi: “Nhân viên X, plan Y, đề xuất 5%”.  

### 3.9. Final Allocation
- **Mục đích**: Lưu **kết quả cuối** (nhân viên nào được tăng lương/thưởng bao nhiêu).  
- **Có thể** cập nhật sang **employee_salary_record** (nếu liên quan lương cơ bản) hoặc gửi sang Payroll để chi trả.

---

## 4. Dòng chảy dữ liệu (Data Flow) Tiêu Biểu

### 4.1. Cấu hình ban đầu (Base Pay)
1. **Tạo Grade**: Dev Junior (G1), Dev Senior (G2), Dev Principal (G3)…  
2. **Thiết lập Grade Range** (nếu có), ví dụ G2 min=1500, mid=2000, max=2500 (USD).  
3. **Khởi tạo Salary Basis**: “Monthly Salary VN” (trả lương tháng, VND), “Annual Salary US” (trả lương năm, USD).  
4. **Gắn Salary Basis Component**: *Base Rate*, *Derived Rate (x12)*, v.v.  
5. **Tạo Employee Salary Record**: Gán nhân viên A vào G2 (Dev Senior) với lương 2.000 USD/tháng, effective từ 01/06/2023.

### 4.2. Thiết lập chương trình (Compensation)
1. **Tạo Program**: “Annual Compensation 2025”.  
2. **Tạo Plan**: “Salary Review Plan 2025” (tăng lương cốt lõi), “Bonus Plan 2025”.  
3. **Khai báo Eligibility**: Bonus Plan chỉ áp dụng cho Senior.  
4. **Budget Pool**: 100.000 USD cho Salary Review, 20.000 USD cho Bonus.  

### 4.3. Chu kỳ (Cycle) & Worksheet
1. **Tạo Compensation Cycle**: “Annual Cycle 2025” (01/01/2025 – 31/01/2025).  
2. **Mở Manager Worksheet**: Mỗi phòng ban, Manager thấy danh sách nhân viên.  
3. Manager **nhập** đề xuất (mức tăng 10%, bonus 500 USD cho “Dev Senior B” …).  
4. **Phê duyệt**: Hệ thống kiểm tra ngân sách, manager hoặc HR/CFO duyệt.  
5. Khi hoàn tất, tạo **Final Allocation**.

### 4.4. Cập nhật lương & thanh toán
1. **Final Allocation** (nếu liên quan Base Pay): cập nhật sang **employee_salary_record** (nâng lương).  
2. **Bonus**: Chuyển dữ liệu sang **Payroll** hoặc module tính công để chi trả.  
3. Lưu lịch sử, sẵn sàng báo cáo.

---

## 5. Ví dụ Minh Hoạ với Công ty Phần mềm Nhỏ

- **Phòng**: Dev, QC, BA, DB.  
- **Bậc**: Junior, Senior, Principal.  
- **Grade**:  
  - G1 = Dev Junior, G2 = Dev Senior, G3 = Dev Principal  
  - Tương tự cho QC, BA, DB.  
- **Salary Basis**: “Monthly Salary (VN)”, tần suất = MONTHLY, currency=VND.  
- Nhân viên “Nguyễn A” (Dev Senior) lương 20,000,000 VND/tháng từ 01/01/2023.  
- Hằng năm, công ty có **“Annual Compensation Program”**:  
  - **Plan 1**: Tăng lương cơ bản (SALARY),  
  - **Plan 2**: Thưởng dự án (BONUS).  
- Manager “Trần B” vào **worksheet**, đề xuất:  
  - Tăng lương 10% cho Nguyễn A → 22,000,000 VND.  
  - Thưởng 5,000,000 VND.  
- Duyệt xong, **final_allocation** = Lương mới 22 triệu + thưởng 5 triệu, có hiệu lực từ 01/02/2023.

---

## 6. Các Tính năng/Logic Quan trọng

1. **Quản lý bậc lương (Grade, Ladder, Step)**: Giúp công ty đặt ra khung lương rõ ràng.  
2. **Salary Basis Component**: Cho phép tạo **Derived Rate**, **Comparison Rate**, **Value by Criteria**… theo nhu cầu phức tạp.  
3. **Phân bổ ngân sách** (Budget Pool): Tránh vượt chi phí dự kiến.  
4. **Chu kỳ đề xuất (Cycle) & Phê duyệt**: Cung cấp quy trình chuẩn, Manager -> HR -> CFO, minh bạch.  
5. **Lưu lịch sử** (Employee Salary Record) và **report**: Dễ kiểm tra, phân tích biến động lương.

---

## 7. Lợi ích & Ứng dụng

- **Minh bạch lương**: Nhân viên, Quản lý có khung Grade, Range, Step rõ ràng.  
- **Linh hoạt thưởng**: Tạo nhiều chương trình, plan, thậm chí bonus theo tiêu chí (Value by Criteria).  
- **Tiết kiệm thời gian**: Tự động tổng hợp đề xuất, cảnh báo vượt ngân sách, giảm thủ công.  
- **Kết nối Payroll**: Lương, thưởng cuối cùng có thể đồng bộ sang module trả lương.  
- **Phù hợp nhiều quy mô**: Từ startup phần mềm 20 người đến tập đoàn ngàn nhân viên.

---

## 8. Tóm tắt

**Module “Compensation & Base Pay”** là cột sống của giải pháp HR về **quản trị lương**:  
- **Base Pay**: Cấu hình grade/ ladder, xác định salary basis, lưu lịch sử lương nhân viên.  
- **Compensation**: Tổ chức chương trình/ kế hoạch lương thưởng, quy định eligibility, ngân sách, vận hành chu kỳ phê duyệt, và ghi lại final allocation.  
- **Kết quả**: Doanh nghiệp có hệ thống **tinh gọn**, **công bằng** và **linh hoạt** để quản trị lương thưởng, đồng thời **mở rộng** ra các module liên quan (Payroll, Performance…).

---

## 9. Phụ lục: Triển khai Thực tế

1. **Phân quyền**: Ai được cấu hình grade, ai được tạo plan, ai phê duyệt thay đổi lương…  
2. **Thiết lập ban đầu**:  
   - Khai báo Grade, Salary Basis.  
   - Tạo Compensation Program & Plan…  
3. **Luồng đề xuất – phê duyệt**: Tùy chọn workflow, có thể 1 cấp, 2 cấp… Tích hợp tool như Camunda/Temporal.  
4. **Kết nối**:  
   - Module “Core HR” (gắn Employee).  
   - Module “Payroll” (nhận final allocation để trả lương).  
   - Module “Performance” (lấy rating để tính bonus).

---

### Kết luận

Tài liệu Concept này cung cấp **bức tranh tổng thể** về Module “Compensation & Base Pay”, giải thích các **thực thể chính**, **luồng dữ liệu** và **ví dụ** cho một công ty phần mềm cỡ nhỏ. Qua đó, doanh nghiệp và đội ngũ triển khai có thể trao đổi, tinh chỉnh, **tùy biến** giải pháp phù hợp với nhiều mô hình lương – thưởng khác nhau, đảm bảo tính **công bằng**, **hiệu quả** và **tối ưu** chi phí nhân sự.