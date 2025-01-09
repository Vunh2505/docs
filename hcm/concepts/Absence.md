Dưới đây là **Tài Liệu Concept** (khái niệm tổng quan) cho **Module “Absence Management”** thuộc giải pháp HR. Tài liệu này giúp tất cả thành viên dự án – từ đội ngũ business, phân tích nghiệp vụ, đến đội ngũ kỹ thuật – có cái nhìn thống nhất về các **thực thể** (entities), **khái niệm** và **luồng dữ liệu** (data flow) trong module. Tài liệu cũng kèm **ví dụ minh hoạ** (sample data) để làm rõ cách các thực thể liên kết và tương tác.

---

# Tài Liệu Concept: Module “Absence Management”

## 1. Mục tiêu

- Cung cấp **khung khái niệm** thống nhất về **quản lý nghỉ phép** trong giải pháp HR.  
- Mô tả rõ các **thực thể** chính (Leave Type, Leave Account Class, Leave Account, Leave Transaction, Leave Request, v.v.) và **mối quan hệ** giữa chúng.  
- Hỗ trợ người dùng (khách hàng, quản trị hệ thống, đội triển khai) nắm bắt cách **quản lý** và **sử dụng** dữ liệu nghỉ phép.  
- Làm nền tảng để phát triển/ tích hợp với các tính năng khác như **Workflow Phê duyệt**, **Chấm công**, **Payroll**, **Báo cáo**, v.v.

---

## 2. Tổng quan

**Module “Absence Management”** cho phép doanh nghiệp thiết lập và quản lý toàn bộ chính sách, quy trình nghỉ phép cho nhân viên. Tương tự mô hình “banking”, mỗi nhân viên có một (hoặc nhiều) **tài khoản nghỉ phép** (Leave Account) để theo dõi **số dư** (balance) và **các giao dịch** (transactions) như cộng ngày phép (accrual), trừ ngày phép (leave taken), điều chỉnh (adjustment), quy đổi thành tiền (encashment), v.v.

Các tính năng chính gồm:

1. Định nghĩa **Leave Type** (loại nghỉ phép): Annual Leave, Sick Leave, Maternity, v.v.  
2. Quản lý **Leave Account Class** (lớp tài khoản) cho từng loại nghỉ, hỗ trợ cấu hình overdraft, tham số bổ sung, restriction sự kiện.  
3. Tạo và quản lý **Leave Account** cho nhân viên: theo dõi current balance, block balance, v.v.  
4. Ghi nhận **Leave Transaction** (các bút toán nợ/có), tự động hoặc thủ công, giúp **audit** toàn bộ biến động.  
5. Quản lý **Leave Request** (yêu cầu nghỉ phép), **Leave Adjustment** (điều chỉnh), **Encashment** (quy đổi tiền), v.v.  
6. Lưu **Leave Balance Snapshot** định kỳ hoặc theo sự kiện để phục vụ báo cáo, kiểm soát.  
7. Cho phép **Block** một phần số dư tạm thời (tránh bị dùng hai lần khi chưa được duyệt, hoặc nhằm các mục đích đặc thù).

---

## 3. Các Thực Thể Chính và Ý nghĩa

### 3.1. Leave Type
- **Mục đích**: Đại diện cho **loại nghỉ phép** (Vacation, Sick Leave, Maternity Leave...).  
- **Thuộc tính chính**:  
  - **type_code**, **type_name**: Định danh và tên gọi loại nghỉ (VD: “VACATION” – “Vacation Leave”).  
  - **is_paid**: Chỉ ra loại nghỉ này có được trả lương hay không.  
  - **requires_approval**: Có yêu cầu phê duyệt không.  
  - **add_param** (JSON): Lưu trữ tham số mở rộng, tuỳ chính sách của doanh nghiệp.  
- **Ví dụ**:  
  - **VACATION** (Annual Leave).  
  - **SICK_LEAVE** (Nghỉ ốm có trả lương).  
  - **UNPAID_LEAVE** (Nghỉ không lương).

### 3.2. Leave Account Class  
*(Trước đây là `leave_class`)*  
- **Mục đích**: Nhóm các chính sách, quy tắc quản lý “tài khoản nghỉ phép” gắn với **Leave Type**. Một “Leave Type” có thể có nhiều “Leave Account Class” tuỳ thuộc đối tượng áp dụng.  
- **Thuộc tính chính**:  
  - **class_code**, **class_name**: Mã và tên lớp tài khoản (VD: “ANNUAL_LEAVE_ACCOUNT”).  
  - **leave_type_id**: Thuộc loại nghỉ phép nào.  
  - **overdraft_allowed** và **overdraft_limit**: Cấu hình cho phép tài khoản bị âm (thấu chi ngày phép) và giới hạn bao nhiêu.  
  - **add_param** (JSON): Tham số mở rộng khác.  
- **Ví dụ**:  
  - “ANNUAL_LEAVE_ACCOUNT” gắn với “VACATION”.  
  - “SICK_LEAVE_ACCOUNT” gắn với “SICK_LEAVE”.

### 3.3. Event
- **Mục đích**: Mô tả **các sự kiện** dẫn đến thay đổi số dư nghỉ phép (accrual, carryover, request, encashment, adjustment...).  
- **Thuộc tính chính**:  
  - **event_code**, **event_name**, **event_type**.  
  - **parameters** (JSON) để lưu config (VD: “mỗi tháng accrual 1.5 ngày”).  
  - **min_days**, **max_days** để quy định giới hạn số ngày.  
  - **workflow_config** (JSON) để gắn luồng phê duyệt.  
- **Ví dụ**:  
  - **ACCRUAL** (cộng ngày phép định kỳ),  
  - **LEAVE_REQUEST**,  
  - **ENCASHMENT** (chuyển ngày phép thành tiền),  
  - **ADJUSTMENT** (điều chỉnh thủ công).

### 3.4. Account Class Event Restriction  
*(Trước đây là `class_event_restriction`)*  
- **Mục đích**: Xác định sự kiện (Event) nào **được phép** hoặc **không được phép** áp dụng lên một **Leave Account Class** cụ thể.  
- **Thuộc tính chính**:  
  - **leave_account_class_id**: Đối tượng “lớp tài khoản”.  
  - **event_id**: Sự kiện cần ràng buộc.  
  - **allow**: `true` / `false`.  
- **Ví dụ**:  
  - “Encashment” không được phép trên “SICK_LEAVE_ACCOUNT”.

### 3.5. Leave Account  
*(Trước đây là `leave_balance`)*  
- **Mục đích**: Đại diện cho **tài khoản** nghỉ phép cụ thể của một nhân viên, thuộc về một **Leave Account Class**.  
- **Thuộc tính chính**:  
  - **employee_id**: Nhân viên sở hữu tài khoản này.  
  - **leave_account_class_id**: Thuộc lớp tài khoản nào.  
  - **current_balance**, **available_balance**: Số dư hiện tại và số dư khả dụng (đã trừ block).  
  - **blocked_balance**: Số dư hiện đang bị block (tạm giữ).  
  - **status**: Ví dụ “Active”, “Closed”.  
- **Ví dụ**:  
  - Tài khoản “Annual Leave” của nhân viên A, “Sick Leave” của nhân viên A, v.v.

### 3.6. Leave Transaction
- **Mục đích**: Lưu các **bút toán** thay đổi số dư tài khoản. Mỗi lần cộng/ trừ ngày phép đều sinh ra một **transaction** (giống Debit/Credit trong ngân hàng).  
- **Thuộc tính chính**:  
  - **leave_account_id**: Tài khoản bị ảnh hưởng.  
  - **event_id**: Sự kiện gây ra transaction (VD: ACCRUAL, LEAVE_REQUEST...).  
  - **amount**: Số ngày (+) hoặc (-).  
  - **drcr_ind**: Debit/Credit (D/C).  
  - **transaction_date**, **value_date**: Ngày phát sinh/ Ngày giá trị.  
  - **reference_id**: Tham chiếu đến request/ adjustment...  
  - **description**, **created_by**: Mô tả, người tạo.  
- **Ví dụ**:  
  - Transaction credit 1.5 ngày do ACCRUAL tháng 01/2024.  
  - Transaction debit 2.0 ngày do LEAVE_REQUEST.

### 3.7. Leave Request
- **Mục đích**: Ghi nhận **yêu cầu nghỉ phép** của nhân viên (start_date, end_date, total_days...).  
- **Thuộc tính chính**:  
  - **employee_id**, **start_date**, **end_date**, **total_days**, **status**, **reason**.  
  - **requested_at**, **approved_by**, **approved_at** (lưu thời điểm và người phê duyệt).  
- **Ý nghĩa**:  
  - Khi duyệt, có thể block số dư trước, sau đó trừ hẳn khi chính thức phê duyệt.

### 3.8. Leave Adjustment
- **Mục đích**: Ghi nhận **điều chỉnh** thủ công hoặc do sai sót. Thường kéo theo một **leave_transaction**.  
- **Thuộc tính chính**:  
  - **leave_account_id**, **adjustment_type** (Manual, Correction...).  
  - **quantity**: Số ngày điều chỉnh.  
  - **adjustment_date**, **reason**, **adjusted_by**.  
- **Ví dụ**:  
  - Admin HR phát hiện quên cộng ngày, tạo adjustment +2 ngày.

### 3.9. Encashment Request
- **Mục đích**: Quản lý **yêu cầu chuyển số ngày phép thành tiền** (encash).  
- **Thuộc tính chính**:  
  - **leave_account_id**, **quantity**, **amount**, **status** (Requested, Approved, Rejected).  
  - **requested_at**, **approved_by**, **approved_at**.  
- **Ý nghĩa**:  
  - Khi phê duyệt, trừ ngày phép và cập nhật transaction, đồng thời kích hoạt tính lương (nếu tích hợp).

### 3.10. Leave Balance Snapshot
- **Mục đích**: Chụp lại **trạng thái số dư** của tài khoản nghỉ phép tại thời điểm nào đó, phục vụ **báo cáo**, **đối soát**.  
- **Thuộc tính chính**:  
  - **leave_account_id**, **snapshot_date**.  
  - **opening_balance**, **debit_turnover**, **credit_turnover**, **closing_balance**.  
- **Ý nghĩa**:  
  - Tương tự sổ phụ ngân hàng, ghi lại biến động số dư mỗi kỳ (hằng ngày, hằng tháng...).

### 3.11. Leave Account Block
- **Mục đích**: Quản lý việc **block** (tạm giữ) một phần số dư của tài khoản. Ví dụ: Khi có yêu cầu nghỉ phép dài ngày đang chờ duyệt, để tránh dùng “trùng”.  
- **Thuộc tính chính**:  
  - **leave_account_id**, **block_amount**, **start_date**, **end_date**, **status**, **reason**.  
- **Ý nghĩa**:  
  - “Block_amount” được đưa vào “blocked_balance” của “Leave Account”.  
  - Khi hết hạn hoặc khi từ chối yêu cầu, block được “release” và “available_balance” tăng trở lại.

---

## 4. Data Flow hoặc Quy trình Tiêu Biểu

### 4.1. Dòng chảy dữ liệu khi **cộng/trừ số dư**  
1. **Hệ thống** (hoặc admin) kích hoạt **Event** (VD: ACCRUAL).  
2. Tạo **Leave Transaction** (Credit +X ngày) cho mỗi **Leave Account** đủ điều kiện.  
3. **current_balance** và **available_balance** trên tài khoản được cập nhật.

### 4.2. Data Flow khi **nhân viên Request nghỉ**  
1. **Nhân viên** tạo **Leave Request** (start_date, end_date, total_days...).  
2. Hệ thống **Block** tạm `total_days` (nếu chính sách yêu cầu block).  
3. **Quy trình phê duyệt**: Quản lý duyệt -> Tạo **Leave Transaction** (Debit).  
4. Hệ thống **giảm** `current_balance`, **release** block (nếu cần).

### 4.3. Data Flow khi **Adjustment** (điều chỉnh thủ công)  
1. **Admin** nhập **Leave Adjustment** (+/- X ngày).  
2. Hệ thống tạo **Leave Transaction** tương ứng, cập nhật số dư.

### 4.4. Data Flow khi **Encashment**  
1. Nhân viên gửi **Encashment Request**.  
2. Quản lý duyệt -> Hệ thống trừ `quantity` khỏi tài khoản, tính `amount`.  
3. Transaction type: Debit.  
4. Kết nối sang **Payroll** nếu cần chi trả.

### 4.5. Snapshot định kỳ  
1. **Batch job** chạy cuối ngày/tháng, duyệt qua toàn bộ tài khoản.  
2. Ghi **Leave Balance Snapshot** (opening_balance, debit_turnover, credit_turnover, closing_balance).

---

## 5. Ví dụ Dữ liệu Minh Hoạ (Sample Data)

### 5.1. Leave Type

| id | type_code    | type_name         | is_paid | requires_approval | is_active |  
|----|--------------|-------------------|---------|-------------------|----------|
| 1  | VACATION     | Vacation Leave    | true    | true             | true     |
| 2  | SICK_LEAVE   | Sick Leave        | true    | false            | true     |
| 3  | UNPAID_LEAVE | Unpaid Leave      | false   | true             | true     |

### 5.2. Leave Account Class

| id | class_code                | class_name              | leave_type_id | overdraft_allowed | overdraft_limit | is_active |
|----|---------------------------|-------------------------|---------------|-------------------|-----------------|----------|
| 1  | ANNUAL_LEAVE_ACCOUNT     | Annual Leave Account    | 1             | false             | 0.00            | true     |
| 2  | SICK_LEAVE_ACCOUNT       | Sick Leave Account      | 2             | true              | 3.00            | true     |

### 5.3. Event

| id | event_code   | event_name       | event_type      | min_days | max_days |  
|----|--------------|------------------|-----------------|----------|----------|
| 1  | ACCRUAL      | Accrual Event    | Accrual         | 0.0      | 999.99   |
| 2  | LEAVE_REQ    | Leave Request    | Leave Request   | 0.5      | 30.0     |
| 3  | ENCASHMENT   | Encashment Event | Encashment      | 1.0      | 10.0     |

### 5.4. Account Class Event Restriction

| id | leave_account_class_id | event_id | allow  |
|----|------------------------|----------|--------|
| 1  | 2 (SICK_LEAVE_ACCOUNT) | 3 (ENCASHMENT) | false |

*(Sick Leave Account không cho phép Encashment.)*

### 5.5. Leave Account

| id | employee_id | leave_account_class_id | current_balance | available_balance | blocked_balance | status  |
|----|------------|------------------------|----------------|-------------------|-----------------|---------|
| 10 | 101        | 1 (Annual)            | 12.00          | 12.00             | 0.00            | Active  |
| 11 | 101        | 2 (Sick)              | 0.00           | 0.00              | 0.00            | Active  |

*(Nhân viên 101 có 2 tài khoản: Annual, Sick.)*

### 5.6. Leave Transaction

| id  | leave_account_id | event_id | amount | drcr_ind | transaction_date       | reference_id | description         |
|-----|------------------|----------|--------|----------|------------------------|-------------|---------------------|
| 100 | 10 (Ann. L. A/C) | 1 (ACCRUAL) | 2.00   | C        | 2024-01-01 08:00:00    | null        | Accrual Jan 2024    |
| 101 | 10 (Ann. L. A/C) | 2 (LEAVE_REQ)| -1.50  | D        | 2024-02-10 08:00:00    | 200         | Leave Req #200      |

### 5.7. Leave Request

| id  | employee_id | start_date  | end_date    | total_days | status     | reason                  |
|-----|------------|-------------|------------|-----------|-----------|-------------------------|
| 200 | 101        | 2024-02-10  | 2024-02-11 | 1.50      | Approved  | Personal (Family event) |

### 5.8. Leave Adjustment

| id  | leave_account_id | adjustment_type | quantity | adjustment_date       | reason                 | adjusted_by |
|-----|------------------|-----------------|----------|-----------------------|------------------------|------------|
| 300 | 10 (Ann. L. A/C) | Manual          | 1.00     | 2024-03-01 09:00:00   | Quên cộng ngày Tết     | 102 (HR)   |

### 5.9. Encashment Request

| id  | leave_account_id | quantity | amount   | status    | requested_at         | approved_by | approved_at          |
|-----|------------------|----------|----------|----------|----------------------|------------|----------------------|
| 400 | 10 (Ann. L. A/C) | 2.00     | 1000000  | Approved | 2024-03-15 10:00:00  | 102 (HR)   | 2024-03-16 08:00:00  |

### 5.10. Leave Balance Snapshot

| id  | leave_account_id | snapshot_date | opening_balance | debit_turnover | credit_turnover | closing_balance |
|-----|------------------|---------------|-----------------|----------------|-----------------|-----------------|
| 500 | 10              | 2024-02-01    | 10.00           | 2.00           | 0.00            | 8.00            |

### 5.11. Leave Account Block

| id  | leave_account_id | block_amount | start_date  | end_date    | status   | reason                    |
|-----|------------------|-------------|-------------|------------|----------|---------------------------|
| 600 | 10              | 1.50        | 2024-02-05  | 2024-02-09 | Released | Block tạm cho Leave Req   |

---

## 6. Các Tính năng/Logic Quan trọng

1. **Overdraft**:  
   - Cho phép tài khoản nghỉ phép bị âm trong phạm vi `overdraft_limit`.  
   - Hệ thống kiểm tra `overdraft_allowed` trước khi cho phép.  

2. **Block Số Dư**:  
   - Khi có request dài ngày, hệ thống block số dư để đảm bảo nhân viên không dùng chồng chéo.  
   - Nếu bị từ chối, block được “release” (trả lại vào available_balance).  

3. **Accrual & Carryover**:  
   - Event ACCRUAL: Cộng ngày phép tự động (hàng tháng, hàng năm,...).  
   - Event CARRYOVER: Chuyển số dư còn lại sang năm tiếp theo (nếu chính sách).  

4. **Adjustment**:  
   - Hỗ trợ điều chỉnh +/- do sai sót hay chính sách đột xuất.  
   - Tự động sinh transaction để audit (Manual/CORR).  

5. **Encashment**:  
   - Event ENCASHMENT quy đổi ngày phép thành tiền.  
   - Tích hợp module **Payroll** nếu cần trả lương/tiền.  

6. **Workflow Config**:  
   - Các event (LEAVE_REQUEST, ENCASHMENT...) có thể gắn cấu hình luồng phê duyệt (VD: 1-3 ngày do line manager duyệt, 3-5 ngày do director duyệt...).  

7. **Snapshot**:  
   - “Sổ phụ tài khoản” ghi nhận biến động theo ngày/kỳ, phục vụ **reporting** và **kiểm toán**.  

---

## 7. Lợi ích & Ứng dụng

- **Quản lý nghỉ phép tối ưu**: Hạn chế nhầm lẫn, trùng lặp, mất dấu giao dịch.  
- **Minh bạch & Audit dễ dàng**: Mọi thay đổi số dư được log qua “transaction” giống hạch toán ngân hàng.  
- **Tùy biến & Mở rộng**:  
  - Cho phép overdraft, block, carryover, encashment,...  
  - Có thể tích hợp Workflow, Payroll, Chấm công.  
- **Cấu hình chính sách linh hoạt**: Tách biệt **leave_type** – **leave_account_class**, hỗ trợ nhiều scenario cho nhiều nhóm nhân viên.  
- **Báo cáo và đối soát mạnh mẽ**:  
  - Snapshot, transaction log, block log.  
  - Giao diện hỗ trợ HR/manager theo dõi dễ dàng.

---

## 8. Tóm tắt

**Module “Absence Management”** vận hành như một hệ thống tài khoản – giao dịch cho nghỉ phép, bao gồm:

- **Leave Type**: Định nghĩa loại nghỉ (có lương/không lương, cần duyệt/không cần duyệt...).  
- **Leave Account Class**: Gói chính sách nghỉ (overdraft, carryover...).  
- **Leave Account**: Tài khoản nghỉ của từng nhân viên, với các trường **current_balance**, **available_balance**, **blocked_balance**.  
- **Leave Transaction**: Ghi nhận mọi hoạt động nợ/có (VD: Accrual, Request...).  
- **Leave Request**, **Adjustment**, **Encashment**: Các hành động thường gặp, kèm luồng phê duyệt.  
- **Snapshot**, **Block**: Hỗ trợ đối soát, chụp số dư, và block số ngày trong quá trình chờ xử lý.  

Mô hình này mang lại **tính minh bạch**, **dễ dàng mở rộng**, và **quản lý chặt chẽ** ngày phép của nhân viên trên cùng một nền tảng.

---

## 9. Phụ lục: Triển khai Thực tế

1. **Cấu hình ban đầu**:  
   - Tạo danh sách **Leave Type** (Annual, Sick,...).  
   - Khởi tạo **Leave Account Class** cho từng nhóm.  
   - Xác định restriction (không cho encash SICK_LEAVE,...).  
   - Tích hợp luồng phê duyệt (workflow_config).  

2. **Tạo tài khoản**:  
   - Mỗi nhân viên mới được cấp tài khoản nghỉ theo class phù hợp (Annual, Sick...).  
   - Hoặc chạy batch tự động để cấp.  

3. **Vận hành**:  
   - Hàng tháng/ quý chạy event **ACCRUAL** cộng ngày.  
   - Khi nhân viên request: block số dư, đợi phê duyệt, trừ ngày.  
   - Lưu mọi **transaction** để audit.  

4. **Báo cáo & Kiểm tra**:  
   - **Leave Balance Snapshot** chạy định kỳ/ cuốn chiếu.  
   - HR có thể tra cứu chi tiết, so sánh, in sổ.  

5. **Tích hợp**:  
   - **Payroll** (xử lý encashment).  
   - **Chấm công** (giảm công chấm khi nghỉ).  
   - **Performance** (tổng số ngày nghỉ...).  

---

### Kết luận

Tài liệu Concept này đã phác thảo những **thành phần cốt lõi** của module **“Absence Management”** và **cách chúng liên kết** với nhau. Qua đó, doanh nghiệp và đội ngũ triển khai có **bức tranh tổng thể**, dễ dàng trao đổi, tinh chỉnh, và mở rộng trong quá trình ứng dụng.  

> **Lưu ý**: Các chi tiết về **mô hình dữ liệu** (DB schema) hoặc **logic xử lý** cụ thể (VD: flow phê duyệt, batch accrual, integrate payroll) có thể được làm rõ hơn trong tài liệu thiết kế kỹ thuật hoặc hướng dẫn triển khai/ người dùng riêng.  