const signupbtn = document.querySelector(".submit");
const mess = document.querySelector(".mess");
signupbtn.onclick = () =>{
    const email = document.querySelector(".user-email").value.trim();
    const mk = document.querySelector(".user-pass").value.trim();
    if(!email || !mk){
        mess.innerHTML = "Do not leave blanks";
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if(users){
        if(users.find(element => element.email === email)){
            if(users.find(element => element.mk === mk)){
                window.location.replace("home_page.html");
                alert("Log in successfully!");
                return;
            }
            else{
                mess.innerHTML = "Invalid log in!";
            }
        }
        else{
            mess.innerHTML = "Invalid log in!";
        }
    }
    return;
};
