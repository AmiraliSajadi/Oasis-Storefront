$(document).ready(function () {

  $('#cartButton').click(function() {
      $('#cartSidebar').toggleClass('active');
    });

  $('#wishlistButton').click(function() {
    fetchWishlist();
    $('#wishlistSidebar').toggleClass('active');
  });

  // Close cart sidebar when clicking outside of it
  $(document).click(function(event) {
    var $target = $(event.target);
    if(!$target.closest('#cartSidebar').length && !$target.closest('#cartButton').length && $('#cartSidebar').hasClass('active')) {
      $('#cartSidebar').removeClass('active');
    }
  });

  // Close wishlist sidebar when clicking outside of it
  $(document).click(function(event) {
    var $target = $(event.target);
    if(!$target.closest('#wishlistSidebar').length && !$target.closest('#wishlistButton').length && $('#wishlistSidebar').hasClass('active')) {
      $('#wishlistSidebar').removeClass('active');
    }
  });
  
  
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
  
  $('.add-to-wishlist').click(function(event) {
    event.preventDefault();
    const productId = $(this).data('productId');
    addToWishlist(productId);
    
    fetchWishlist();
    // $('#wishlistSidebar').toggleClass('active');
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

  function fetchWishlist() {
    $.ajax({
        url: '/get_wishlist_items',
        type: 'GET',
        success: function(response) {
            // Clear the existing wishlist items
            $('#wishlistItems').empty();
            
            // Iterate over the wishlist items and append them to the UI
            response.forEach(function(item) {
                $('#wishlistItems').append(`<li><a href="/product_details/${item.id}">${item.name} - ${item.price}</a></li>`);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching wishlist items:', error);
        }
    });
  }

  fetchWishlist();

});