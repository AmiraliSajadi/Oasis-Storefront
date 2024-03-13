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

// Handle sign in form submission
$('#signInForm').submit(function(e) {
  e.preventDefault();
  var formData = $(this).serialize();
  console.log(formData)
  $.ajax({
    url: '/login',
    method: 'POST',
    data: formData,
    success: function(response) {
      window.location.href = "/";
    },
    error: function(xhr, status, error) {
      $('#signInError').text('Username or password is incorrect.');
    }
  });
});

  // Handle sign up form submission
  $('#signUpForm').submit(function(e) {
    e.preventDefault();
    var formData = $(this).serialize();
    $.ajax({
      url: '/register',
      method: 'POST',
      data: formData,
      success: function(response) {
        $('#signUpModal').modal('hide');
        $('#signInModal').modal('show');
        alert('Your account was created. Please sing in.');
      },
      error: function(xhr, status, error) {
        $('#signUpErrorMessage').text('Sign up failed, please try again later').show();
        // Handle error response, e.g., show an error message
      }
    });
  });

  // Play videos on hover
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

  document.getElementById('sellItemForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var productName = document.getElementById('productName').value;
    var shortDescription = document.getElementById('shortDescription').value;
    var fullDescription = document.getElementById('fullDescription').value;
    var productCategory = document.getElementById('productCategory').value;
    console.log(productCategory)
    var productPrice = document.getElementById('productPrice').value;
    var productQuantity = document.getElementById('productQuantity').value;
    
    if (!productName || !shortDescription || !fullDescription || !productCategory || !productPrice || !productQuantity) {
        alert('Please fill in all fields.');
        return;
    }
    
    // Additional validation logic (e.g., check image count, price format) can be added here
    // Add image validation here
    
    var formData = new FormData(this);
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                alert('Item uploaded successfully!');
            } else {
                alert('Error uploading item.');
            }
        }
    };
    xhr.send(formData);
});


});


// AddtoCart and AddtoWishlist functions for item-card.html

document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('.heart-button').forEach(button => {
    button.addEventListener('click', function() {
      let itemCard = this.closest('.item-card');
      let productId = itemCard.getAttribute('data-product-id');
      let userId = itemCard.getAttribute('data-user-id');

      // Toggle heart symbol
      if (this.textContent === '❤') {
        this.textContent = '🤍'; // Change to empty heart
        removeFromWishlist(productId, userId);
      } else {
        this.textContent = '❤'; // Change to filled heart
        addToWishlist(productId, userId);
        alert("message", "Item added to your wishlist.")
      }
    });
  });

  function addToWishlist(productId, userId) {
    fetch('/add_to_wishlist', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, user_id: userId }),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  }

  function removeFromWishlist(productId, userId) {
    fetch('/remove_from_wishlist', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, user_id: userId }),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  }
});



// Add to cart and Add to wishlist functions for product.html

// Image slider js

var slideIndex = 0;
showSlides();

function plusSlides(n) {
  slideIndex += n;
  if (slideIndex >= slides.length) {
    slideIndex = 0;
  } else if (slideIndex < 0) {
    slideIndex = slides.length - 1;
  }
  showSlides(true);
}

function currentSlide(n) {
  slideIndex = n - 1;
  showSlides(true);
}

function showSlides(manual = false) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";

  if (manual && window.slideTimeout) {
    clearTimeout(window.slideTimeout);
  }

  window.slideTimeout = setTimeout(showSlides, 3000);
}

document.addEventListener("DOMContentLoaded", showSlides);



let currentSlideIndex = 0;

function plusSlides(n) {
  // Determine the new index
  let newSlideIndex = currentSlideIndex + n;

  // Wrap around if index is out of bounds
  if (newSlideIndex >= slides.length) {
    newSlideIndex = 0;
  } else if (newSlideIndex < 0) {
    newSlideIndex = slides.length - 1;
  }

  // Apply the slideOut class to the current slide
  slides[currentSlideIndex].classList.add('slideOut');
  slides[currentSlideIndex].classList.remove('slideIn');

  // After the animation completes, hide the current slide and show the new one
  setTimeout(() => {
    slides[currentSlideIndex].classList.remove('slideOut');
    slides[currentSlideIndex].style.display = 'none';

    // Apply the slideIn class to the new slide
    slides[newSlideIndex].classList.add('slideIn');
    slides[newSlideIndex].style.display = 'block';

    // Update the current slide index
    currentSlideIndex = newSlideIndex;
  }, 3000); // The timeout should match the animation-duration

  // Update dots or other indicators if necessary
}

// Initial setup
let slides = document.getElementsByClassName("mySlides");
if (slides.length > 0) {
  slides[0].style.display = 'block';
  slides[0].classList.add('slideIn');
}
