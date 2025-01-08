
# Tài Liệu Concept: Module “Organizations”

> Đây là một tài liệu **Concept** (khái niệm tổng quan) cho **Module “Organizations”** thuộc giải pháp HR. Tài liệu này giúp tất cả thành viên dự án – từ đội ngũ business, phân tích nghiệp vụ, đến đội ngũ kỹ thuật – có cái nhìn thống nhất về các **thực thể** (entities), **khái niệm** và **luồng dữ liệu** (data flow) trong module. Tài liệu cũng kèm **ví dụ minh hoạ** (sample data) để làm rõ cách các thực thể liên kết và tương tác.

## 1. Mục tiêu

- Cung cấp **khung khái niệm** thống nhất về **cấu trúc tổ chức** (Organization Structure) trong giải pháp HR.  
- Mô tả rõ các **thực thể** chính (Legal Entity, Business Unit, Place/Location, Job, Position, Project, v.v.) và **mối quan hệ** giữa chúng.  
- Hỗ trợ người dùng (khách hàng, quản trị hệ thống, team triển khai) nắm bắt cách **quản lý** và **sử dụng** dữ liệu tổ chức.  
- Làm nền tảng để phát triển các tính năng khác như **Quản lý Nhân viên**, **Chấm công**, **Tiền lương**, **Quản lý Hiệu suất**, **Quản lý Talent**…

---

## 2. Tổng quan

**Module “Organizations”** cho phép doanh nghiệp thiết lập và quản lý toàn bộ **cấu trúc công ty** và **cấu trúc pháp lý**. Từ **tập đoàn đa quốc gia** với nhiều pháp nhân con, cho đến **doanh nghiệp vừa và nhỏ** chỉ có một vài phòng ban, hệ thống đều có thể đáp ứng. Ngoài ra, module hỗ trợ:

1. Quản lý **Pháp nhân (Legal Entity)**.
2. Xây dựng **Cấu trúc phòng ban (Business Unit)** nhiều cấp, cho phép **nhiều sơ đồ tổ chức** song song.  
3. Quản lý **Địa điểm làm việc** (Place, Location, Work Location) một cách linh hoạt (một trụ sở hoặc nhiều chi nhánh).  
4. Thiết lập **Job** (chức danh chung) và **Position** (vị trí cụ thể), bao gồm kiêm nhiệm, đa tầng báo cáo.  
5. Quản lý **Project** (dự án), liên kết với các phòng ban và vị trí nếu cần.  
6. Theo dõi **thời gian hiệu lực**, **versioning** (nếu muốn lưu lịch sử thay đổi).  
7. Hỗ trợ **phân quyền**, **phê duyệt**, và **báo cáo** đa chiều.

---

## 3. Các Thực thể Chính và Ý nghĩa

### 3.1. Legal Entity (Pháp nhân)
- **Mục đích**: Mô tả các công ty/cơ sở pháp lý thuộc doanh nghiệp; trong trường hợp là tập đoàn, có thể có nhiều pháp nhân con.  
- **Thuộc tính chính**:  
  - **Tên pháp nhân**, **Loại hình**, **Mã số thuế**, **Số đăng ký kinh doanh**, **Ngày thành lập**.  
  - **Quan hệ cha – con** (Parent Legal Entity) cho phép mô phỏng cấu trúc tập đoàn.  
- **Ví dụ**:  
  - “ABC Corporation” (Công ty mẹ).  
  - “ABC VN Co. Ltd.” (Pháp nhân con tại Việt Nam).  
  - “ABC SG Branch” (Chi nhánh tại Singapore).

### 3.2. Business Unit (Đơn vị Tổ chức/Phòng ban)
- **Mục đích**: Thể hiện cấu trúc nội bộ (phòng ban, bộ phận, nhóm). Có thể phân cấp nhiều tầng (Tập đoàn -> Vùng -> Khối -> Phòng -> Nhóm...).  
- **Đặc điểm nổi bật**:  
  - Cho phép **nhiều mô hình**: Theo địa lý, theo chức năng, theo dự án, v.v.  
  - Có thể gán BU vào **nhóm** (Group) hoặc **danh mục** (Category) nhằm phục vụ các mục đích báo cáo khác nhau.  
  - Hỗ trợ **ngày bắt đầu – ngày kết thúc** (start_date – end_date) để quản lý vòng đời của BU.  
- **Ví dụ**:  
  - “Khối Kinh doanh Miền Bắc” thuộc “Công ty A”.  
  - “Phòng IT” (trực thuộc Khối Công nghệ).  
  - “Ban Dự Án Chiến Lược”.

### 3.3. Place, Location, Work Location
- **Place**: Thường là **địa điểm chính** (Campus, Tòa nhà, Nhà máy…). Có thể phân cấp (Ví dụ: “Trụ sở chính” -> “Building A” -> “Tầng 5”).  
- **Location**: Chi tiết hơn, thường là **một khu vực cụ thể** bên trong Place (Ví dụ: “Tầng 5”, “Khu vực Sản xuất”).  
- **Work Location**: Một “điểm” làm việc cụ thể (Ví dụ: “Phòng họp 201”, “Bàn số 12”, “Khu vực Testing”).  
- **Ý nghĩa**: 
  - Giúp **theo dõi** nơi làm việc của nhân viên, vị trí, team.  
  - Tích hợp với **chấm công** (nếu cần), **quản lý tài sản**, hay **bảo trì tòa nhà**.  
- **Ví dụ**:  
  - Place: “Trụ sở ABC – Building 1”.  
  - Location: “Tầng 3 – Khu Marketing”.  
  - Work Location: “Phòng họp 301” (sức chứa 20 người).

### 3.4. Job (Chức danh chung)
- **Mục đích**: Mô tả khái niệm **chức danh** ở mức **tổng quát**, chứa thông tin như **tên Job**, **tiêu chuẩn**, **mô tả nhiệm vụ**, **yêu cầu kỹ năng**.  
- **Phân biệt**: `Job` khác với `Position` (vị trí cụ thể). Một Job có thể có nhiều Position tại các phòng ban khác nhau.  
- **Ví dụ**:  
  - Job “Chuyên viên Marketing” (Marketing Specialist).  
  - Job “Kỹ sư Phần mềm (Software Engineer)”.  
  - Job “Quản lý Dự án” (Project Manager).

### 3.5. Position (Vị trí cụ thể)
- **Mục đích**: Đại diện cho **một ghế** hoặc **một vai trò** cụ thể trong tổ chức, gắn với 1 Business Unit (phòng ban), 1 Job, và có thể **báo cáo** lên Position khác.  
- **Đặc điểm**:  
  - Có **Position Type** (chính thức, thời vụ, part-time, …).  
  - Quản lý **FTE** (Full-time equivalent) nếu cần.  
  - Một người có thể **kiêm nhiệm** nhiều Position.  
  - Có thể **versioning**: Mỗi lần thay đổi (thăng chức, chuyển phòng ban) lưu lại lịch sử.  
- **Ví dụ**:  
  - “Position #1001: Chuyên viên Marketing tại Phòng Marketing”.  
  - “Position #2002: Trưởng phòng IT” (báo cáo cho Giám đốc Công nghệ).

### 3.6. Project (Dự án)
- **Mục đích**: Quản lý **thông tin dự án**, thời gian bắt đầu/kết thúc, và liên kết với các **Business Unit** hoặc **Position**.  
- **Ý nghĩa**:  
  - Có thể 1 dự án do nhiều BU tham gia (N-N relationship).  
  - Hỗ trợ báo cáo, phân bổ nguồn lực (nếu module HR muốn quản lý resource).  
- **Ví dụ**:  
  - “Dự án chuyển đổi số (Digital Transformation)”, “Dự án phát triển sản phẩm mới”.

---

## 4. Data Flow Hoặc Workflow Tiêu Biểu

### 4.1. Dòng chảy dữ liệu khi **tổ chức** cập nhật
1. **Khởi tạo**: Doanh nghiệp thiết lập **Legal Entity** (công ty mẹ, công ty con).  
2. **Tạo Business Unit**: Tạo các phòng ban, bộ phận trực thuộc pháp nhân (hoặc tập đoàn).  
3. **Thiết lập các Place/Location**: Cấu hình địa điểm làm việc (trụ sở, chi nhánh, v.v.).  
4. **Khởi tạo Job**: Tạo chức danh tổng quát (Marketing Specialist, Sales Executive...).  
5. **Tạo Position**:  
   - Chọn Job (Marketing Specialist).  
   - Chọn BU (Phòng Marketing).  
   - Chọn Place/Location (tòa nhà X, phòng Y nếu cần).  
   - Thiết lập chain-of-command (báo cáo cho “Trưởng phòng Marketing”).  
6. **Gán Project** (nếu có): Liên kết Project với BU hoặc Position.  
7. **Quản lý lịch sử** (Versioning): Mỗi thay đổi (chuyển phòng, thăng chức) cập nhật Position/BU, ghi lại ngày hiệu lực.

### 4.2. Data Flow khi **nhân viên** mới gia nhập
1. **Tạo hồ sơ** nhân viên trong module HR core.  
2. **Chọn Position** trống để gán cho nhân viên này. (Position thuộc Business Unit X, Job Y).  
3. **Xác định Place/Work Location** chính thức.  
4. **Nếu có kiêm nhiệm**: Gán thêm Position phụ, Work Location khác.  
5. **Theo dõi**: Tự động hiển thị nhân viên trong sơ đồ tổ chức, báo cáo cho cấp trên tương ứng.

---

## 5. Ví dụ Dữ liệu Minh Hoạ (Sample Data)

Dưới đây là **bảng mẫu** tóm tắt một số thực thể với dữ liệu giả lập:

### 5.1. Legal Entity

| ID | Name                       | ParentEntityID | TaxID     | Form         | IncorporationDate |
|----|----------------------------|----------------|----------|--------------|-------------------|
| 1  | ABC Global Corporation    | (null)         | 000-ABC  | Cổ phần      | 2000-01-01       |
| 2  | ABC Vietnam Co. Ltd.      | 1              | 111-ABC  | TNHH         | 2005-06-01       |

### 5.2. Business Unit

| ID | Name                   | ParentBU | StartDate   | EndDate   | LegalEntityID |
|----|------------------------|----------|------------|----------|---------------|
| 10 | Khối Công nghệ         | (null)   | 2020-01-01 | (null)   | 2             |
| 11 | Phòng IT Hạ Tầng       | 10       | 2020-01-01 | (null)   | 2             |
| 12 | Phòng Phát triển Phần mềm | 10       | 2020-01-01 | (null)   | 2             |
| 13 | Phòng Marketing        | (null)   | 2020-01-01 | (null)   | 2             |

### 5.3. Place & Location

| PlaceID | PlaceName             | ParentPlaceID | Description          |
|---------|-----------------------|---------------|----------------------|
| 1       | Trụ sở chính Hà Nội   | (null)        | Tòa nhà ABC Tower    |
| 2       | Khu Văn phòng Tầng 5  | 1             | Bộ phận IT, Marketing|

| LocationID | LocationName     | PlaceID | ParentLocationID | Description      |
|------------|------------------|---------|------------------|------------------|
| 10         | Phòng IT 501     | 2       | (null)           |                  |
| 11         | Phòng Marketing 502 | 2       | (null)           |                  |

### 5.4. Job

| JobID | JobTitle                | Description                       |
|-------|-------------------------|-----------------------------------|
| 100   | Kỹ sư Phần mềm         | Viết code, triển khai hệ thống... |
| 101   | Trưởng phòng IT        | Quản lý nhân sự, dự án IT...      |
| 102   | Chuyên viên Marketing  | Thực hiện chiến dịch Marketing... |

### 5.5. Position

| PositionID | PositionTitle         | JobID | BU_ID | ReportsTo | EffectiveStart | EffectiveEnd | Notes                  |
|------------|-----------------------|-------|-------|-----------|---------------|-------------|------------------------|
| 1000       | Kỹ sư Phần mềm 1     | 100   | 12    | 1002      | 2020-01-01    | (null)      |                        |
| 1001       | Kỹ sư Phần mềm 2     | 100   | 12    | 1002      | 2020-01-01    | (null)      |                        |
| 1002       | Trưởng phòng IT      | 101   | 10    | (null)    | 2020-01-01    | (null)      |                        |
| 1003       | Chuyên viên Marketing| 102   | 13    | (null)    | 2020-01-01    | (null)      | Báo cáo trực tiếp GĐ   |

### 5.6. Project

| ProjectID | Name                        | StartDate       | EndDate         | Description                         |
|-----------|----------------------------|-----------------|-----------------|-------------------------------------|
| 1         | Dự án Chuyển đổi số        | 2021-01-01     | 2022-12-31      | Liên quan đến mọi phòng ban         |
| 2         | Dự án Sản phẩm Mới         | 2022-01-01     | 2023-06-30      | Marketing + R&D kết hợp             |

*(Ghi chú: Tùy cấu hình, Project có thể liên kết N-N với BU.)*

---

## 6. Các Tính năng/Logic Quan trọng

1. **Parent-Child Relationship**  
   - Legal Entity có thể cha – con (nhiều cấp).  
   - Business Unit cũng có thể nhiều cấp (Khối -> Phòng -> Nhóm...).  
   - Place, Location có thể lồng nhau (Campus -> Building -> Tầng...).  

2. **Versioning & Hiệu lực thời gian**  
   - Có thể theo dõi **start_date, end_date** cho các BU, Position, Project...  
   - Hỗ trợ ghi lại **lịch sử** (nếu end_date cũ -> start_date mới).  

3. **Kiêm nhiệm & Báo cáo**  
   - Nhân viên có thể nắm **nhiều Position** (kiêm nhiệm).  
   - 1 Position có thể báo cáo cho 1 Position khác (theo chuỗi dọc) hoặc báo cáo nhiều line (nếu mô hình matrix).  

4. **Chuyển đổi (Transition)**  
   - Khi một Position đổi job/BU, có thể **tạo version mới** hoặc **đóng** Position cũ, mở Position mới.  
   - Dữ liệu cũ không mất, vẫn lưu cho mục đích báo cáo lịch sử.  

5. **Phân quyền & Phê duyệt** (tùy cấu hình)  
   - Ai được tạo/sửa/xóa BU, Position, Job?  
   - Có luồng approval trước khi thay đổi hay không?

---

## 7. Lợi ích & Ứng dụng

- **Quản lý tập đoàn đa pháp nhân**: Cho phép mở rộng không giới hạn cấp, phù hợp cả doanh nghiệp nhỏ và mô hình đa quốc gia.  
- **Cấu trúc tổ chức đa dạng**: Mô tả đầy đủ các dạng phòng ban, vùng địa lý, ma trận chức năng.  
- **Chính xác thông tin nhân sự**: Gán Position, Work Location rõ ràng, tránh nhầm lẫn khi luân chuyển nhân viên.  
- **Hỗ trợ báo cáo**:  
  - Báo cáo theo **phòng ban**, **địa điểm**, **dự án**.  
  - Phân tích chi phí, nhân sự, công suất làm việc theo nhiều chiều.  
- **Tích hợp tương lai**: Dễ dàng kết nối **Performance Management**, **Talent Management**, **Skill Matching**, **Chấm công**, **Payroll**…

---

## 8. Tóm tắt

**Module “Organizations”** là xương sống của giải pháp HR, cung cấp:

- **Cấu trúc pháp lý** (Legal Entity) cho mọi doanh nghiệp, từ nhỏ đến tập đoàn đa chi nhánh.  
- **Sơ đồ tổ chức** (Business Unit) cho phòng ban, bộ phận, nhóm, hỗ trợ nhiều cây song song.  
- **Quản lý địa điểm** (Place/Location) linh hoạt, kèm các thông tin cần thiết (sức chứa, tọa độ...).  
- **Job – Position** tách biệt, cho phép tái sử dụng mô tả công việc, versioning, kiêm nhiệm, đa luồng báo cáo.  
- **Project** để liên kết nhiều BU, Position, nhằm tổ chức quản lý nguồn lực.  
- **Hỗ trợ lịch sử và báo cáo** (start/end date), đảm bảo dữ liệu chính xác, đáp ứng nhu cầu phân tích.

---

## 9. Phụ lục: Triển khai Thực tế

1. **Phân quyền người dùng**: Quyết định ai là “HR Admin” có thể cập nhật cơ cấu, ai chỉ được xem...  
2. **Thiết lập ban đầu**:  
   - Khai báo các Legal Entity.  
   - Tạo khung BU (theo cấp từ trên xuống).  
   - Tạo Place/Location (nếu cần chi tiết).  
   - Khai Job, thiết lập Position.  
3. **Nhập liệu, mapping**:  
   - Nếu doanh nghiệp đã có dữ liệu trong Excel/ERP, cần map sang module “Organizations”.  
   - Kiểm tra logic (phòng ban cha – con, position còn hiệu lực...).  
4. **Nâng cấp mở rộng**:  
   - Kết nối module “Core HR” để gán nhân viên vào Position.  
   - Tích hợp Payroll, Talent, v.v.

---

### Kết luận

Tài liệu Concept này đã phác thảo những **thành phần cốt lõi** của module “Organizations” và **cách chúng liên kết** với nhau. Qua đó, doanh nghiệp và đội ngũ triển khai có **bức tranh tổng thể**, dễ dàng trao đổi, tinh chỉnh, và mở rộng trong quá trình ứng dụng thực tế.  

> **Note**: Các chi tiết về **mô hình dữ liệu** (DB schema, quan hệ khóa ngoại) hoặc **giao diện người dùng** có thể được trình bày trong tài liệu kiến trúc/thiết kế kỹ thuật hoặc hướng dẫn sử dụng riêng.  
