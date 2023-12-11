let scrollAmount = 0;

document.getElementById('scrollRight').addEventListener('click', () => {
    const gallery = document.querySelector('.scrollable-gallery');
    if (scrollAmount < gallery.scrollWidth - gallery.clientWidth) {
        scrollAmount += 200; // Width of the image
    }
    gallery.style.transform = `translateX(-${scrollAmount}px)`;
});

document.getElementById('scrollLeft').addEventListener('click', () => {
    if (scrollAmount > 0) {
        scrollAmount -= 200;
    }
    document.querySelector('.scrollable-gallery').style.transform = `translateX(-${scrollAmount}px)`;
});
