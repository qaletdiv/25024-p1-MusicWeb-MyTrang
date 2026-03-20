import { getUsers } from "./storage.js";

const btnLogin = document.getElementById('btn-login-submit');
const emailLog = document.getElementById('login-email');
const passLog = document.getElementById('login-password');
const notifyLog = document.getElementById('notify-login');

btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    const users = getUsers() || []; 
    const findUser = users.find(u => u.email === emailLog.value && u.password === passLog.value);
    if(!findUser){
        notifyLog.style.color = "red";
        notifyLog.innerText = "Your account does not exist or wrong password!";
        return;
    }
    localStorage.setItem('currentUser', JSON.stringify(findUser));
    notifyLog.style.color = "green";
    notifyLog.innerText = "Log in successfully! Redirecting ...";
    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
});