(function (global) {
  // ===============================
  //    HÀM BĂM MẬT KHẨU
  // ===============================
  // Tuỳ theo nhu cầu, bạn có thể dùng crypto.subtle (nếu chạy HTTPS) hoặc thư viện JS thuần.
  // Ví dụ cơ bản dưới đây minh hoạ việc dùng crypto.subtle SHA-256 (hoặc fallback sang MD5 nếu muốn).
  // Nếu muốn code gọn, chỉ dùng SHA-256, bạn có thể xóa đoạn md5 hoặc thay thế bằng lib tuỳ thích.

  /**
   * Chuyển ArrayBuffer -> Hex string (tiện cho việc so sánh)
   */
  function bufferToHex(buffer) {
    const byteArray = new Uint8Array(buffer);
    const hexCodes = [...byteArray].map(value => {
      const hex = value.toString(16).padStart(2, '0');
      return hex;
    });
    return hexCodes.join('');
  }

  /**
   * Dùng subtle crypto (SHA-256) nếu có thể
   */
  async function sha256Subtle(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return bufferToHex(hashBuffer);
  }

  /**
   * VD: Hàm băm md5 thuần (nếu cần). Hoặc bạn tự import 1 thư viện md5.
   * Ở đây chỉ để demo, nếu không cần md5 thì bỏ đi.
   */
  async function md5(message) {
    // Ở đây bạn có thể import thư viện md5, hoặc tự viết hàm băm md5 thuần JS
    // Demo tạm thời trả về message cũ (KHÔNG PHẢI md5 thật)
    // ==> Hãy thay bằng libs thực tế nếu muốn xài md5
    return Promise.resolve(message);
  }

  /**
   * Hàm tiện ích băm mật khẩu tùy theo config
   * @param {String} message Chuỗi mật khẩu người dùng nhập
   * @param {String} algorithm "sha256" hoặc "md5"
   */
  async function hashPassword(message, algorithm) {
    switch (algorithm) {
      case 'md5':
        return md5(message); // thay thế = library md5 thật nếu cần
      case 'sha256':
      default:
        // fallback mặc định là sha256
        if (window.crypto && window.crypto.subtle) {
          return sha256Subtle(message);
        } else {
          // fallback: bạn có thể import code sha256 thuần JS
          // hoặc tạm báo lỗi
          throw new Error('Trình duyệt không hỗ trợ crypto.subtle, hãy dùng thư viện sha256 thuần JS.');
        }
    }
  }

  // ===============================
  //    PLUGIN CHÍNH
  // ===============================
  function DocsifyAuthPlugin(hook, vm) {
    // Hook này sẽ được gọi trước khi Docsify render nội dung
    hook.beforeEach(async function (content) {
      // Lấy config auth từ $docsify
      const config = (vm.config.auth || {});
      const {
        hashedPassword = '',
        hashingAlgorithm = 'sha256',
        title = 'Authentication Required',
        description = 'Please enter password to continue',
        placeholder = 'Password...',
        buttonText = 'Confirm',
        errorText = 'Incorrect password!',
        successText = 'Login success, loading docs...'
      } = config;

      // Nếu không có hashedPassword thì coi như không yêu cầu auth
      if (!hashedPassword) {
        return content; 
      }

      // Tạo container auth nếu chưa có
      const EXISTING_AUTH = document.querySelector('.docsify-auth-container');
      if (!EXISTING_AUTH) {
        createAuthContainer();
      }

      // Chặn Docsify hiển thị nội dung cho tới khi user xác thực
      await checkAuth();

      // Đảm bảo luôn trả về string để Docsify parse
      if (typeof content !== 'string') {
        return ''; 
      }
      
      // Sau khi xác thực xong, trả về nội dung gốc => docsify render
      return content;

      // ===============================
      //    HÀM TẠO UI AUTH
      // ===============================
      function createAuthContainer() {
        const container = document.createElement('div');
        container.className = 'docsify-auth-container';
        container.style.cssText = `
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          background: #f5f5f5; z-index: 9999;
        `;

        // Title
        const h2 = document.createElement('h2');
        h2.innerText = title;
        container.appendChild(h2);

        // Description
        const p = document.createElement('p');
        p.innerText = description;
        container.appendChild(p);

        // Input
        const input = document.createElement('input');
        input.type = 'password';
        input.placeholder = placeholder;
        input.style.cssText = 'padding: 8px; margin-top: 8px; width: 200px;';
        container.appendChild(input);

        // Button
        const btn = document.createElement('button');
        btn.innerText = buttonText;
        btn.style.cssText = 'padding: 8px 16px; margin-top: 8px;';
        container.appendChild(btn);

        // Error msg
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'color: red; margin-top: 8px; min-height: 1em;';
        container.appendChild(errorDiv);

        // Đăng ký sự kiện
        btn.addEventListener('click', async () => {
          const userInput = input.value.trim();
          if (!userInput) return;

          try {
            const hashedInput = await hashPassword(userInput, hashingAlgorithm);
            if (hashedInput.toLowerCase() === hashedPassword.toLowerCase()) {
              // Thành công
              errorDiv.style.color = 'green';
              errorDiv.innerText = successText;

              // Ẩn container
              setTimeout(() => {
                container.style.display = 'none';
              }, 500);
              // Lưu flag vào localStorage hoặc sessionStorage
              window.localStorage.setItem('docsify-auth', 'true');
            } else {
              // Sai mật khẩu
              errorDiv.style.color = 'red';
              errorDiv.innerText = errorText;
            }
          } catch (err) {
            console.error(err);
            errorDiv.innerText = 'Lỗi khi băm mật khẩu, vui lòng kiểm tra console.';
          }
        });

        document.body.appendChild(container);
      }

      // ===============================
      //    HÀM KIỂM TRA AUTH
      // ===============================
      async function checkAuth() {
        // Kiểm tra localStorage xem đã xác thực chưa
        const isAuthed = window.localStorage.getItem('docsify-auth');
        if (isAuthed === 'true') {
          // Đã xác thực -> không cần hiển thị form
          const container = document.querySelector('.docsify-auth-container');
          if (container) container.style.display = 'none';
          return;
        } else {
          // Chờ user nhập pass
          await new Promise((resolve) => {
            // "Đợi" đến lúc user pass valid -> set localStorage -> container ẩn -> resolve
            const interval = setInterval(() => {
              const authed = window.localStorage.getItem('docsify-auth');
              if (authed === 'true') {
                clearInterval(interval);
                resolve();
              }
            }, 500);
          });
        }
      }
    });
  }

  // Đăng ký plugin vào docsify
  if (!global.$docsify) {
    global.$docsify = {};
  }
  global.$docsify.plugins = (global.$docsify.plugins || []).concat(DocsifyAuthPlugin);

})(this);
