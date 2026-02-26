import { getUsers, saveUsers } from "./storage.js";


const users = getUsers();

const username = document.getElementById('reg-username');
const email = document.getElementById('reg-email');
const pass = document.getElementById('reg-password');
const confirmPass = document.getElementById('reg-confirm-password');
const notify = document.getElementById('notify');
const btnSubmit = document.getElementById('btn-reg-submit');

btnSubmit.addEventListener('click',(e) =>{
    e.preventDefault();
    const findEmail = users.find(u => u.email == email.value);
    if(findEmail){
        notify.innerText = "Email already exist!";
        return;
    }
    else{
        if(pass.value !== confirmPass.value){
            notify.innerText= "Passwords do not match!";
            return;
        }
        
        const newUser = {
            id: Date.now(),
            username: username.value,
            email: email.value,
            password: pass.value,
            role: 'user',
        }

        users.push(newUser);
        saveUsers(users);

        notify.innerText = "Register successfully! Redirecting ...";

        setTimeout(() =>{
            window.location.href = "login.html";
        }, 2000);
    }
});

