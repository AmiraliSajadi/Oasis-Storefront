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

