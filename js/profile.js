document.getElementById('btn-logout')?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html'; 
});

const currentUser = JSON.parse(localStorage.getItem('currentUser'));

const profileUserName = document.getElementById('profile-user-name');
const profileUserEmail = document.getElementById('profile-user-email');
const profilePaymentName = document.getElementById('packet-name');
const profilePaymentPrice = document.getElementById('packet-price');
const profilePaymentExpiry = document.getElementById('packet-expiry');
const profilePaymentBegin = document.getElementById('packet-begin');
const personalPayment = document.getElementById('personal-payment');
const historyPackets = document.getElementById('history-packets');

if(!currentUser){
    alert("You have to log in first!");
    window.location.href = 'login.html';
}
else{
    if (profileUserName) profileUserName.innerText = currentUser.username;
    if (profileUserEmail) profileUserEmail.innerText = currentUser.email || "";

    if(currentUser.role === 'premium' && currentUser.premiumPackets){
        const last = currentUser.premiumPackets[currentUser.premiumPackets.length - 1];
        
        if(profilePaymentName) profilePaymentName.innerText = last.premiumName;
        if(profilePaymentPrice) profilePaymentPrice.innerText = last.premiumPrice;
        if(profilePaymentBegin) profilePaymentBegin.innerText = new Date(last.premiumBegin).toLocaleDateString();
        if(profilePaymentExpiry) profilePaymentExpiry.innerText = last.premiumExpiry;
        let tagHTML = '';
        currentUser.premiumPackets.forEach(packet => {
            tagHTML += `
                <div class="packet-card-item"> <span class="packet-name"><strong>${packet.premiumName}</strong></span>
                    <span class="packet-begin">- from ${new Date(packet.premiumBegin).toLocaleDateString()}</span>
                    <span class="packet-expiry"> to ${packet.premiumExpiry}</span>
                </div>
            `;
        });
        if(historyPackets) historyPackets.innerHTML = tagHTML;
    }
    else{
        personalPayment.innerHTML = `<a href="premium.html" class="premium-btn">Upgrade to Premium!</a>`;
    }
}