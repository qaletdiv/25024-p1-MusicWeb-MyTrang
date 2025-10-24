//Logo click()
const logoImage = document.querySelector(".logo");
logoImage.addEventListener('click',function(){
    window.location.href = "home_page.html";
    console.log("Homepage-logo");
});
//Burger click()
const navBar = document.querySelector(".nav-bar");
const burger = document.querySelector(".burger");
burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navBar.classList.toggle('active');
    console.log("burger click");
});

//Account 
let isLogIn = false;


