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
                // Create a list item with the product details and a delete button
                var listItem = $('<li>').append(
                    $('<div>').addClass('wishlist-item').append(
                        $('<a>').attr('href', '/product_details/' + item.id).text(item.name + ' - ' + item.price),
                        $('<button>').addClass('delete-btn').text('Delete').click(function() {
                            deleteWishlistItem(item.id);
                        })
                    )
                );
                $('#wishlistItems').append(listItem);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching wishlist items:', error);
        }
    });
  }

function deleteWishlistItem(itemId) {
    $.ajax({
        url: '/remove_wishlist_item/' + itemId,
        type: 'DELETE',
        success: function(response) {
            fetchWishlist(); // Refresh the wishlist after deletion
        },
        error: function(xhr, status, error) {
            console.error('Error deleting wishlist item:', error);
        }
    });
  }

fetchWishlist();


});