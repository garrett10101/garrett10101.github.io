const gallery = document.querySelector('.scrollable-gallery');
const images = gallery.querySelectorAll('img');
const navigation = document.querySelector('.gallery-navigation');
let currentIndex = 0;

// Create navigation circles
images.forEach((img, index) => {
    const circle = document.createElement('span');
    circle.addEventListener('click', () => moveToIndex(index));
    navigation.appendChild(circle);
});

function updateNavigation() {
    navigation.querySelectorAll('span').forEach((circle, index) => {
        circle.style.backgroundColor = index === currentIndex ? '#000' : '#bbb';
    });
}

function moveToIndex(index) {
    currentIndex = index;
    const position = -200 * index; // 200 is the width of the image
    gallery.style.transform = `translateX(${position}px)`;
    updateNavigation();
}

document.getElementById('scrollRight').addEventListener('click', () => {
    if (currentIndex < images.length - 1) {
        moveToIndex(currentIndex + 1);
    }
});

document.getElementById('scrollLeft').addEventListener('click', () => {
    if (currentIndex > 0) {
        moveToIndex(currentIndex - 1);
    }
});

updateNavigation(); // Initial update for navigation circles
