document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add hover effect for feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-5px)';
    });
    card.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
    });
});