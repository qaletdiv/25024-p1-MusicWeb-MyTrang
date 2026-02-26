import { saveUserStatus, checkLoginStatus } from "./components/core.js";

const form = document.getElementById('payment-form');
form.addEventListener('submit', (e) =>{
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const selectedPlan = JSON.parse(sessionStorage.getItem('selectedPlan'));
    if(!currentUser){
        alert("You have to sign in to continue!");
        window.location.href = 'login.html';
        return;
    }

    currentUser.role = 'premium';
    const premiumPackets = currentUser.premiumPackets || [];
    const newPacket = {
        premiumBegin: new Date().toLocaleString(),
        premiumExpiry: new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString(),
        premiumName: selectedPlan.name,
        premiumPrice: selectedPlan.price,
        isUsing: true,
    }
    premiumPackets.push(newPacket);
    currentUser.premiumPackets = premiumPackets;
    saveUserStatus(currentUser);

    const transId = "MusicPlayer_" + Math.floor(Math.random() * 100000);
    sessionStorage.setItem('lastTransaction', transId);
    alert("Your payment has been successfully processed");
    window.location.href = 'success.html';
})

let orderSummary = document.getElementById('order-summary');
const planData = JSON.parse(sessionStorage.getItem('selectedPlan'));
orderSummary.innerHTML = `
    <p>Packet: <strong>${planData.name}</strong></p>
    <p>Price: <strong>${planData.price}</strong></p>
`;