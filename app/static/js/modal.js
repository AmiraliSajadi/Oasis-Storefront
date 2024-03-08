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


  window.deleteWishlistItem = function(itemId) {
    $.ajax({
      url: '/delete_wishlist_item', // The URL to the server endpoint
      type: 'POST',
      data: JSON.stringify({ itemId: itemId }), // Send the itemId as JSON
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response) {
        if(response.success) {
          // If the server responds successfully, remove the item from the DOM
          $(`#wishlistItem-${itemId}`).remove();
          // Alternatively, you could refresh the page or update the view in another way
        } else {
          // Handle failure (e.g., item not found or not deleted)
          alert("An error occurred while trying to delete the wishlist item.");
        }
      },
      error: function(xhr, status, error) {
        // Handle general AJAX errors (e.g., network issues, server errors)
        console.error("AJAX error: Status =", status, "Error =", error);
      }
    });
  };

  window.viewItemDetails = function(itemId) {
    // Placeholder function to view item details
    // In a real application, you might navigate to the item's detail page or open a modal with the item's information
    console.log("View details for item with ID:", itemId);
  };

  window.deleteSellingItem = function(itemId) {
    // Similar AJAX call to delete the selling item
    console.log("Delete selling item with ID:", itemId);
    // Implement the AJAX call similarly to the wishlist item deletion
  };


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


let cart = []; // Initialize an empty cart

// Function to add product to cart
function addToCart(productId) {
  // Assuming product details are fetched or already available
  const product = { id: productId, name: "Product Name", price: 100 }; // Example product
  cart.push(product);
  updateCartModal();
}

// Function to remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(product => product.id !== productId);
  updateCartModal();
}

// Function to update cart modal view
function updateCartModal() {
  let cartItemsContainer = document.getElementById('cartItemsContainer');
  cartItemsContainer.innerHTML = ''; // Clear current cart items
  
  cart.forEach(product => {
    let itemElement = document.createElement('div');
    itemElement.innerHTML = `
      <p>${product.name} - $${product.price} <button onclick="removeFromCart(${product.id})">Remove</button></p>
    `;
    cartItemsContainer.appendChild(itemElement);
  });

  // Update total
  let total = cart.reduce((sum, product) => sum + product.price, 0);
  document.getElementById('cartTotal').innerText = `Total: $${total}`;
}

// Event listener for cart modal open
document.getElementById('cartButton').addEventListener('click', updateCartModal);



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
