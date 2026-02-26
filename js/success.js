let transInfo = document.getElementById('trans-info');
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const selectedPlan = JSON.parse(sessionStorage.getItem('selectedPlan'));

transInfo.innerHTML = `
    <p>Packet: <strong>${selectedPlan.name}</strong></p>
    <p>Price: <strong>${selectedPlan.price}</strong></p>
    <p>Expiry date: <strong>${currentUser.premiumPackets[currentUser.premiumPackets.length-1].premiumExpiry}</strong></p>
`