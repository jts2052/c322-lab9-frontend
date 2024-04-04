const mode = 1;

const host_local = 'http://localhost:8080';
const host_remote = 'https://ducks-service-lab9.onrender.com';

function getHost() {
  return mode === 0 ? host_local : host_remote;
}

function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

function getToken() {
    return localStorage.getItem('token');
}

function saveToken(token) {
    localStorage.setItem('token', token);
    updateNavBar();
}

function deleteToken() {
    localStorage.removeItem('token');
    updateNavBar();
}

let config = {
    isLoggedIn: () => isLoggedIn(),
    host: () => getHost(),
    token: () => getToken()
};

updateNavBar();

async function updateNavBar() {
    const navigation = document.getElementById('topnav')[0];
    let loginTag = navigation.children[navigation.children.length - 1];
    if (config.isLoggedIn()) {
        loginTag.innerHtml =
        `<li class="right><a href="#" onclick="logout()">Logout</a></li>`;
    } else {
        loginTag.innerHtml =
        `<li class="right><a href="login.html">Login</a></li>`;
    }
}

async function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let customer = {username: username, password: password};
    let request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
    };
    try {
        let response = await fetch(getHost() + "/signin", request);
        if (response.status == 200) {
            alert('Login successful');
            const token = await response.text();
            saveToken(token);
            location.href = 'index.html';
        } else {
            console.log(`response status: ${response.status}`);
            deleteToken();
            alert('Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        deleteToken();
        alert('Login failed');
    }
}

async function logout() {
    deleteToken();
}