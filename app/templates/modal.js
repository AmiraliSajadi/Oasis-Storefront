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

  $('#cartButton').click(function() {
    $('#cartSidebar').toggleClass('active');
  });

  // Close cart sidebar when clicking outside of it
  $(document).click(function(event) {
    var $target = $(event.target);
    if(!$target.closest('#cartSidebar').length && !$target.closest('#cartButton').length && $('#cartSidebar').hasClass('active')) {
      $('#cartSidebar').removeClass('active');
    }
  });

  $('#wishlistButton').click(function() {
    $('#wishlistSidebar').toggleClass('active');
  });

  // Close wishlist sidebar when clicking outside of it
  $(document).click(function(event) {
    var $target = $(event.target);
    if(!$target.closest('#wishlistSidebar').length && !$target.closest('#wishlistButton').length && $('#wishlistSidebar').hasClass('active')) {
      $('#wishlistSidebar').removeClass('active');
    }
  });

  // Function to add product to cart
  $('.add-to-cart-btn').click(function() {
    var productId = $(this).data('product-id');
    addToCart(productId);
  });

  function addToCart(productId) {
    $.ajax({
      url: '/add_to_cart',
      type: 'POST',
      data: JSON.stringify({ productId: productId }),
      contentType: 'application/json',
      success: function(response) {
        console.log('Product added to cart');
      },
      error: function(xhr, status, error) {
        if (xhr.status === 401) {
          alert('Please log in first.');
        } else {
          console.error('Error adding product to cart:', error);
        }
      }
    });
  }

  // Function to add product to wishlist
  $('.add-to-wishlist').click(function(event) {
    event.preventDefault();
    const productId = $(this).data('productId');
    addToWishlist(productId);
  });

  function addToWishlist(productId) {
    $.ajax({
        url: '/add_to_wishlist',
        type: 'POST',
        data: JSON.stringify({ product_id: productId }),
        contentType: 'application/json',
        success: function(response) {
            console.log('Product added to wishlist');
        },
        error: function(xhr, status, error) {
            if (xhr.status === 401) {
                alert('Please log in first.');
            } else {
                console.error('Error adding product to wishlist:', error);
            }
        }
    });
  }

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

  // Show Cart Modal
  $('#cartButton').click(function() {
    $('#cartModal').modal('show');
  });

  // Show Wishlist Modal
  $('#wishlistButton').click(function() {
    $('#wishlistModal').modal('show');
  });

});
