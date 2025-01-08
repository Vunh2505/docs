(function (global) {
  // ===============================
  //    HÀM BĂM MẬT KHẨU BẰNG js-sha256
  // ===============================

  /**
   * Băm message theo thuật toán (hiện tại chỉ hỗ trợ sha256).
   * Muốn hỗ trợ md5 hay các hàm khác, bạn có thể bổ sung.
   * @param {String} message - mật khẩu người dùng nhập
   * @param {String} algorithm - ví dụ 'sha256'
   * @returns {String} - chuỗi hash hex
   */
  function hashPassword(message, algorithm) {
    if (!window.sha256) {
      throw new Error('js-sha256 library not loaded. Hãy import https://cdn.jsdelivr.net/npm/js-sha256 trước plugin này.');
    }
    switch (algorithm) {
      case 'sha256':
      default:
        // Dùng hàm sha256(...) từ file sha256.min.js
        // Trả về chuỗi hex (viết thường) 64 ký tự.
        return window.sha256(message);
    }
  }

  // ===============================
  //    PLUGIN CHÍNH
  // ===============================
  function DocsifyAuthPlugin(hook, vm) {
    // Hook này được gọi trước khi Docsify parse & render nội dung
    hook.init(function() {
      console.log('vm.config =', vm.config);
      console.log('vm.config.auth =', vm.config && vm.config.auth);
    });

    hook.beforeEach(function (content) {
      try {
        // Lấy config auth
        const config = vm.config.auth || {};
        const {
          hashedPassword = '',
          hashingAlgorithm = 'sha256',
          protectRoutes = [], // Mảng route/folder cần bảo vệ
          title = 'Authentication Required',
          description = 'Please enter password to continue',
          placeholder = 'Password...',
          buttonText = 'Confirm',
          errorText = 'Incorrect password!',
          successText = 'Login success, loading docs...'
        } = config;

        // 1) Nếu không cấu hình hashedPassword -> Bỏ qua plugin
        if (!hashedPassword) {
          return content;
        }

        // 2) Kiểm tra route hiện tại có cần protect không
        // vm.route.path => ví dụ "/protected/page1"
        const currentRoute = vm.route.path || '/';
        const needProtect = isProtectedRoute(currentRoute, protectRoutes);
        if (!needProtect) {
          // Route không nằm trong danh sách protect => không cần auth
          return ensureString(content);
        }

        // 3) Tạo container auth nếu chưa có
        if (!document.querySelector('.docsify-auth-container')) {
          createAuthContainer({
            hashedPassword,
            hashingAlgorithm,
            title,
            description,
            placeholder,
            buttonText,
            errorText,
            successText
          });
        }

        // 4) Check localStorage => nếu chưa auth => chặn hiển thị
        const isAuthed = window.localStorage.getItem('docsify-auth');
        if (isAuthed !== 'true') {
          // Người dùng chưa nhập pass => Hiển thị form, Docsify parse nội dung (nhưng ẩn!)
          // => ta có thể return '' để Docsify không parse markdown cũ
          // hoặc return 1 câu "Đang chờ xác thực..." tuỳ ý.
          return '';
        }

        // 5) Đã auth => ẩn form => trả về content
        hideAuthContainer();
        return ensureString(content);

      } catch (err) {
        console.error('DocsifyAuthPlugin error:', err);
        // Để tránh Docsify bị crash, ta trả về string rỗng
        return '';
      }
    });

    // ===============================
    //    Hàm phụ
    // ===============================
    function isProtectedRoute(route, protectList) {
      if (!Array.isArray(protectList) || protectList.length === 0) {
        // Nếu protectRoutes rỗng => coi như không chặn route nào
        return false;
      }
      // Kiểm tra từng phần tử trong protectRoutes
      // route.startsWith(folderPattern)
      // Example: route = "/protected/page1", folderPattern = "/protected/"
      return protectList.some(folder => route.startsWith(folder));
    }

    function ensureString(val) {
      return (typeof val === 'string') ? val : '';
    }

    // ===============================
    //    Tạo container form auth
    // ===============================
    function createAuthContainer({
      hashedPassword,
      hashingAlgorithm,
      title,
      description,
      placeholder,
      buttonText,
      errorText,
      successText
    }) {
      const container = document.createElement('div');
      container.className = 'docsify-auth-container';
      container.style.cssText = `
        position: fixed;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        z-index: 9999;
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

      // Sự kiện click
      btn.addEventListener('click', () => {
        const userInput = input.value.trim();
        if (!userInput) {
          return;
        }
        try {
          // Băm input
          const hashedInput = hashPassword(userInput, hashingAlgorithm);
          if (hashedInput.toLowerCase() === hashedPassword.toLowerCase()) {
            // Đúng mật khẩu
            errorDiv.style.color = 'green';
            errorDiv.innerText = successText;
            // Lưu localStorage
            window.localStorage.setItem('docsify-auth', 'true');

            setTimeout(() => {
              container.style.display = 'none';
              // Docsify sẽ parse lại route => hiển thị markdown
              // Ta có thể trigger Docsify reload route:
              // window.$docsify.route = vm.route.path;
              // window.location.reload(); 
              // *TUỲ* logic, cẩn thận reload nhiều lần => loop.
            }, 500);

          } else {
            errorDiv.style.color = 'red';
            errorDiv.innerText = errorText;
          }
        } catch (err) {
          console.error('Băm mật khẩu lỗi:', err);
          errorDiv.style.color = 'red';
          errorDiv.innerText = 'Đã xảy ra lỗi, xem console để biết thêm.';
        }
      });

      document.body.appendChild(container);
    }

    function hideAuthContainer() {
      const container = document.querySelector('.docsify-auth-container');
      if (container) {
        container.style.display = 'none';
      }
    }
  }

  // Đăng ký plugin
  if (!global.$docsify) {
    global.$docsify = {};
  }
  global.$docsify.plugins = (global.$docsify.plugins || []).concat(DocsifyAuthPlugin);

})(this);
