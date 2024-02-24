document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll("section");
    let currentSectionIndex = 0;
    let isThrottled = false;

    document.addEventListener("wheel", function(e) {
        if (isThrottled) return;
        isThrottled = true;
        setTimeout(() => isThrottled = false, 1000);

        const direction = e.deltaY > 0 ? 1 : -1;
        scroll(direction);
    });

    function scroll(direction) {
        if (direction === 1) {
            if (currentSectionIndex < sections.length - 1) {
                currentSectionIndex++;
                moveToCurrentSection();
            }
        } else {
            if (currentSectionIndex > 0) {
                currentSectionIndex--;
                moveToCurrentSection();
            }
        }
    }

    function moveToCurrentSection() {
        sections.forEach((section, index) => {
            section.style.transform = `translateY(-${currentSectionIndex * 100}%)`;
            section.style.transition = 'transform 0.8s ease-in-out';
            section.style.opacity = index === currentSectionIndex ? '1' : '0';
            section.style.transitionDelay = index === currentSectionIndex ? '0.4s' : '0s';
        });
    }
});
