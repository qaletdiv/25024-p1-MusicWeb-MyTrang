document.querySelectorAll('.select-plan-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const planData = {
            name: e.target.dataset.plan,
            price: e.target.dataset.price
        };
        sessionStorage.setItem('selectedPlan', JSON.stringify(planData));
        window.location.href = 'checkout.html';
    })
})