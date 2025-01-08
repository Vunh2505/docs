function validatePassword(inputPassword, encryptedPassword) {
    const inputPasswordHash = sha256(inputPassword);
    return inputPasswordHash === encryptedPassword;
}

function injectStyle() {
    const styleEl = document.createElement("style");
    styleEl.textContent = `
    #auth-dialog {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 250px;
        width: 400px;
        border: 1px solid #eee;
        margin: 0 auto;
        margin-top: 20px;
      }
      #auth-dialog input {
        margin: 10px 0;
        padding: 10px;
        font-size: 16px;
      }
      #auth-dialog button {
        padding: 10px 20px;
        font-size: 16px;
      }
      #auth-dialog .error-message {
        color: red;
        margin-top: 10px;
        display: none;
      }
    `;
    document.head.appendChild(styleEl);
}

function injectAuthDialog() {
    const auth = window.$docsify.auth;
    const labels = auth.labels || {
        title: "Please enter the password to access this document:",
        placeholder: "Password",
        submit: "Submit",
        error: "Incorrect password, access denied."
    };

    const divEl = document.createElement("div");
    divEl.id = "auth-dialog";
    divEl.style.display = "none";
    divEl.innerHTML = `
        <span style="font-size:22px;font-weight:bold;">${labels.title}</span>
        <input type="password" id="auth-pwd" placeholder="${labels.placeholder}">
        <button id="auth-submit">${labels.submit}</button>
        <p id="error-message" class="error-message">${labels.error}</p>
    `;
    document.body.appendChild(divEl);

    document.getElementById("auth-submit").addEventListener("click", () => {
        const pwd = document.getElementById("auth-pwd").value;
        if (validatePassword(pwd, auth.password)) {
            sessionStorage.setItem("authenticated", "true");
            setAuthDialog(false);
        } else {
            document.getElementById("error-message").style.display = "block";
        }
    });
}

function setAuthDialog(isShow) {
    const dialog = document.getElementById("auth-dialog");
    if (isShow) {
        dialog.style.display = "flex";
        document.querySelector("main").style.display = "none";
        document.querySelector("nav").style.display = "none";
    } else {
        dialog.style.display = "none";
        document.querySelector("main").style.display = "block";
        document.querySelector("nav").style.display = "block";
    }
}

// Register plugin with Docsify
window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat((hook) => {
    hook.init(() => {
        injectStyle();
        injectAuthDialog();
    });

    hook.beforeEach((content) => {
        const auth = window.$docsify.auth;
        const currentPath = location.hash.split("?")[0].split("#")[1] || "/";
        const needAuth = auth.paths.some((path) => new RegExp(path).test(currentPath));

        if (auth.enable && needAuth && !sessionStorage.getItem("authenticated")) {
            setAuthDialog(true);
            return '<div style="color:red;">Please refresh the page after successful authentication to view the content.</div>';
        }

        setAuthDialog(false);
        return content;
    });
});
