import { saveUserStatus, checkLoginStatus } from "./components/core.js";
checkLoginStatus();

let orderSummary = document.getElementById('order-summary');
const planData = JSON.parse(sessionStorage.getItem('selectedPlan'));
if (planData && orderSummary) {
    orderSummary.innerHTML = `
        <p>Packet: <strong>${planData.name}</strong></p>
        <p>Price: <strong>${planData.price}</strong></p>
    `;
}

const form = document.getElementById('payment-form');
const errorMsg = document.getElementById('checkout-error');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorMsg.innerText = "";
    const cardNumber = document.getElementById('card-number').value.trim();
    const expDate = document.getElementById('exp-date').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const cardNumberRegex = /^\d{16}$/;
    if (!cardNumberRegex.test(cardNumber)) {
        errorMsg.innerText = "Invalid card number! Must be exactly 16 digits.";
        return;
    }
    const expDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expDateRegex.test(expDate)) {
        errorMsg.innerText = "Invalid expiration date! Must be in MM/YY format.";
        return;
    }
    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(cvv)) {
        errorMsg.innerText = "Invalid CVV! Must be exactly 3 digits.";
        return;
    }
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert("You have to sign in to continue!");
        window.location.href = 'login.html';
        return;
    }

    currentUser.role = 'premium';
    const premiumPackets = currentUser.premiumPackets || [];
    const newPacket = {
        premiumBegin: new Date().toLocaleString(),
        premiumExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        premiumName: planData ? planData.name : 'Premium Standard',
        premiumPrice: planData ? planData.price : '$9.99',
        isUsing: true,
    }
    premiumPackets.push(newPacket);
    currentUser.premiumPackets = premiumPackets;
    saveUserStatus(currentUser);

    const transId = "MusicPlayer_" + Math.floor(Math.random() * 100000);
    sessionStorage.setItem('lastTransaction', transId);
    
    alert("Your payment has been successfully processed!");
    window.location.href = 'index.html';
});