const signupbtn = document.querySelector(".submit");
const mess = document.querySelector(".mess");

signupbtn.onclick = () =>{
    const name = document.querySelector(".user-name").value.trim();
    const email = document.querySelector(".user-email").value.trim();
    const mk = document.querySelector(".user-pass").value.trim();
    if(!name || !email || !mk){
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
                mess.innerHTML = "This email has already signed up!";
                return;
            }
        }
    }
    users.push({name, email, mk});
    localStorage.setItem("users", JSON.stringify(users));
    alert("Sign up successfully!");
    return;
};
