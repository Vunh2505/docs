(function (global) {
    // ===============================
    //    HÀM BĂM MẬT KHẨU BẰNG js-sha256
    // ===============================
    function hashPassword(message, algorithm) {
      if (!window.sha256) {
        throw new Error('js-sha256 library not loaded. Hãy import https://cdn.jsdelivr.net/npm/js-sha256 trước plugin này.');
      }
      switch (algorithm) {
        case 'sha256':
        default:
          return window.sha256(message); // Chuỗi hex 64 ký tự
      }
    }
  
    // ===============================
    //    PLUGIN CHÍNH
    // ===============================
    function DocsifyAuthPlugin(hook, vm) {
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
            protectRoutes = [],
            title = 'Authentication Required',
            description = 'Please enter password to continue',
            placeholder = 'Password...',
            buttonText = 'Confirm',
            errorText = 'Incorrect password!',
            successText = 'Login success, loading docs...'
          } = config;
  
          // (1) Nếu không có hashedPassword => bỏ qua
          if (!hashedPassword) {
            return content;
          }
  
          // (2) Kiểm tra route
          const currentRoute = vm.route.path || '/';
          console.log('current route=', currentRoute);
          console.log('protect route=', protectRoutes);
          const needProtect = isProtectedRoute(currentRoute, protectRoutes);
          if (!needProtect) {
            return ensureString(content);
          }
  
          // (3) Tạo form auth nếu chưa có
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
  
          // (4) Chưa auth => chặn nội dung
          const isAuthed = window.localStorage.getItem('docsify-auth');
          if (isAuthed !== 'true') {
            return '';
          }
  
          // (5) Đã auth => ẩn form => cho hiển thị content
          hideAuthContainer();
          return ensureString(content);
  
        } catch (err) {
          console.error('DocsifyAuthPlugin error:', err);
          // Tránh Docsify crash => trả về chuỗi rỗng
          return '';
        }
      });
  
      // ===============================
      //    HÀM PHỤ & TẠO OVERLAY
      // ===============================
      function isProtectedRoute(route, protectList) {
        if (!Array.isArray(protectList) || protectList.length === 0) {
          return false;
        }
        return protectList.some(folder => route.startsWith(folder));
      }
  
      function ensureString(val) {
        return (typeof val === 'string') ? val : '';
      }
  
      /**
       * Tạo form auth, nhưng chỉ overlay khu vực .content
       */
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
        // Tìm element .content
        let contentEl = document.querySelector('.content');
        if (!contentEl) {
          // Nếu Docsify chưa render .content, fallback sang body
          contentEl = document.body;
        } else {
          // Đảm bảo .content có position khác "static"
          const currentPos = window.getComputedStyle(contentEl).position;
          if (currentPos === 'static') {
            contentEl.style.position = 'relative';
          }
        }
  
        // Tạo container overlay
        const container = document.createElement('div');
        container.className = 'docsify-auth-container';
        container.style.cssText = `
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 9999;
          background: rgba(255,255,255,0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
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
  
        // Sự kiện button
        btn.addEventListener('click', () => {
          const userInput = input.value.trim();
          if (!userInput) return;
  
          try {
            const hashedInput = hashPassword(userInput, hashingAlgorithm);
            if (hashedInput.toLowerCase() === hashedPassword.toLowerCase()) {
              // Đúng mật khẩu
              errorDiv.style.color = 'green';
              errorDiv.innerText = successText;
              window.localStorage.setItem('docsify-auth', 'true');
              setTimeout(() => {
                container.style.display = 'none';
              }, 500);
  
            } else {
              // Sai
              errorDiv.style.color = 'red';
              errorDiv.innerText = errorText;
            }
          } catch (err) {
            console.error('Băm mật khẩu lỗi:', err);
            errorDiv.style.color = 'red';
            errorDiv.innerText = 'Đã xảy ra lỗi, xem console để biết thêm.';
          }
        });
  
        // Gắn vào .content (hoặc body)
        contentEl.appendChild(container);
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
  