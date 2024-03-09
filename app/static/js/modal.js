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
        console.error('Error adding product to cart:', error);
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
    fetch('/add_to_wishlist', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        console.log('Product added to wishlist');
      } else {
        console.error('Error adding product to wishlist');
      }
    })
    .catch(error => {
      console.error('Error:', error);
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

});
