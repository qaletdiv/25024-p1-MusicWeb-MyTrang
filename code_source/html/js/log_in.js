const signupbtn = document.querySelector(".submit");
const mess = document.querySelector(".mess");
signupbtn.onclick = () =>{
    const email = document.querySelector(".user-email").value.trim();
    const mk = document.querySelector(".user-pass").value.trim();
    if(!email || !mk){
        mess.innerHTML = "Do not leave blanks";
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        mess.innerHTML = "Invalid email format!";
        return;
    }
    else if(mk.length < 6){
        mess.innerHTML = "Password must have 6 characters!";
        return;
    }
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if(users){
        for (const element of users) {
            if(element.email === email){
                if(element.mk == mk){
                    alert("Sign up successfully!");
                    return;
                }
            }
        }
    }
    mess.innerHTML = "No account existed!";
    
    return;
};
