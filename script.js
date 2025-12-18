// 1. Scroll Animation Logic
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.animate-on-scroll');
    
    const checkScroll = () => {
        const triggerBottom = window.innerHeight * 0.9;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            
            if (sectionTop < triggerBottom) {
                section.classList.add('active');
            }
        });
    };

    // Initial check on load
    checkScroll();
    
    // Check on every scroll event
    window.addEventListener('scroll', checkScroll);
});