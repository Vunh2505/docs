# Tài Liệu Concept: Module “Payroll”

> Dưới đây là một tài liệu **Concept** (khái niệm tổng quan) cho **Module “Payroll”** trong giải pháp HCM/HR, được viết theo **phong cách** tương tự tài liệu mẫu cho **Module “Organizations”** mà bạn đã cung cấp. Tài liệu này giúp toàn bộ thành viên dự án có cái nhìn thống nhất về các **thực thể** (entities), **khái niệm** và **luồng dữ liệu** (data flow) quan trọng trong module Payroll. Đồng thời, tài liệu kèm ví dụ minh họa (sample data) để làm rõ cách các thực thể tương tác.

---



## 1. Mục tiêu

- Cung cấp **khung khái niệm** nhất quán về **quy trình và cấu trúc tính lương** (Payroll) trong giải pháp HCM/HR.  
- Mô tả rõ các **thực thể** cốt lõi (Legislative Data Group, Payroll Definition, Payroll Period, Element, v.v.) và **mối quan hệ** giữa chúng.  
- Hỗ trợ người dùng (khách hàng, quản trị hệ thống, đội ngũ triển khai) nắm bắt cách **quản lý**, **cấu hình**, và **sử dụng** dữ liệu tính lương.  
- Tạo nền tảng để phát triển/tích hợp với các tính năng liên quan như **Time & Attendance**, **Bảo hiểm và Phúc lợi**, **Chấm công**, **Kế toán**, **Báo cáo quản trị**, v.v.

---

## 2. Tổng quan

**Module “Payroll”** hỗ trợ doanh nghiệp tự động hoá và quản lý xuyên suốt quá trình **tính lương**, **khấu trừ**, **thuế**, **phúc lợi**, và **chuyển khoản** cho nhân viên. Từ doanh nghiệp quy mô nhỏ (vài trăm nhân viên) đến quy mô lớn (hàng nghìn, hàng chục nghìn nhân viên), hệ thống đều có thể mở rộng linh hoạt. Các điểm nổi bật của module:

1. **Legislative Data Group (LDG)**: Quản lý **quy định pháp lý** (thuế, bảo hiểm, luật lao động) tùy theo **quốc gia** hoặc **vùng lãnh thổ**.  
2. **Payroll Definition & Payroll Period**: Thiết lập **kỳ lương**, **tần suất** trả lương (tháng, tuần, nửa tháng...), thời điểm bắt đầu/kết thúc, ngày trả lương.  
3. **Element** (các khoản thu/khấu trừ) và **Element Entry**: Quản lý danh sách các loại **thu nhập** (Earnings), **khấu trừ** (Deductions), **thuế** (Taxes), **phí bảo hiểm** (Insurance),… kèm thông tin chi tiết cho từng nhân viên.  
4. **Payroll Relationship**: Mô hình hóa **mối quan hệ tính lương** giữa nhân viên và kỳ lương, hỗ trợ trường hợp nhân viên có nhiều hợp đồng lao động, hay chuyển công ty con, pháp nhân khác nhau trong cùng tập đoàn.  
5. **Fast Formulas** hoặc **Rule Engine** (Drools, custom rules): Cho phép tùy biến **logic tính toán** lương, thuế, bảo hiểm linh hoạt.  
6. **Workflow** tính lương hoàn chỉnh, từ **xác nhận dữ liệu** -> **tính lương** -> **phê duyệt** -> **chi trả** -> **ghi nhận sổ kế toán**.  
7. **Tích hợp** với hệ thống **Kế toán (GL)**, **Ngân hàng**, **Chấm công**, **Thuế/BHXH** theo quy định.

---

## 3. Các Thực Thể Chính và Ý nghĩa

### 3.1. Legislative Data Group (LDG)
- **Mục đích**: 
  - Nhóm các quy tắc, quy định pháp lý của **quốc gia** hoặc **vùng lãnh thổ** để tính lương.  
  - Giúp **module Payroll** xử lý khác nhau cho mỗi địa bàn (ví dụ: Thuế TNCN tại Việt Nam, Thuế quốc gia khác…).  
- **Thuộc tính chính**:  
  - **Tên**, **Mã quốc gia**, **Mô tả**, **Trạng thái** (còn hiệu lực hay không).  
- **Ví dụ**:  
  - “LDG_VN” dành cho Việt Nam (luật lao động, thuế thu nhập, bảo hiểm xã hội).  
  - “LDG_US” dành cho Hoa Kỳ (thuế liên bang, tiểu bang…).

### 3.2. Payroll Definition
- **Mục đích**: 
  - Mô tả **kỳ lương** cơ bản, tần suất, ngày bắt đầu/kết thúc, ngày trả lương.  
  - Gắn với **Legislative Data Group** tương ứng.  
- **Ví dụ**:  
  - “VN Monthly Payroll” (trả lương hàng tháng cho nhân viên tại Việt Nam).  
  - “US Bi-weekly Payroll” (mỗi 2 tuần 1 kỳ trả lương cho nhân viên tại Hoa Kỳ).

### 3.3. Payroll Period
- **Mục đích**: 
  - Đại diện cho **một kỳ lương cụ thể** (tháng 1/2025, tuần thứ 2/2025...).  
  - Mỗi “Payroll Definition” sẽ tự động sinh ra nhiều “Payroll Period” (Open, Closed...).  
- **Ví dụ**:  
  - “Kỳ lương tháng 1/2025” (từ 01/01/2025 đến 31/01/2025, trả lương vào 05/02/2025).  
  - “Kỳ lương tuần 2/2025” (từ 08/01/2025 đến 14/01/2025, trả lương vào 15/01/2025).

### 3.4. Element (Earnings, Deductions, Tax…)
- **Mục đích**: 
  - Quản lý tất cả **khoản thu nhập** và **khấu trừ** liên quan đến nhân viên (lương cơ bản, phụ cấp, thưởng, thuế, BHXH...).  
- **Phân loại chính**:  
  - **Earnings** (khoản thu, ví dụ lương cơ bản, phụ cấp).  
  - **Deductions** (khoản khấu trừ, ví dụ BHXH, BHYT, thuế TNCN).  
  - **Information** (các element mang tính tham chiếu, không hạch toán tiền).  
- **Ví dụ**:  
  - “Basic Salary”, “Overtime Pay”, “Bonus”, “Tax Deduction”.

### 3.5. Element Entry
- **Mục đích**: 
  - **Bản ghi chi tiết** gán một Element cho một **nhân viên** (thông qua Payroll Relationship).  
  - Chứa **giá trị đầu vào** (input values), ví dụ số giờ OT, mức tiền BH, tỷ lệ khấu trừ…  
- **Ví dụ**:  
  - Element Entry “Overtime 10 giờ” cho nhân viên A trong kỳ lương tháng 1/2025.  
  - Element Entry “Bonus 2,000,000 VNĐ” cho nhân viên B.

### 3.6. Payroll Relationship
- **Mục đích**: 
  - Thể hiện **mối quan hệ tính lương** giữa nhân viên và **Payroll Definition** trong một khoảng thời gian.  
  - Hỗ trợ trường hợp nhân viên **đồng thời** có nhiều quan hệ lương (ví dụ: một hợp đồng full-time, một hợp đồng part-time ở pháp nhân khác).  
- **Ví dụ**:  
  - “Payroll Relationship #123” liên kết nhân viên ID=1001 với “VN Monthly Payroll” từ 01/2025 - 12/2025.  
  - “Payroll Relationship #124” cho cùng nhân viên ID=1001 nhưng với “Overseas Payroll” khi họ công tác nước ngoài.

### 3.7. Fast Formulas (hoặc Rule Engine - Drools/Custom)
- **Mục đích**: 
  - Lưu **logic tính toán** (công thức) phức tạp, có thể thay đổi theo điều kiện, chính sách.  
  - Có thể là **script** (Fast Formula) hoặc **rules** (Drools).  
- **Ví dụ**:  
  - “Công thức tính lương ngoài giờ (Overtime) = (Base Hourly Rate * 1.5) * Overtime Hours”.  
  - “Công thức tính Thuế TNCN” theo biểu lũy tiến.

### 3.8. Payroll Run Results
- **Mục đích**:  
  - Lưu **kết quả tính lương** cuối cùng cho **mỗi Element**, **mỗi nhân viên**, **mỗi kỳ lương**.  
  - Phục vụ **báo cáo**, **kiểm tra** (audit), **in phiếu lương** (payslip).  
- **Ví dụ**:  
  - Bản ghi: Kỳ lương tháng 1/2025, nhân viên #1001, Element “Basic Salary = 15,000,000 VNĐ”.  
  - Bản ghi: Kỳ lương tháng 1/2025, nhân viên #1001, Element “Tax Deduction = 1,500,000 VNĐ”.

### 3.9. Costing & Transfer to GL
- **Mục đích**:  
  - Định nghĩa **mã chi phí**, **center**, **tài khoản hạch toán** để chuyển thông tin lương sang **kế toán (General Ledger)**.  
  - Tạo bút toán => đồng bộ với module **Tài chính**.  
- **Ví dụ**:  
  - Costing: “Phụ cấp điện thoại” hạch toán vào tài khoản chi phí “6421 – Chi phí văn phòng”.  
  - Transfer to GL: Tạo lệnh **ghi sổ** sang Oracle Financials, SAP, hay hệ thống kế toán khác.

---

## 4. Data Flow hoặc Workflow Tiêu Biểu

### 4.1. Dòng chảy dữ liệu khi **thiết lập và tính lương**
1. **Thiết lập LDG**: Khai báo quốc gia, quy định thuế, bảo hiểm.  
2. **Tạo Payroll Definition**: Ví dụ “Monthly Payroll”, link với LDG tương ứng (VN, US...).  
3. **Sinh Payroll Period**: Tạo các kỳ lương cụ thể theo tháng/tuần…  
4. **Element & Fast Formulas**: 
   - Khai báo các khoản thu/khấu trừ, công thức tính.  
   - Gán (Element Entry) cho nhân viên, ví dụ bonus, OT, khấu trừ bảo hiểm.  
5. **Payroll Relationship**:  
   - Liên kết nhân viên vào kỳ lương phù hợp.  
   - Nếu nhân viên chuyển sang legal entity khác, tạo Relationship mới.  
6. **Chạy tính lương (Calculate Payroll)**:  
   - Hệ thống dùng Element + Fast Formulas để tính.  
   - Lưu kết quả vào **Payroll Run Results**.  
7. **Pre-Payment & Payment**:  
   - Xác định phương thức thanh toán (chuyển khoản, tiền mặt…).  
   - Tạo ủy nhiệm chi/ phiếu lương.  
8. **Costing & Transfer to GL**:  
   - Ghi nhận chi phí lương, gửi sang hệ thống kế toán.  
9. **Báo cáo & Lưu trữ**:  
   - Kiểm tra, phê duyệt, in payslip.  
   - Lưu trữ (Archive).

### 4.2. Data Flow tích hợp **Time & Attendance** (nếu có)
1. **Hệ thống chấm công** ghi nhận số giờ làm, OT, nghỉ phép.  
2. Tự động đẩy sang **module Payroll** (Element Entry -> Overtime, Leave Deduction...).  
3. **Payroll** lấy dữ liệu này, chạy formula tính lương cho OT, trừ lương cho nghỉ phép không lương, v.v.

---

## 5. Ví dụ Dữ liệu Minh Hoạ (Sample Data)

### 5.1. Legislative Data Group

| LDG_ID | Name      | CountryCode | Description                 | is_active |
|--------|----------|-------------|-----------------------------|-----------|
| 1      | LDG_VN    | VN          | Luật lao động, thuế VN     | true      |
| 2      | LDG_US    | US          | Luật liên bang, tiểu bang  | true      |

### 5.2. Payroll Definition

| PayrollDefinitionID | LDG_ID | Name                   | Frequency   | StartDate   | EndDate     | PaymentDate | Status  |
|---------------------|--------|------------------------|------------|------------|------------|------------|---------|
| 10                  | 1      | VN Monthly Payroll     | Monthly    | 2025-01-01 | (null)     | 2025-01-31 | Active  |
| 11                  | 2      | US Bi-weekly Payroll   | Bi-weekly  | 2025-01-01 | (null)     | 2025-01-15 | Active  |

### 5.3. Payroll Period

| PayrollPeriodID | PayrollDefinitionID | PeriodStartDate | PeriodEndDate   | Status | Remarks             |
|-----------------|---------------------|-----------------|-----------------|--------|---------------------|
| 100             | 10                  | 2025-01-01      | 2025-01-31      | Open   | Tháng 1/2025 (VN)   |
| 101             | 10                  | 2025-02-01      | 2025-02-28      | Open   | Tháng 2/2025 (VN)   |
| 200             | 11                  | 2025-01-01      | 2025-01-14      | Closed | Kỳ 1/2025 (US)      |
| 201             | 11                  | 2025-01-15      | 2025-01-28      | Open   | Kỳ 2/2025 (US)      |

### 5.4. Elements

| ElementID | LDG_ID | Name               | ElementType     | ConfigDetails                         | is_active |
|-----------|--------|--------------------|-----------------|----------------------------------------|----------|
| 1000      | 1      | Basic Salary (VN)  | Earnings        | {"calcType":"monthly"}                | true     |
| 1001      | 1      | Tax TNCN (VN)      | Deductions      | {"taxBracket":"VN2025"}               | true     |
| 2000      | 2      | Basic Salary (US)  | Earnings        | {"calcType":"hourly","hourlyRate":20} | true     |
| 2001      | 2      | Federal Tax (US)   | Deductions      | {"taxType":"federal"}                 | true     |

### 5.5. Element Entries

| ElementEntryID | ElementID | PayrollRelationshipID | EffectiveStartDate | InputValues                          |
|----------------|----------|------------------------|--------------------|--------------------------------------|
| 5000           | 1000     | 3000                  | 2025-01-01         | {"amount":15000000}                  |
| 5001           | 1001     | 3000                  | 2025-01-01         | {"taxableIncome":15000000}           |
| 6000           | 2000     | 4000                  | 2025-01-01         | {"hoursWorked":80}                   |
| 6001           | 2001     | 4000                  | 2025-01-01         | {"taxableIncome":1600}               |

### 5.6. Payroll Relationship

| PayrollRelationshipID | EmployeeID   | PayrollDefinitionID | StartDate   | EndDate     | Status    |
|-----------------------|-------------|----------------------|------------|------------|----------|
| 3000                  | EMP-VN-1001 | 10                   | 2025-01-01 | (null)     | Active   |
| 4000                  | EMP-US-2001 | 11                   | 2025-01-01 | (null)     | Active   |

### 5.7. Payroll Run Results

| PayrollRunResultID | PayrollPeriodID | PayrollRelationshipID | ElementID | Amount    | Currency | 
|--------------------|-----------------|------------------------|----------|----------|----------|
| 8000               | 100             | 3000                  | 1000     | 15000000 | VND      |
| 8001               | 100             | 3000                  | 1001     | 1500000  | VND      |
| 9000               | 200             | 4000                  | 2000     | 1600     | USD      |
| 9001               | 200             | 4000                  | 2001     | 120      | USD      |

---

## 6. Các Tính năng/Logic Quan trọng

1. **Đa quốc gia, đa quy định (Multi-LDG)**  
   - Mỗi **LDG** tương ứng với luật thuế/bảo hiểm khác nhau, cho phép doanh nghiệp hoạt động toàn cầu trên 1 hệ thống.  

2. **Workflow tính lương khép kín**  
   - Từ **chuẩn bị dữ liệu** (Element Entry) -> **Calculate** -> **Prepayment** -> **Chi trả** -> **Hạch toán (Costing)** -> **Transfer to GL**.  

3. **Bảo mật & Phân quyền**  
   - Dữ liệu lương thường **nhạy cảm** => cần phân quyền, có thể áp dụng **Row-Level Security (RLS)**, **mã hoá** cột lương.  

4. **Kiêm nhiệm & Nhiều hợp đồng**  
   - Nhân viên có thể có **nhiều Payroll Relationship** nếu làm nhiều hợp đồng hoặc ở nhiều pháp nhân trong cùng tập đoàn.  

5. **Custom Formula & Rule Engine**  
   - Dùng **Fast Formula** hoặc tích hợp **Drools** cho các kịch bản tính lương, thưởng, phúc lợi phức tạp (tính thuế lũy tiến, tính bảo hiểm theo nhiều điều kiện...).  

6. **Tích hợp**  
   - **Time & Attendance** để lấy OT, ngày công.  
   - **Financials/GL** để hạch toán chi phí lương.  
   - **BHXH, Thuế** (xuất tờ khai, nộp báo cáo).  

7. **Báo cáo & Lưu trữ (Archive)**  
   - Lưu **kết quả tính lương** từng kỳ => phục vụ kiểm toán, **in payslip**, báo cáo quản trị.  
   - **Partitioning** có thể áp dụng cho bảng khối lượng lớn (Payroll Run Results).  

---

## 7. Lợi ích & Ứng dụng

- **Tự động hoá quy trình lương**: Giảm thiểu công việc thủ công, hạn chế sai sót.  
- **Tuân thủ luật pháp**: Dễ dàng mở rộng sang các quốc gia mới, cấu hình LDG tương ứng.  
- **Quản lý & Báo cáo tập trung**: Tất cả dữ liệu lương, khấu trừ, thuế được quản lý trong cùng hệ thống.  
- **Tích hợp chặt chẽ** với **Core HR**, **Time Attendance**, **Tài chính Kế toán** để đảm bảo dữ liệu xuyên suốt, cập nhật theo thời gian thực.  
- **Bảo mật cao**: Có thể áp dụng nhiều lớp phân quyền, **RLS**, mã hoá cột lương, logging/audit chi tiết.  

---

## 8. Tóm tắt

**Module “Payroll”** là chìa khoá để doanh nghiệp:  
- Dễ dàng tính và chi trả lương đúng hạn cho nhân viên.  
- Đáp ứng các yêu cầu về thuế, bảo hiểm, báo cáo của **nhiều quốc gia** khác nhau.  
- Tạo **cấu hình** phong phú (Element, Fast Formula, Workflow) để thích ứng với **môi trường** liên tục thay đổi (luật thuế mới, chính sách phúc lợi mới…).  
- Liên kết trơn tru với các phân hệ HCM/HR khác (Quản lý Nhân viên, Chấm công, Hiệu suất...) cũng như với các hệ thống **Kế toán** hoặc **Ngân hàng**.

---

## 9. Phụ lục: Triển khai Thực tế

1. **Phân quyền & bảo mật**:  
   - Quyết định vai trò (Payroll Admin, Payroll Manager, Payroll Specialist...), thiết lập các chính sách RLS, mã hoá thông tin lương quan trọng.  
2. **Thiết lập ban đầu**:  
   - Khai báo **Legislative Data Group** theo quốc gia.  
   - Tạo **Payroll Definition** (tháng, tuần, nửa tháng…).  
   - Thêm **Element** (Basic, Overtime, Tax…) và liên kết **Fast Formula** nếu cần.  
3. **Nhập liệu, mapping**:  
   - Kiểm tra dữ liệu nhân viên, gán **Payroll Relationship**, tạo **Element Entries** (lương cơ bản, bảo hiểm, vv.).  
   - Xác định **Costing** cho hạch toán kế toán.  
4. **Tích hợp**:  
   - Kết nối **Time & Attendance** (nếu có) để tự động đưa số giờ, số ngày công.  
   - Kết nối **Banking** để thực hiện chi trả lương online.  
   - Kết nối **Kế toán** để chuyển bút toán sang GL.  
5. **Chạy thử, hiệu chỉnh**:  
   - Thử tính lương 1-2 kỳ, so sánh kết quả với thực tế, sửa công thức (nếu cần).  
6. **Bảo trì và nâng cấp**:  
   - Khi có luật thuế mới, cập nhật **Fast Formulas**.  
   - Quản lý bản vá (patch) và versioning.  

---

### Kết luận

Tài liệu Concept này đã phác thảo những **thành phần cốt lõi** của **module “Payroll”** và **cách chúng liên kết, vận hành**. Qua đó, doanh nghiệp và đội ngũ triển khai có **cái nhìn tổng quan**, dễ dàng **trao đổi**, **tinh chỉnh** và **mở rộng** khi triển khai giải pháp lương cho tổ chức.  

> **Lưu ý**: Các chi tiết về **thiết kế DB** (lược đồ bảng, khoá ngoại), **quy trình thao tác** hoặc **giao diện người dùng** (UI/UX) có thể nằm trong tài liệu **thiết kế kỹ thuật** hoặc **hướng dẫn sử dụng** chi tiết.