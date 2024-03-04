$(document).ready(function () {
  // Show Sign In Modal
  $('#signInLink').click(function () {
    $('#signInModal').modal('show');
  });

  // Show Sign Up Modal
  $('#showSignUp').click(function () {
    $('#signInModal').modal('hide');
    $('#signUpModal').modal('show');
  });
});


// Image slideshow
var slideIndex = 1;  // Initialize slideIndex to 1
showSlides(slideIndex);  // Call showSlides with slideIndex to show the first slide

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  slides[slideIndex - 1].style.display = "block";
}

// Auto Slide
function autoSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1 }
  slides[slideIndex - 1].style.display = "block";
  setTimeout(autoSlides, 3000); // Change image every 3 seconds
}

autoSlides(); // Start the automatic slideshow




// navbar toggle


const overlay = document.querySelector("[data-overlay]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");

const navElemArr = [overlay, navOpenBtn, navCloseBtn];

for (let i = 0; i < navElemArr.length; i++) {
  navElemArr[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
}


// Adds active class on header when scrolled 200px from top


const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  window.scrollY >= 200 ? header.classList.add("active")
    : header.classList.remove("active");
})


// Play videos on hover

document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('.product-video');

  videos.forEach(video => {
    video.addEventListener('mouseenter', () => {
      video.play();
    });
    video.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
});