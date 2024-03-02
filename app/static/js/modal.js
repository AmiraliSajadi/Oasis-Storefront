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