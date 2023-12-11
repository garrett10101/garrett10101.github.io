document.getElementById('scrollRight').addEventListener('click', () => {
    document.querySelector('.scrollable-gallery').scrollBy({ left: 200, behavior: 'smooth' });
});

document.getElementById('scrollLeft').addEventListener('click', () => {
    document.querySelector('.scrollable-gallery').scrollBy({ left: -200, behavior: 'smooth' });
});
