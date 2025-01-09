Dưới đây là một tài liệu **Concept** (khái niệm tổng quan) cho **Module “Time & Attendance”** trong giải pháp HCM/HR. Tài liệu này giúp tất cả thành viên dự án – từ đội ngũ business, phân tích nghiệp vụ, đến đội ngũ kỹ thuật – có cái nhìn thống nhất về các **thực thể** (entities), **khái niệm**, **luồng dữ liệu** (data flow) và **cách cấu hình** (configuration steps) trong module. Qua đó, mọi người sẽ hiểu rõ cách **xây dựng** lịch làm việc, **quản lý** chấm công (time card), **áp dụng** quy tắc (rule, policy), và **phân bổ** dữ liệu cho các mục đích khác nhau.

---

# Tài Liệu Concept: Module “Time & Attendance”

## 1. Mục tiêu

1. Trình bày **khung khái niệm** (conceptual framework) cho việc **quản lý thời gian và chấm công** (Time & Attendance).  
2. Mô tả **cấu trúc** các **thực thể** chính (Work Pattern, Shift, Time Card, Time Calculation Rule, Policy, Schedule, Period...) và **mối quan hệ** giữa chúng.  
3. Giải thích **các bước cấu hình cốt lõi** – từ định nghĩa lịch làm việc (work pattern, schedule) đến cách gán ca, tính công.  
4. Hỗ trợ người dùng (quản trị hệ thống, chuyên gia business, team dev) **hiểu rõ** logic, luồng dữ liệu, và **cách triển khai**.

---

## 2. Tổng quan Module Time & Attendance

**Time & Attendance** là **nền tảng** để doanh nghiệp:

- Quản lý **lịch làm việc** và **ca kíp** (Work Pattern, Shift, Schedule).  
- Ghi nhận **Time Card** (chấm công) – từ máy quẹt thẻ, app di động, hay tự nhập.  
- Áp dụng **chính sách** (Policy) và **quy tắc tính công** (Rule) để tự động xác định overtime, nghỉ bù, rounding…  
- Xử lý **ngoại lệ** (Attendance Exception) như đi muộn, về sớm.  
- Cung cấp **kết quả** cho **các mô-đun khác** (Payroll, Absence, Project Costing…) thông qua **Time Consumer Set**.  

---

## 3. Các Thực thể Chính & Ý nghĩa

Dưới đây là tóm tắt **những entity cốt lõi** nhất, trình bày **theo luồng** cấu hình và sử dụng.

### 3.1. **Work Pattern**

- **Ý nghĩa**: “Khuôn mẫu” mô tả kiểu làm việc chung (Fixed, Flexible, Rotational…), có thể gồm giờ “core”, yêu cầu remote/hybrid, mức độ linh hoạt…  
- **Vai trò**:  
  1. Định nghĩa **cách** một nhóm nhân viên sẽ làm việc (vd: 5 ngày/tuần, 3 ca xoay...).  
  2. Là nền tảng để hình thành **Work Pattern Day** (chi tiết từng ngày).  

### 3.2. **Work Pattern Day**

- **Ý nghĩa**: Xác định từng “ngày” trong chu kỳ **pattern** – ngày nào làm (is_working_day = true), ngày nào nghỉ (false), hoặc mô phỏng “3 tuần làm, 1 tuần off”…  
- **Cách dùng**:  
  - Dùng `day_of_week` (Monday, Tuesday…) cho tuần chuẩn.  
  - Hoặc `sequence_in_cycle` (1..28) cho chu kỳ dài (28 ngày…).  
- **Kết quả**: Tạo nên lịch “cốt lõi” lặp lại cho pattern.

### 3.3. **Shift** & **Shift Interval**

- **Shift**: “Ca làm việc” (Ca Sáng, Ca Đêm…), gồm **start-end time**, link với `work_pattern`.  
- **Shift Interval**: Tách ca thành nhiều **đoạn** (Work, Break, Meal…) để ghi rõ giờ làm – giờ nghỉ.  
- **Ý nghĩa**: Quản lý chính xác cấu trúc thời gian trong ngày.  

### 3.4. **Work Schedule Calendar** & **Work Schedule Entry**

- **Work Schedule Calendar**: Lịch cụ thể (VD: “Tháng 1/2024”), với **start_date – end_date**, mô tả chi tiết từng ngày.  
- **Work Schedule Entry**: Từng dòng “ngày – shift” (có phải holiday hay không).  
- **Dùng khi**: Doanh nghiệp muốn lập “lịch tay” (thủ công) cho từng ngày, thay vì lặp pattern.  

### 3.5. **Schedule Assignment**

- **Vai trò**: Gán nhân viên (hoặc nhóm) vào một **Calendar** (hoặc Work Pattern) trong khoảng thời gian (assignment_start_date – end_date).  
- **Ý nghĩa**: Xác định **ai** áp dụng **lịch** nào, từ ngày nào đến ngày nào.

### 3.6. **Time Card**

- **Ý nghĩa**: Ghi nhận **chấm công** (Clock In, Clock Out). Có `time_type_id` (Regular, Overtime, Absence...), `recorded_hours`, `calculated_hours`.  
- **Cốt lõi**: “Time Entry” để từ đó hệ thống **tính công**, “soi” ngoại lệ, v.v.  
- **period_cycle_id** (nếu dùng chu kỳ “2024W01”) hỗ trợ chốt sổ theo kỳ.

### 3.7. **Attendance Exception**

- **Ý nghĩa**: Ghi lại **vi phạm** (late, early leave, no show…) hay chênh lệch so với lịch.  
- **Quy trình**: Cần phê duyệt, lý do, v.v.

### 3.8. **Time Calculation Rule** & **Rule Set**

- **Rule**: Mỗi quy tắc tính OT, Premium, Daily/Hourly…  
- **Rule Set**: Gom nhóm nhiều rule.  
- **Ý nghĩa**: Tự động xác định overtime sau 8h, tính hệ số đêm, v.v.  

### 3.9. **Attendance Policy** & **Assignment**

- **Attendance Policy**: Mô tả **chính sách chấm công** (grace period, overtime policy, day_breaker_time, rounding...).  
- **Policy Assignment**: Gán policy cho **đối tượng** (Employee, Department, Team...).  
- **Kết hợp**: Khi tính giờ, hệ thống tra policy → áp rule (overtime, rounding, max_shift_hours…).

### 3.10. **Period Definition & Period Cycle**

- **Period Definition**: Định nghĩa kiểu kỳ (Weekly, Bi-weekly, Monthly…).  
- **Period Cycle**: Từng instance (VD: 2024W01 từ 01/01 – 07/01).  
- **Dùng**: Quản lý “khoá sổ” Time Card.  

### 3.11. **Time Consumer Set** & **time_card_consumer** (N-N)

- **Time Consumer Set**: Mục đích sử dụng dữ liệu (Payroll, Absence, Project Costing...).  
- **time_card_consumer**: Phân bổ giờ từ 1 time card sang nhiều consumer.  
- **Ý nghĩa**: Giúp “8h Regular” chia 2h sang Project A, 6h sang Project B hoặc OT…

### 3.12. **Employee Group** & **Employee Self-Schedule** (Tuỳ chọn)

- **Employee Group**: Gom nhiều nhân viên thành nhóm (dự án, phòng ban…); dễ gán policy, schedule.  
- **Employee Self-Schedule**: Cho phép nhân viên **tự** đăng ký ca, chờ duyệt.  

### 3.13. **Approval Flow & Step**

- **Mục đích**: Quy trình duyệt Time Card, Exception, Self-Schedule.  
- **Flow**: Danh sách step, **step_order**, **approver_role**.  
- **Step**: Ai duyệt trước, ai duyệt sau…

### 3.14. **Stop Day Rule** (tuỳ chọn)

- **Ý nghĩa**: “Day Breaker” – cắt ngày công lúc 2AM cho ca đêm.  
- **Có thể** lưu trong Attendance Policy (day_breaker_time) hoặc tách bảng `stop_day_rule`.

---

## 4. Luồng Cấu hình và Vận hành (Phân đoạn quan trọng)

Để **dễ nắm bắt**, ta chia thành **các bước**:

### 4.1. Bước 1: Định nghĩa Work Pattern & Work Pattern Day

- Tạo **Work Pattern** (dạng Cố định, Xoay, v.v.).  
- Xác định chi tiết ngày (Work Pattern Day): làm việc hay nghỉ.  
- (Nếu dùng chu kỳ dài 28 ngày, ta thiết lập `sequence_in_cycle` = 1..28).

### 4.2. Bước 2: Thiết lập Period Definition (tùy chọn)

- Nếu muốn chốt sổ theo tuần/tháng, tạo “Weekly” (7 ngày), “Monthly” (30 hoặc “bắt đầu mùng 1”).  
- Sinh **Period Cycle** (2024W01, 2024W02...).

### 4.3. Bước 3: Tạo Shift & Shift Interval

- Xây **Ca làm việc**. Mỗi ca có thể chia thành interval (Work/Meal/Break).  
- Gán shift vào Work Pattern (nếu pattern cần chi tiết ca).  

### 4.4. Bước 4: Lập Schedule (Calendar) & Gán (Schedule Assignment)

- Cách A: Dùng `work_schedule_calendar` + `work_schedule_entry` (thủ công).  
- Cách B: Áp “Work Pattern” tự động lặp.  
- Gán **nhân viên** (hoặc nhóm) vào schedule, xác định ngày bắt đầu/kết thúc.  

### 4.5. Bước 5: Khai Attendance Policy & Time Calculation Rule

- Tạo Policy (grace_period, day_breaker_time, overtime_policy...).  
- Tạo Rule (OT sau 8h, Premium 150%, v.v.).  
- Mapping Policy với Rule (nếu cần).  
- Gán Policy cho đối tượng (Company, Department, Employee...).  

### 4.6. Bước 6: Nhập/log Time Card

- Khi nhân viên chấm công (in/out), hệ thống sinh Time Card.  
- Hoặc import từ máy chấm công của bên thứ 3, sau đó “build” time card.  
- Hệ thống kiểm tra **matching** so với schedule, nếu sai → `attendance_exception`.

### 4.7. Bước 7: Tính công (Employee Time Calculation)

- Áp **Time Calculation Rule** theo Attendance Policy → Tạo record `employee_time_calculation`.  
- Xác định overtime, rounding, break cắt…  
- (Tuỳ chọn) Chia `time_card` sang `time_consumer_set` (nhiều mục đích).

### 4.8. Bước 8: Phê duyệt & Chốt kỳ

- Nếu có Approval Flow, manager duyệt Time Card, Exception, Self-Schedule.  
- Khi xong, system đặt “is_closed = true” cho **period_cycle** → hoàn thành 1 kỳ.

---

## 5. Ví dụ Minh Hoạ (Một Use Case Đơn Giản)

1. **Work Pattern**: Tạo “5 ngày làm / 2 ngày nghỉ (thứ 7, CN)”.  
2. **Shift**: Ca Hành chính (8:00 – 17:00), break 12:00 – 13:00.  
3. **Attendance Policy**: Overtime sau 8h/ngày, rounding “nearest 15 phút”.  
4. **Gán Policy** cho Phòng Sản xuất.  
5. **Period**: Weekly, generate “2024W01” (1/1 – 7/1).  
6. **Nhân viên** chấm công 5 ngày, 1 lần in/out. Hệ thống đối chiếu schedule, không thấy vi phạm, tính 8h/day.  
7. Cuối tuần, system chốt “2024W01”, ghi (5 * 8 = 40h regular) → sang Payroll.

---

## 6. Lợi ích & Ứng dụng

- **Đồng nhất**: Tất cả logic chấm công, ca kíp, OT… được quản lý tập trung.  
- **Linh hoạt**: Hỗ trợ đa dạng mô hình (3 ca 4 kíp, Remote, Hybrid, 3w on/1w off...).  
- **Tự động hóa**: Tự động bắt ngoại lệ (muộn, sớm), tính OT, chia time cho nhiều mục đích (Payroll, Dự án...).  
- **Mở rộng**: Gán policy tùy phòng ban, self-schedule, approval flow, day breaker… đáp ứng hầu hết use case.

---

## 7. Tóm tắt

**Module “Time & Attendance”** cung cấp cách **xây dựng** và **vận hành** toàn bộ vòng đời chấm công:

1. **Định nghĩa** Work Pattern (khung lịch) + Shift/Interval (ca kíp).  
2. **Thiết lập** Period (kỳ lặp), Policy (chính sách), Rule (quy tắc tính).  
3. **Gán** Lịch, Policy cho Nhân viên/Group.  
4. **Ghi nhận** Time Card (từ máy chấm công hay manual).  
5. **Tính công** (dựa trên rule, policy), quản lý ngoại lệ, phê duyệt.  
6. **Chốt kỳ**, phân bổ dữ liệu cho mục đích (Time Consumer Set).

Nhờ mô hình linh hoạt, module này phù hợp cho cả công ty **phân ca đơn giản** lẫn doanh nghiệp **quy mô lớn** có **nhiều ca, lịch xoay** và **chính sách phức tạp**. Đây cũng là **nền tảng** cho việc tính lương (Payroll) và các tính năng nâng cao (Absence, Talent, Performance…).