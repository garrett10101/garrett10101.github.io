var slideIndex = 1;
initDots();
showSlides(slideIndex);

// Dynamically create dot elements based on the number of slides
function initDots() {
  var slides = document.getElementsByClassName("mySlides");
  var dotsContainer = document.getElementById("dots-container");
  if (!dotsContainer) return;

  dotsContainer.innerHTML = "";
  for (let i = 0; i < slides.length; i++) {
    var dot = document.createElement("span");
    dot.className = "dot";
    dot.addEventListener("click", function() { currentSlide(i + 1); });
    dotsContainer.appendChild(dot);
  }
}

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.opacity = "0";  
  }
  setTimeout(function() {
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slides[slideIndex-1].style.display = "block";
    slides[slideIndex-1].style.opacity = "1";  
  }, 500); // Duration of fade effect in milliseconds
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  if (dots.length >= slideIndex) {
      dots[slideIndex-1].className += " active";
  }
}
