import { getUsers } from "./storage.js";

const btnLogin = document.getElementById('btn-login-submit');
const emailLog = document.getElementById('login-email');
const passLog = document.getElementById('login-password');
const notifyLog = document.getElementById('notify-login');
const users = getUsers();

btnLogin.addEventListener('click', (e)=>{
    e.preventDefault();

    const findUser = users.find(u => u.email === emailLog.value && u.password === passLog.value);
    if(!findUser){
        notifyLog.innerText = "Your account does not exist!";
        return;
    }
    localStorage.setItem('currentUser', JSON.stringify(findUser));
    notifyLog.innerText = "Log in successfully! Redirecting ...";
    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
})