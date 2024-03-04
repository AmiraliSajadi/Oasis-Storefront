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