// =============================
// HÀM TIỆN ÍCH
// =============================

// Lấy danh sách users
function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "{}");
}

// Lưu users
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// Đánh dấu đã đăng nhập
function setLogin(username) {
    localStorage.setItem("currentUser", username);
}

// Lấy user đang đăng nhập
function getLogin() {
    return localStorage.getItem("currentUser");
}

// Đăng xuất
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}



// =============================
// LOGIN
// =============================
const loginForm = document.getElementById("login-form");

if (loginForm) {
    const loginMsg = document.getElementById("login-msg");
    const usernameInput = document.getElementById("login-username");
    const passwordInput = document.getElementById("login-password");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        const users = getUsers();

        if (users[username] && users[username].password === password) {

            setLogin(username);

            loginMsg.innerText = "Đăng nhập thành công!";
            loginMsg.style.color = "#00ff87";

            setTimeout(() => (window.location.href = "index.html"), 800);

        } else {
            loginMsg.innerText = "Sai tài khoản hoặc mật khẩu!";
            loginMsg.style.color = "red";
        }
    });
}



// =============================
// REGISTER
// =============================
const registerForm = document.getElementById("register-form");

if (registerForm) {
    const regMsg = document.getElementById("reg-msg");
    const regUser = document.getElementById("reg-username");
    const regPass = document.getElementById("reg-password");
    const regPass2 = document.getElementById("reg-password2");

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let username = regUser.value.trim();
        let password = regPass.value.trim();
        let password2 = regPass2.value.trim();

        if (!username || !password || !password2) {
            regMsg.innerText = "Vui lòng nhập đầy đủ thông tin!";
            regMsg.style.color = "red";
            return;
        }

        if (password !== password2) {
            regMsg.innerText = "Mật khẩu nhập lại không khớp!";
            regMsg.style.color = "red";
            return;
        }

        let users = getUsers();

        // Nếu username đã tồn tại
        if (users[username]) {
            regMsg.innerText = "Tên tài khoản đã tồn tại!";
            regMsg.style.color = "red";
            return;
        }

        // Thêm user mới
        users[username] = {
            username: username,
            password: password
        };

        saveUsers(users);

        regMsg.innerText = "Đăng ký thành công!";
        regMsg.style.color = "#00ff87";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 800);
    });
}



// =============================
// KIỂM TRA ĐĂNG NHẬP CHO TRANG BÊN TRONG
// =============================
const PROTECTED_PAGES = ["index.html", "cart.html", "profile.html"];

let currentPage = location.pathname.split("/").pop();

if (PROTECTED_PAGES.includes(currentPage)) {

    let user = getLogin();

    if (!user) {
        window.location.href = "login.html";
    }
}



// =============================
// NÚT ĐĂNG XUẤT
// =============================
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}
