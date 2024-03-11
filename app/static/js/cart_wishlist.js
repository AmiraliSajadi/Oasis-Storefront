$(document).ready(function () {

  $('#cartButton').click(function() {
      $('#cartSidebar').toggleClass('active');
      fetchCart();
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

// Function to fetch cart items
function fetchCart() {
  $.ajax({
      url: '/get_cart_items',
      type: 'GET',
      success: function(response) {
          // Clear the existing cart items
          $('#cartItems').empty();
          
          // Iterate over the cart items and append them to the UI
          response.forEach(function(item) {
              $('#cartItems').append(`<li>${item.name} - $${item.price} - Quantity: ${item.quantity} <button class="increaseBtn" data-productid="${item.id}">+</button> <button class="decreaseBtn" data-productid="${item.id}">-</button> <button class="deleteBtn" data-productid="${item.id}">Delete</button></li>`);
          });
          
          // Calculate and update the total
          let total = response.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
          $('#cartTotal').text(total.toFixed(2));
      },
      error: function(xhr, status, error) {
          console.error('Error fetching cart items:', error);
      }
  });
}

// Function to handle removing an item from the cart
function removeFromCart(productId) {
  $.ajax({
      url: `/remove_cart_item/${productId}`,
      type: 'DELETE',
      success: function(response) {
          // Refresh the cart items after removing
          fetchCart();
      },
      error: function(xhr, status, error) {
          console.error('Error removing item from cart:', error);
      }
  });
}

$('#cartItems').on('click', '.increaseBtn', function() {
  let productId = $(this).data('productid');
  addToCart(productId);
  fetchCart();
});

// Event listener for decrease button
$('#cartItems').on('click', '.decreaseBtn', function() {
  let productId = $(this).data('productid');
  updateQuantity(productId, -1); // Decrease the quantity by 1
});

// Event listener for delete button
$('#cartItems').on('click', '.deleteBtn', function() {
  let productId = $(this).data('productid');
  removeFromCart(productId);
});

// Function to update quantity
function updateQuantity(productId, change) {
  $.ajax({
      url: '/update_cart_quantity',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ productId: productId, change: change }), // Pass the product ID and the change in quantity
      success: function(response) {
          fetchCart(); // Fetch updated cart items
      },
      error: function(xhr, status, error) {
          console.error('Error updating quantity:', error);
      }
  });
}

// Event listener for finalize transaction button
$('#finalizeTransactionBtn').on('click', function() {
  alert("Transaction Done");
  updateProductQuantities();
  fetchCart();
});

// Function to update product quantities
function updateProductQuantities() {
  $.ajax({
      url: '/update_product_quantities',
      type: 'POST',
      contentType: 'application/json',
      success: function(response) {
          // Clear the cart after successful transaction
          clearCart();
      },
      error: function(xhr, status, error) {
          console.error('Error updating product quantities:', error);
      }
  });
}

// Function to clear the cart
function clearCart() {
  $.ajax({
      url: '/clear_cart',
      type: 'DELETE',
      success: function(response) {
          fetchCart(); // Refresh the cart after clearing
      },
      error: function(xhr, status, error) {
          console.error('Error clearing cart:', error);
      }
  });
}


fetchWishlist();
fetchCart();

});


document.getElementById('add-to-wishlist-btn').addEventListener('click', function() {
    var productId = this.getAttribute('data-product-id');
    fetch('/add_to_wishlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRFToken': '{{ csrf_token() }}' // Ensure you have CSRF protection
        },
        body: JSON.stringify({product_id: productId})
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        // You can add code here to change the button state or update the UI
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
