


let transInfoContainer = document.getElementById('trans-info');
const transId = sessionStorage.getItem('lastTransaction');

if (transId) {
    transInfoContainer.innerHTML = `
        <p>Transaction Code: <strong>${transId}</strong></p>
        <p>Status: <span style="color: #1db954; font-weight: bold;">Completed</span></p>
        <p>Date: <strong>${new Date().toLocaleDateString()}</strong></p>
        <p style="font-size: 0.8rem; margin-top: 15px; border-top: 1px solid #333; pt-10px">
            Thank you for being a part of our Premium community!
        </p>
    `;
    sessionStorage.removeItem('lastTransaction');
} else {
    transInfoContainer.innerHTML = "<p>No transaction found.</p>";
}