Trong Oracle HCM Cloud, việc quản lý “earnings and deductions” (thu nhập và khấu trừ) gắn liền với phân hệ **Oracle Payroll** (thông thường là Oracle Global Payroll). Còn việc thiết kế, quản lý tổng thể “total reward” (bao gồm lương, thưởng, phúc lợi, cổ phần, v.v.) chủ yếu nằm trong phân hệ **Oracle Compensation**.

Cụ thể:

1. **Oracle Payroll (Global Payroll)**  
   - Dùng để thiết lập và tính toán earnings (các khoản thu nhập) và deductions (các khoản khấu trừ).  
   - Tích hợp chặt chẽ với các phân hệ khác (như HCM, Compensation, Benefits) để đảm bảo việc xử lý trả lương, đóng bảo hiểm, thuế, và các quy định pháp lý theo từng quốc gia/khu vực.

2. **Oracle Compensation**  
   - Hỗ trợ quản lý toàn bộ cơ cấu tiền lương, thưởng, chính sách đãi ngộ, hoa hồng, cổ phần, v.v.  
   - Thiết lập các chương trình “total rewards” cho nhân viên (gồm lương cứng, lương mềm, phúc lợi bổ sung, các gói thưởng dài hạn, v.v.)  
   - Cung cấp những tính năng nâng cao như quy trình phê duyệt (approval workflow), cơ chế review và đợt tăng lương định kỳ, cũng như các báo cáo tổng quan về chi phí nhân sự.

Như vậy, để quản lý toàn bộ thu nhập, khấu trừ (earnings/deductions) và các chương trình đãi ngộ (total reward), doanh nghiệp thường kết hợp hai phân hệ **Oracle Payroll** và **Oracle Compensation** trong bộ giải pháp HCM.


**Oracle Compensation** là mô-đun giúp doanh nghiệp thiết kế, lập kế hoạch, vận hành, theo dõi và đánh giá các chương trình lương thưởng tổng thể (tổng đãi ngộ) cho nhân viên. Từ việc xây dựng cấu trúc lương cứng (base salary), đến các khoản thưởng ngắn hạn (bonus), dài hạn (stock/equity), phụ cấp (allowances), và phúc lợi (benefits), tất cả đều có thể được thiết lập và quản lý trong **Oracle Compensation**. Dưới đây là chi tiết về các thành phần (entities), logic và dòng xử lý (flows) cơ bản của mô-đun này:

---

## 1. Cấu trúc tổng quan (Overall Structure)

1. **Compensation Plans (Kế hoạch đãi ngộ)**  
   - **Salary Plan**: Lương cơ bản (base salary), các mức bậc (grade/ladder), thang lương, nguyên tắc tính lương.  
   - **Merit/Bonus Plan**: Các khoản thưởng ngắn hạn, như tăng lương dựa trên thành tích, hoa hồng bán hàng, bonus định kỳ.  
   - **Equity/Stock Plan**: Các gói thưởng dài hạn, ví dụ như cổ phiếu, quyền chọn mua cổ phiếu (stock options).  
   - **Allowances/Other Plans**: Bao gồm phụ cấp nhà ở, xăng xe, điện thoại hoặc các khoản hỗ trợ khác.

2. **Compensation Program (Chương trình tổng thể)**  
   - Là tập hợp nhiều **compensation plan** và các quy tắc, mục tiêu ngân sách, quy trình phê duyệt, vòng đời (cycle) của chương trình.

3. **Compensation Cycle (Chu kỳ lương thưởng)**  
   - Là khoảng thời gian cố định mà doanh nghiệp sẽ triển khai kế hoạch lương thưởng, ví dụ: hằng năm (annual cycle), 6 tháng/lần (semi-annual cycle).  
   - Chu kỳ này định nghĩa lịch trình (timeline) cho các bước: mở cổng nhập liệu cho Quản lý (Manager), phê duyệt, tổng hợp (roll-up), xác nhận cuối cùng, và chuyển sang bước thực hiện trả lương (payroll integration).

4. **Eligibility Profiles (Tiêu chí đủ điều kiện tham gia các kế hoạch)**  
   - Xác định điều kiện để nhân viên được tham gia từng kế hoạch lương thưởng (dựa trên cấp bậc, bộ phận, địa điểm, thâm niên, v.v.).  
   - Giúp lọc đúng đối tượng (population) mà công ty mong muốn áp dụng chính sách khen thưởng.

5. **Budget Pools (Ngân sách)**  
   - Tạo và phân bổ ngân sách thưởng (budget) cho từng nhóm, phòng ban, chi nhánh.  
   - Theo dõi chi tiêu ngân sách trong quá trình Quản lý đề xuất tăng lương, thưởng cho nhân viên.

6. **Manager Worksheet (Bảng tính cho Quản lý)**  
   - Màn hình/biểu mẫu nơi các cấp quản lý (Manager) nhập thông tin đề xuất thay đổi lương, bonus, cổ phần cho từng nhân viên.  
   - Tích hợp cơ chế tính toán (logic calculation) dựa trên quy tắc công ty và cài đặt của Admin.

---

## 2. Các thực thể (Entities) và mối liên hệ

1. **Compensation Plans**  
   - Mỗi **plan** có cấu hình chi tiết như:  
     - **Plan Components**: Các thành phần chi tiết (lương cơ bản, bonus % theo performance, phụ cấp, cổ phần…).  
     - **Rules & Guidelines**: Quy định mức tăng tối đa/tối thiểu, mức thưởng theo hạng đánh giá (performance rating), công thức tính.  
     - **Eligibility**: Liên kết với tiêu chí đủ điều kiện (Eligibility Profiles).  
     - **Approval Workflow**: Xác định tuyến phê duyệt (Line Manager, HR, CFO…).  
   - **Plan** có thể gộp vào một **Compensation Program** (Chương trình đãi ngộ tổng thể) hoặc triển khai độc lập.

2. **Compensation Program**  
   - Chứa một hoặc nhiều **Compensation Plans**.  
   - Xác định thứ tự, thời gian kích hoạt từng plan, logic ghép dữ liệu (cộng gộp bonus + lương + cổ phần) để ra gói đãi ngộ tổng.  
   - Định nghĩa **cycle** (khoảng thời gian) cho mỗi **plan** hoặc cho tất cả các plan cùng chạy một lần.

3. **Eligibility Profiles**  
   - Xác định các điều kiện ràng buộc để nhân viên được tham gia plan, ví dụ:  
     - Điều kiện về Job (công việc), Grade (bậc lương), Location (địa điểm làm việc).  
     - Điều kiện về Organization (bộ phận), Performance Rating (đánh giá hiệu suất).  
   - Áp dụng cho từng **compensation plan** để đảm bảo chỉ những nhân viên hợp lệ mới hiển thị trên **Manager Worksheet**.

4. **Budget Pools**  
   - Xác định tổng ngân sách (budget) và cách phân bổ cho các bộ phận.  
   - Giúp kiểm soát chi phí khi Quản lý đề xuất tăng lương, thưởng.  
   - Có thể quy định ngân sách dưới dạng số tiền cố định hoặc phần trăm quỹ lương hiện tại.

5. **Compensation Worksheet**  
   - Là giao diện cho Quản lý (Manager) khi điền dữ liệu đề xuất.  
   - Hiển thị thông tin nhân viên, lương hiện tại, các tiêu chí đánh giá, các đề xuất tăng % hoặc số tiền tuyệt đối, bonus, cổ phần…  
   - Áp dụng các quy tắc, ngưỡng (rule/limit) cài đặt ở phần **plan** để cảnh báo nếu Manager nhập vượt mức cho phép.

6. **Approval Workflow**  
   - Mỗi đề xuất (Manager recommendation) sẽ tuân theo quy trình phê duyệt do doanh nghiệp cài đặt.  
   - Có thể phê duyệt một cấp, nhiều cấp, song song hoặc tuần tự.  
   - Sau khi tất cả cấp liên quan phê duyệt, kết quả cuối cùng (final allocation) mới được chuyển sang Payroll (nếu là khoản chi trả bằng tiền).

---

## 3. Logic và dòng xử lý (Flow)

1. **Thiết lập (Setup by Compensation Admin)**  
   - **Bước 1**: Xây dựng hoặc cập nhật **Compensation Plans** (lương, thưởng, cổ phần, phụ cấp…).  
   - **Bước 2**: Xác định **Eligibility Profiles** để khoanh vùng các nhân viên được tham gia.  
   - **Bước 3**: Cấu hình **Budget Pools** (nếu áp dụng ngân sách).  
   - **Bước 4**: Định nghĩa **Approval Workflow**, thiết lập tuyến phê duyệt.  
   - **Bước 5**: Tạo **Compensation Cycle** và gắn các plan vào **Compensation Program** (nếu có).

2. **Mở chu kỳ lương thưởng (Open Cycle)**  
   - Admin thông báo đến các cấp Quản lý, mở quyền truy cập vào **Manager Worksheet**.  
   - Hệ thống lấy dữ liệu từ Oracle HR (thông tin nhân viên, chức vụ, performance rating…) để điền sẵn (pre-populate) vào Worksheet.

3. **Quản lý đề xuất (Manager Recommendation)**  
   - Quản lý truy cập Worksheet, xem thông tin và đưa ra đề xuất tăng lương, thưởng, % bonus…  
   - Hệ thống tự động kiểm tra:  
     - Số tiền hoặc % tăng có vượt hạn mức đã quy định?  
     - Tổng chi của phòng ban có vượt ngân sách?  
   - Nếu có sai quy tắc, hệ thống cảnh báo (warning/error), buộc Manager phải điều chỉnh.

4. **Phê duyệt (Approval Process)**  
   - Tùy theo cấu hình workflow, đề xuất chuyển đến các cấp Quản lý cao hơn, HR, CFO… để duyệt.  
   - Mỗi cấp xét duyệt có thể điều chỉnh lại trước khi phê duyệt, hoặc từ chối để trả về Manager.

5. **Chốt danh sách (Finalization)**  
   - Sau khi được phê duyệt hết các cấp, dữ liệu thưởng, tăng lương, cổ phần… được chốt.  
   - Admin có thể xuất báo cáo, gửi thông báo đến nhân viên, hoặc tích hợp với hệ thống khác (như Oracle Payroll) để thực hiện chi trả.

6. **Tích hợp (Integration)**  
   - **Oracle Payroll**: Với các khoản thu bằng tiền (salary increase, bonus), hệ thống chuyển sang Payroll để tính toán và thực hiện trả lương thực tế.  
   - **Oracle HR**: Tự động cập nhật lại mức lương mới (new salary) vào hồ sơ nhân viên.  
   - **Oracle Performance Management** (nếu dùng): Lấy dữ liệu đánh giá hiệu suất (performance rating) làm cơ sở cho mức thưởng/ tăng lương.

---

## 4. Các tính năng nâng cao

1. **Modeling & Analytics**  
   - Cho phép Quản lý/HR làm thử các kịch bản (scenario) khác nhau về tăng lương, bonus dựa trên ngân sách hạn chế.  
   - Phân tích ảnh hưởng tài chính, so sánh các giả định (what-if analysis).

2. **Global & Local Rules**  
   - Với những tập đoàn đa quốc gia, Oracle Compensation cho phép tạo nhiều **plans** khác nhau tương ứng với từng nước, từng chế độ thuế, luật lao động.  
   - Có thể hợp nhất hoặc tách biệt ngân sách, quy tắc, để phù hợp với từng địa phương.

3. **Reporting & Dashboard**  
   - Cung cấp các báo cáo (report) về chi phí lương thưởng, bảng so sánh theo thời gian, theo phòng ban, theo hiệu suất.  
   - Giao diện dashboard trực quan cho cấp quản lý cao hơn hoặc HR để giám sát tiến độ, phân bổ ngân sách, tỉ lệ phê duyệt…

4. **Communication & Letters**  
   - Tự động tạo thư thông báo (compensation statement/letter) đến nhân viên về mức lương/ thưởng mới sau khi đã được phê duyệt.  
   - Có thể cá nhân hoá mẫu thư, đính kèm thông tin chi tiết về quyền lợi, phúc lợi.

---

## 5. Tóm tắt

- **Oracle Compensation** tập trung vào **thiết kế** (Design), **vận hành** (Administration), **phân bổ** (Allocation) và **phê duyệt** (Approval) các chương trình lương thưởng.  
- Cốt lõi của mô-đun này xoay quanh việc thiết lập các **Compensation Plans** (Salary, Bonus, Equity…), ghép lại trong **Compensation Program**, xác định **eligibility**, quản lý **budget**, và hỗ trợ quy trình **manager self-service** cùng **approval workflow**.  
- Sau khi chốt kết quả, dữ liệu được **tích hợp** sang Payroll để chi trả hoặc cập nhật sang hồ sơ nhân viên.  
- Với các tính năng hỗ trợ **analytics**, **reporting**, và **modeling**, doanh nghiệp có thể quản lý và tối ưu chi phí nhân sự, đồng thời cải thiện sự minh bạch và công bằng trong việc trả lương thưởng.

Như vậy, toàn bộ logic của Oracle Compensation xoay quanh việc “lấy input từ HR, phân bổ quyền đề xuất cho các cấp, ràng buộc bởi luật/quy tắc, theo dõi ngân sách, xử lý phê duyệt, và cuối cùng chuyển đổi thành kết quả lương thưởng chính thức” – giúp đảm bảo quy trình trả công (pay-for-performance) nhất quán, minh bạch, và phù hợp với chiến lược nhân sự tổng thể của doanh nghiệp.


Trong bộ giải pháp Oracle HCM Cloud, **Compensation**, **Payroll**, và **Benefits** có những chức năng và phạm vi sử dụng riêng, dù chúng có mối quan hệ chặt chẽ và thường được triển khai đồng bộ. Dưới đây là điểm khác biệt chính:

---

## 1. Oracle Compensation
- **Chức năng chính**: Quản lý toàn bộ **chương trình lương thưởng** (total rewards), bao gồm:
  - Xây dựng và quản lý **cấu trúc lương** (salary plan), bảng lương, bậc lương.  
  - Thiết kế các **kế hoạch thưởng** ngắn hạn/dài hạn (bonus, cổ phiếu, stock options, allowances...).  
  - Thiết lập **ngân sách** (budget) cho từng phòng ban, đối tượng nhân viên.  
  - Cấu hình **quy trình phê duyệt**, **quy tắc** (rules/guidelines) về mức tăng, điều kiện áp dụng (eligibility).  
  - Cung cấp **worksheet** cho các cấp quản lý nhập và đề xuất các khoản lương, thưởng; đồng thời thực hiện phê duyệt theo workflow.
- **Mục tiêu**:  
  - Tập trung vào **thiết kế và phân bổ** lương thưởng (phần “tính toán” chủ yếu là các công thức để xác định mức tăng hoặc thưởng theo quy tắc, chứ không phải tính bảng công chi tiết cho từng kỳ trả lương).  
  - Hỗ trợ quá trình ra quyết định dựa trên ngân sách và hiệu suất, bảo đảm tính minh bạch và công bằng trong trả công.  

Nói cách khác, **Oracle Compensation** giúp doanh nghiệp xác định *mức lương* (base salary), *tỷ lệ thưởng*, *chiến lược và ngân sách* trả thưởng, nhưng chưa thực hiện việc tính toán **gross-to-net** (lương gộp và lương thực nhận) hay **khấu trừ thuế/bảo hiểm** để trả cho nhân viên.  

---

## 2. Oracle Payroll
- **Chức năng chính**: Thực hiện **tính toán lương thực tế** (thường gọi là “gross to net”) và **trả lương** cho nhân viên, bao gồm:
  - Cấu hình **earnings** (các khoản thu nhập) và **deductions** (các khoản khấu trừ).  
  - Quản lý **luật thuế** (tax), **bảo hiểm**, **phí công đoàn**, **pháp lý**... tùy theo từng quốc gia/khu vực.  
  - Xử lý các **kỳ trả lương** (payroll cycle), tính toán chính xác số tiền cuối cùng (net pay) đến tay nhân viên.  
  - Tổng hợp và **phát hành phiếu lương** (pay slip), thực hiện **nộp thuế**, **báo cáo** cho cơ quan quản lý (nếu có).  
- **Mục tiêu**:  
  - Đảm bảo **tính chính xác** và **tuân thủ pháp lý** khi trả lương.  
  - Thực hiện mọi khâu **kế toán - tài chính** liên quan đến lương, tạo các bút toán cần thiết (accounting entries).

Vì vậy, trong khi **Compensation** tập trung vào khía cạnh *thiết kế và hoạch định* (lương, thưởng), thì **Payroll** chịu trách nhiệm cho việc *xử lý tính toán* cụ thể (lương kỳ này bao nhiêu, trừ thuế và BHXH thế nào, phát lương ra sao, lưu trữ hồ sơ gì…).

---

## 3. Oracle Benefits
- **Chức năng chính**: Quản lý **chương trình phúc lợi** (benefits program) cho nhân viên, chẳng hạn:
  - Các gói bảo hiểm y tế, nha khoa, thị lực, bảo hiểm nhân thọ, bảo hiểm tai nạn…  
  - Các kế hoạch hưu trí (retirement plan), quỹ hưu (pension), 401(k) (nếu ở Mỹ), hoặc các chương trình hỗ trợ tài chính khác.  
  - Hỗ trợ quy trình **đăng ký** (enrollment), **thay đổi** (life events) quyền lợi của nhân viên.  
  - Tính toán **chi phí** phúc lợi, quản lý **mức đóng** của doanh nghiệp và nhân viên.  
- **Mục tiêu**:  
  - Cho phép nhân viên lựa chọn/hay thay đổi gói phúc lợi (Self-Service), đảm bảo quản lý đầy đủ thông tin quyền lợi.  
  - Tích hợp với Payroll để tính các khoản khấu trừ benefit (nếu nhân viên có đóng góp).  

Như vậy, **Benefits** khác với **Compensation** ở chỗ tập trung sâu vào **chính sách và gói phúc lợi** (bảo hiểm, hưu trí, phụ cấp y tế…), thay vì các khoản **lương, thưởng** trực tiếp trong mục tiêu “total rewards.”  

---

## 4. Tóm tắt: Sự khác biệt giữa Compensation, Payroll và Benefits

1. **Compensation**  
   - Phạm vi: Xây dựng chiến lược lương thưởng tổng thể, quyết định mức tăng lương, bonus, cổ phần, ngân sách, phê duyệt.  
   - Chưa tính **lương “net”** cụ thể, mà chủ yếu đưa ra “số liệu” (mức lương, bonus) để chuyển sang Payroll.

2. **Payroll**  
   - Phạm vi: Thực hiện tính lương chi tiết, bao gồm mọi khâu tính thuế, BHXH, chế độ bắt buộc, trả lương ròng, xuất phiếu lương.  
   - Nhận đầu vào từ Compensation (khi có thay đổi về lương, thưởng) để trả cho nhân viên.

3. **Benefits**  
   - Phạm vi: Quản lý các gói phúc lợi (bảo hiểm, hưu trí, trợ cấp) và hỗ trợ đăng ký (enrollment).  
   - Tích hợp với Payroll nếu có các khoản khấu trừ benefit.

Vì vậy, **Oracle Compensation** không thay thế cho **Oracle Payroll**; nó đưa ra các con số (lương, thưởng, stock…) trên cơ sở quy tắc về hiệu suất, ngân sách, cấp bậc. Còn “tính toán bảng lương thực tế” lại là nhiệm vụ của **Oracle Payroll**. Và với **Oracle Benefits**, bạn tập trung vào quyền lợi phi lương (chủ yếu bảo hiểm, hưu trí), khác với những khoản lương & thưởng hiện tiền.


Dưới đây là một ví dụ về **cấu trúc dữ liệu (data model)** cho mô-đun Compensation được viết bằng ngôn ngữ **DBML**. Mô hình này lấy cảm hứng từ logic của Oracle Compensation, nhưng đồng thời thực hiện một số **tối ưu** nhằm:

1. **Tăng tính linh hoạt** (dễ mở rộng thêm loại kế hoạch lương thưởng, cấu hình, rule...).  
2. **Đơn giản hoá thiết kế** (tránh quá nhiều bảng con, dùng cấu trúc quan hệ nhiều-nhiều hợp lý).  
3. **Nâng cao hiệu quả triển khai** (dễ implement các màn hình UI/UX cũng như viết API tích hợp).

> **Lưu ý**: Tên bảng, trường, kiểu dữ liệu có thể tuỳ chỉnh theo convention của dự án. Các ví dụ về kiểu dữ liệu (VARCHAR, DECIMAL, DATE,…) và độ dài chỉ mang tính minh hoạ.

---

```dbml
//////////////////////////////////////////////////////////////////////////////
// 1. Các bảng chính: Compensation Program, Compensation Plan, Plan Component
//////////////////////////////////////////////////////////////////////////////

Table compensation_program {
  id                int          [pk, increment, note: "Khoá chính, tự tăng"]
  program_name      varchar(200) [not null, note: "Tên chương trình (vd: Annual Compensation 2025)"]
  description       text         [note: "Mô tả chi tiết chương trình"]
  start_date        date         [not null, note: "Ngày bắt đầu chương trình"]
  end_date          date         [note: "Ngày kết thúc chương trình (nếu có)"]
  is_active         boolean      [default: true, note: "Đang kích hoạt hay không"]
  
  indexes {
    (program_name)  [unique]
  }
}

Table compensation_plan {
  id              int          [pk, increment]
  plan_name       varchar(200) [not null, note: "Tên plan (vd: Salary Plan, Bonus Plan)"]
  plan_type       varchar(50)  [not null, note: "Loại plan (SALARY | BONUS | EQUITY | ALLOWANCE | OTHERS...)"]
  description     text         [note: "Mô tả chi tiết về plan"]
  program_id      int          [not null, ref: > compensation_program.id, note: "Thuộc về compensation_program nào"]
  is_active       boolean      [default: true]
}

Table plan_component {
  id              int          [pk, increment]
  plan_id         int          [not null, ref: > compensation_plan.id, note: "Liên kết với bảng compensation_plan"]
  component_name  varchar(100) [not null, note: "Tên của thành phần (vd: Base Salary, Bonus % theo Performance)"]
  component_type  varchar(50)  [note: "Kiểu thành phần (FIXED_AMOUNT, PERCENTAGE, FORMULA, STOCK, ...)"]
  calculation_rule text        [note: "Công thức tính hay rule tính toán (nếu cần)"]
  min_value       decimal(18,2) [note: "Giá trị tối thiểu (nếu có)"]
  max_value       decimal(18,2) [note: "Giá trị tối đa (nếu có)"]
  is_mandatory    boolean      [default: false, note: "Có bắt buộc áp dụng hay không"]
}


//////////////////////////////////////////////////////////////////////////////
// 2. Eligibility (điều kiện tham gia) & Budget (ngân sách)
//////////////////////////////////////////////////////////////////////////////

Table eligibility_profile {
  id                int          [pk, increment]
  profile_name      varchar(200) [not null, note: "Tên profile điều kiện (vd: Senior Staff, Sales Department...)"]
  description       text         [note: "Mô tả chi tiết"]
  is_active         boolean      [default: true]
}

Table plan_eligibility {
  id                int          [pk, increment]
  plan_id           int          [not null, ref: > compensation_plan.id]
  eligibility_id    int          [not null, ref: > eligibility_profile.id, note: "Kết nối 1 Plan với 1 Eligibility Profile"]
  
  // Bảng này biểu thị quan hệ nhiều-nhiều (nhiều plan - nhiều profile)
}

Table budget_pool {
  id                int          [pk, increment]
  plan_id           int          [not null, ref: > compensation_plan.id]
  pool_name         varchar(200) [not null]
  total_amount      decimal(18,2) [not null, default: 0, note: "Ngân sách cho pool này"]
  currency_code     varchar(10)   [default: "USD", note: "Loại tiền tệ"]
  department_id     int          [note: "Có thể gắn với phòng ban cụ thể, tuỳ logic triển khai"]
  manager_id        int          [note: "Người quản lý ngân sách này (nếu cần)"]
  is_active         boolean      [default: true]
}


//////////////////////////////////////////////////////////////////////////////
// 3. Chu kỳ (Cycle) & Worksheet (bảng nhập thông tin cho Manager)
//////////////////////////////////////////////////////////////////////////////

Table compensation_cycle {
  id                int          [pk, increment]
  program_id        int          [not null, ref: > compensation_program.id]
  cycle_name        varchar(200) [not null, note: "Tên chu kỳ (vd: Annual 2025, Mid-Year 2025)"]
  start_date        date         [not null]
  end_date          date         [not null]
  is_active         boolean      [default: true]
}

Table manager_worksheet {
  id                int          [pk, increment]
  cycle_id          int          [not null, ref: > compensation_cycle.id, note: "Worksheet thuộc chu kỳ nào"]
  manager_id        int          [not null, note: "Khoá định danh Manager (có thể tham chiếu sang bảng nhân sự)"]
  created_date      datetime     [default: `now()`]
  status            varchar(50)  [default: "OPEN", note: "Trạng thái (OPEN, SUBMITTED, APPROVED, REJECTED...)"]
}

Table manager_worksheet_detail {
  id                int          [pk, increment]
  worksheet_id      int          [not null, ref: > manager_worksheet.id]
  employee_id       int          [not null, note: "Nhân viên được đề xuất lương thưởng"]
  plan_id           int          [not null, ref: > compensation_plan.id]
  component_id      int          [ref: > plan_component.id, note: "Áp dụng cho thành phần cụ thể (nếu tách chi tiết)"]
  proposed_value    decimal(18,2) [note: "Giá trị đề xuất (số tiền hoặc % hoặc ... )"]
  currency_code     varchar(10)   [default: "USD"]
  note              text         [note: "Ghi chú của Manager"]
}


//////////////////////////////////////////////////////////////////////////////
// 4. Approval Workflow (tuỳ chọn) & Kết quả cuối cùng
//////////////////////////////////////////////////////////////////////////////

Table approval_workflow {
  id                int         [pk, increment]
  name              varchar(200) [not null]
  description       text
  is_active         boolean     [default: true]
}

Table approval_node {
  id                int         [pk, increment]
  workflow_id       int         [not null, ref: > approval_workflow.id]
  sequence_no       int         [not null, note: "Thứ tự phê duyệt"]
  approver_role     varchar(100) [not null, note: "Vai trò duyệt (Manager, HR, CFO, CEO, ...)"]
  approver_id       int         [note: "ID thực thể người dùng / manager cụ thể (nếu fix cứng)"]
}

Table manager_worksheet_approval {
  id                int         [pk, increment]
  worksheet_id      int         [not null, ref: > manager_worksheet.id]
  node_id           int         [not null, ref: > approval_node.id]
  approval_status   varchar(50) [default: "PENDING", note: "Trạng thái phê duyệt (PENDING, APPROVED, REJECTED)"]
  approval_date     datetime    [note: "Ngày phê duyệt"]
  comment           text        [note: "Nhận xét của cấp duyệt"]
}


/*
  Bảng final_allocation (tuỳ chọn) chứa kết quả cuối, 
  có thể tách riêng hoặc cập nhật trực tiếp khi Worksheet 
  được duyệt xong. 
*/

Table final_allocation {
  id                int          [pk, increment]
  worksheet_detail_id int        [ref: > manager_worksheet_detail.id, note: "Tham chiếu dòng detail đã được phê duyệt cuối cùng"]
  employee_id       int          [not null]
  plan_id           int          [not null, ref: > compensation_plan.id]
  allocated_value   decimal(18,2) [note: "Giá trị chính thức đã phê duyệt"]
  effective_date    date         [note: "Ngày bắt đầu hiệu lực (áp dụng cho lương/thưởng...)"]
  status            varchar(50)  [default: "ACTIVE"]
}


//////////////////////////////////////////////////////////////////////////////
// 5. Bảng Employee (mô phỏng) - Thông thường sẽ tham chiếu từ HCM/HR module
//////////////////////////////////////////////////////////////////////////////

Table employee {
  id                int          [pk, increment]
  employee_number   varchar(50)  [not null, unique]
  first_name        varchar(100) [not null]
  last_name         varchar(100) [not null]
  department_id     int
  job_id            int
  hire_date         date
  is_active         boolean      [default: true]
}
```

---

## Giải thích tổng quan mô hình

1. **compensation_program**  
   - Đại diện cho một chương trình tổng thể (ví dụ: *Annual Compensation 2025*).  
   - Có thể chứa nhiều chu kỳ (năm, nửa năm) và nhiều gói *compensation_plan* (lương cơ bản, bonus, equity…).

2. **compensation_plan**  
   - Mỗi “plan” mô tả một loại lương thưởng: *Salary Plan*, *Bonus Plan*, *Stock Plan*, *Allowance*, v.v.  
   - Mục **plan_type** để phân biệt các loại.  
   - Kết nối với **compensation_program** qua trường *program_id*.

3. **plan_component**  
   - Chứa chi tiết các thành phần (component) thuộc một plan. Ví dụ, *Bonus Plan* có thể chia ra: *Annual Bonus %*, *Quarterly Bonus %*, *Spot Bonus*,…  
   - Có thể lưu trữ **calculation_rule** (công thức) hoặc **component_type** (là % hay giá trị cố định…).

4. **eligibility_profile** & **plan_eligibility**  
   - **eligibility_profile** quy định điều kiện (vd: nhân viên cấp bậc “Senior”, làm việc ở khu vực “HCM”,…).
   - **plan_eligibility** là bảng trung gian liên kết *n-n* giữa **compensation_plan** và **eligibility_profile** (một plan có thể áp dụng nhiều profile điều kiện, và một profile có thể áp dụng cho nhiều plan).

5. **budget_pool**  
   - Quản lý ngân sách của từng Plan (hoặc chia theo phòng ban, manager).  
   - Gắn với **plan_id** để tách bạch ngân sách cho mỗi plan.

6. **compensation_cycle**  
   - Định nghĩa chu kỳ (cycle) cho một **compensation_program** – ví dụ “Annual Cycle 2025” hoặc “Mid-Year Cycle 2025”.  
   - Mỗi chu kỳ có *start_date, end_date*, *is_active*.

7. **manager_worksheet** & **manager_worksheet_detail**  
   - **manager_worksheet**: Tạo một “phiếu” hoặc “bảng” cho manager, chứa header (thuộc cycle nào, manager nào…).  
   - **manager_worksheet_detail**: Từng dòng chi tiết, mỗi nhân viên + plan + component + giá trị đề xuất.

8. **approval_workflow**, **approval_node**, **manager_worksheet_approval**  
   - Cấu trúc linh hoạt để khai báo 1 workflow (các node phê duyệt theo thứ tự).  
   - **manager_worksheet_approval** ghi nhận lại trạng thái phê duyệt của từng node đối với một worksheet.

9. **final_allocation**  
   - Lưu kết quả cuối cùng (đã duyệt) cho từng chi tiết.  
   - Trường *effective_date* xác định từ thời điểm nào giá trị này có hiệu lực (nếu liên quan đến lương mới).  
   - Từ đây, có thể **tích hợp sang Payroll** để trả lương/thưởng hoặc cập nhật mức lương trên hệ thống HR.

10. **employee** (minh hoạ)  
   - Bảng mô phỏng đại diện cho dữ liệu nhân sự (thường nằm ở phân hệ HR/HCM).  
   - Các trường *department_id, job_id, hire_date*… để tham chiếu khi xác định eligibility.

---

### Tối ưu & Linh hoạt

- **Cách tiếp cận “Component-based”**: Thay vì đổ tất cả thuộc tính vào “compensation_plan”, chúng ta tách nhỏ ra “plan_component” để linh hoạt thêm/bớt các thành phần (Bonus % theo Performance, Allowance, v.v.).  
- **Quan hệ nhiều-nhiều (plan_eligibility)**: Cho phép 1 plan áp dụng cho nhiều Profile điều kiện, và 1 Profile có thể dùng cho nhiều plan, tối ưu cho các tổ chức lớn.  
- **Worksheet chi tiết (manager_worksheet_detail)**: Giúp manager nhập liệu chi tiết cho từng nhân viên, gắn với plan & component. Đây là chỗ **tùy biến** cao (có thể cài đặt logic UI hiển thị).  
- **Approval linh động**: Tách “approval_workflow” và “approval_node” để tùy biến nhiều kịch bản phê duyệt (theo cấp bậc, theo phòng ban, theo vai trò).  
- **final_allocation**: Tạo bảng riêng để lưu trữ bản chốt (snapshot) sau duyệt, hỗ trợ truy vết lịch sử (audit) và báo cáo.

Như vậy, mô hình này vừa **bám sát** ý tưởng của Oracle Compensation (Chương trình - Plan - Component - Eligibility - Budget - Worksheet - Approval - Final Allocation), vừa **đơn giản hoá** cấu trúc để tiện mở rộng và giảm độ phức tạp khi triển khai thực tế.


Dưới đây là một số gợi ý và thực tiễn triển khai dựa trên kinh nghiệm với các doanh nghiệp quy mô lớn, khi họ cần thiết kế mô-đun Compensation:

---

## 1. Tổ chức **Compensation Program** và **Plan**

### 1.1. Một doanh nghiệp có thể có **nhiều Compensation Program** hay chỉ duy nhất một?

- **Tuỳ chiến lược và nhu cầu quản lý**:  
  - Nhiều doanh nghiệp thường có **một chương trình tổng** cho cả năm (vd: “Annual Compensation 2025”).  
  - Trong chương trình này, có thể có nhiều **chu kỳ** (cycle) khác nhau, ví dụ: 
    - **Chu kỳ chính**: Annual Merit (xem xét tăng lương hàng năm).  
    - **Chu kỳ bonus**: Có thể tách riêng nếu doanh nghiệp muốn bonus giữa năm (Mid-year Bonus), cuối năm (Year-end Bonus).  
  - Ngoài ra, nếu công ty có những **chính sách rất đặc thù** cho từng nhóm (nhóm c-level, nhóm sales, nhóm tech…), đôi khi họ chọn **tách** ra thành các **Compensation Program** riêng (vì logic và quy tắc tính khác biệt hẳn).  

- **Lý do tách thành nhiều Program** thường là:  
  1. Khung thời gian khác nhau (một số “program” chạy quanh năm, một số chạy theo quý).  
  2. Chính sách, quy tắc phê duyệt, ngân sách khác nhau hoàn toàn.  
  3. Đối tượng và mục tiêu khác nhau (vd: một “Long-Term Incentive Program” dành riêng cho cấp quản lý cao cấp).  

- **Tuy nhiên**, để **đơn giản** cho người dùng cuối (manager/HR), nhiều công ty vẫn **gom tất cả** vào **một Program lớn** (vd: “Annual Total Rewards Program”) và bên trong **phân thành các plan** (Salary Plan, Bonus Plan, Equity Plan…). Rồi dùng **Compensation Cycle** để tách thời điểm vận hành.

\=> **Thực tiễn**: Thông thường, với 1 năm tài chính, doanh nghiệp hay duy trì **1 Compensation Program chính** (Annual), trong đó chứa **nhiều plan**; nhưng vẫn có thể có thêm **các Program phụ** (độc lập) cho những nhóm/phạm vi riêng.

---

### 1.2. Nên có nhiều Plan hay **nhiều plan-type** cho các nhóm đối tượng (profile) khác nhau?

- **Nhiều “Plan” trong cùng một “Plan Type”**:  
  - Chẳng hạn, “Bonus Plan” là **plan type = BONUS**. Nhưng trong doanh nghiệp, có thể có 2-3 kiểu bonus khác nhau:  
    1. **Annual Performance Bonus** (áp dụng cho nhân viên chính thức ≥ 1 năm)  
    2. **Sales Commission** (chỉ áp dụng cho Sales)  
    3. **Project Completion Bonus** (áp dụng cho nhóm tech, R&D…)  
  - Chúng ta có thể cấu hình **3 plan** riêng (cùng `plan_type = BONUS`), mỗi plan gắn với **eligibility profile** khác nhau, và có **quy tắc** (rule) tính khác nhau.  

- **Trường hợp** một Plan duy nhất nhưng nhiều **component**:  
  - Thường áp dụng khi các **thành phần** (component) nằm chung trong một “phạm trù” (vd: các loại phụ cấp “Allowance” khác nhau: nhà ở, đi lại, ăn trưa…) mà quy tắc tính tương tự, cùng một thời điểm review. Khi đó, ta có thể gom chung thành 1 “Allowance Plan” với nhiều “component” (Allowance A, B, C).

\=> **Lời khuyên**:  
- Nếu **logic tính** hoặc **đối tượng** (profile) quá khác biệt, ta nên **chia thành các plan** tách rời.  
- Nếu chỉ khác nhau chút ít (cùng loại, cùng vòng review, cách triển khai tương tự), ta có thể **gom chung** vào một plan, chia ra nhiều component.  

---

## 2. Định nghĩa **Eligibility Profile** theo cấp bậc (Grade), phòng ban, hoặc tiêu chí khác

- Doanh nghiệp lớn thường **phân nhiều cấp bậc** (grade level) và **phòng ban** (department).  
- **Eligibility Profile** trong Oracle (hay nói chung) cho phép lọc ra đối tượng nhân viên dựa trên:  
  - **Grade** (cấp bậc), **Job/Position** (chức danh), **Department** (phòng ban), **Location**, **Union Code**, **Performance Rating**...  
- Vì vậy, **để tách nhóm** theo cấp bậc, bạn có thể tạo **một profile ứng với mỗi cấp bậc** hoặc **nhóm cấp bậc** (ví dụ: “Senior Level”, “Manager Level”, “Executive Level”).  
- Sau đó, gắn profile này vào plan phù hợp. Bất kỳ nhân viên nào **thoả mãn** điều kiện (cấp bậc, phòng ban,…) sẽ **xuất hiện** trên worksheet của manager trong plan đó.

\=> Việc chia nhiều profile hay gộp profile phụ thuộc vào mức **chi tiết** doanh nghiệp muốn. Nếu số lượng cấp bậc quá nhiều, đôi khi ta chỉ chia profile lớn (ví dụ: “Staff & Senior”, “Manager & Above”) thay vì tạo mỗi bậc một profile riêng.

---

## 3. **Final Allocation** được sử dụng như thế nào với Payroll?

- **Final Allocation** (hoặc “Allocation Result”) chính là kết quả **mức lương, thưởng** cuối cùng đã **phê duyệt**.  
- Đây là **đầu vào** cho **Oracle Payroll** (hoặc một hệ thống tính lương khác) để:  
  1. **Cập nhật lại lương cơ bản (base salary)** cho những ai được tăng lương.  
  2. **Tính và chi trả bonus** cho những ai được thưởng (theo kỳ, theo tháng, theo năm…).  
  3. **Tổng hợp với dữ liệu chấm công (Time & Absence)**, nếu lương được tính theo giờ/ngày công hoặc bonus có ràng buộc giờ làm.  

- **Trong Payroll**, sẽ có logic “gross to net” (trừ thuế, bảo hiểm, khoản khấu trừ…) để ra số tiền thực nhận. Nhưng mức **foundation** (mức lương hay bonus “gộp” ban đầu) thường được lấy từ **Final Allocation**.  

\=> Tóm lại, **Final Allocation** là **số liệu chính thức** về lương/thưởng mà module Compensation đã “duyệt”; Payroll chỉ việc **nhận input** này + dữ liệu chấm công (nếu cần) để thực hiện **tính và trả lương**.

---

## 4. Tóm tắt & Gợi ý triển khai

1. **Tổ chức 1 hay nhiều Program**:  
   - Thường **1 program** lớn cho cả năm (Annual) + nhiều **cycles** (Merit cycle, Bonus cycle), **hoặc** tách thành 2-3 program riêng nếu có logic/chính sách khác hẳn.

2. **Tổ chức Plan** và Plan Type:  
   - Chia Plan theo loại: **Salary** (tăng lương), **Bonus** (thưởng), **Stock/Equity** (cổ phần), **Allowance** (phụ cấp), v.v.  
   - Nếu cùng loại mà khác đối tượng/quy tắc, có thể tạo **nhiều plan** cùng `plan_type` để tách rõ ràng.

3. **Sử dụng Eligibility Profile**  
   - Để **giới hạn** đúng nhóm nhân viên (theo cấp bậc, phòng ban, khu vực…).  
   - Chỉ những ai đạt điều kiện mới “xuất hiện” trên Manager Worksheet.

4. **Kết nối với Payroll**  
   - Sau khi duyệt, **Final Allocation** hoặc “Final Results” -> **cập nhật** sang Payroll.  
   - Payroll sẽ dựa trên dữ liệu này (cùng với thông tin Time & Absence, công thức thuế/BHXH) để **tính toán** lương thực tế (Net Pay).

Như vậy, mô hình chung là:  
- **Compensation**: Quyết định *nên trả bao nhiêu* (lương/bonus…)  
- **Payroll**: Tính *thực trả* (sau thuế/khấu trừ).

Hy vọng những chia sẻ trên giúp bạn hình dung rõ hơn về cách thiết kế “Compensation Program”, “Plan”, “Eligibility Profile” và cách chuyển kết quả sang Payroll.



