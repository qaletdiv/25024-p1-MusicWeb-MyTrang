import { getUsers, saveUsers } from "./storage.js";

const users = getUsers();

const username = document.getElementById('reg-username');
const email = document.getElementById('reg-email');
const pass = document.getElementById('reg-password');
const confirmPass = document.getElementById('reg-confirm-password');
const notify = document.getElementById('notify');
const btnSubmit = document.getElementById('btn-reg-submit');

btnSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const valUsername = username.value.trim();
    const valEmail = email.value.trim();
    const valPass = pass.value.trim();
    const valConfirm = confirmPass.value.trim();
    if (!valUsername || !valEmail || !valPass || !valConfirm) {
        notify.style.color = "red";
        notify.innerText = "Please fill in all fields!";
        return; 
    }
    const findEmail = users.find(u => u.email == valEmail);
    if (findEmail) {
        notify.style.color = "red";
        notify.innerText = "Email already exists!";
        return;
    } 
    else {
        if (valPass !== valConfirm) {
            notify.style.color = "red";
            notify.innerText = "Passwords do not match!";
            return;
        }
        const newUser = {
            id: Date.now(),
            username: valUsername,
            email: valEmail,
            password: valPass, 
            role: 'user',
        }
        users.push(newUser);
        saveUsers(users);
        notify.style.color = "green";
        notify.innerText = "Register successfully! Redirecting ...";
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    }
});