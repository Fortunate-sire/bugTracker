/* eslint-disable */
// jquery edithing User ajax
$(document).ready(function() {
      $('.edit-user').click(function() {
        var userId = $(this).data('user-id');
        $("form[name='editUserForm']").attr('action', '/edith/' + userId);
        
        // Send AJAX request to fetch user data
        $.ajax({
            url: '/edith/' + userId, // URL to fetch user data
            method: 'GET',
            success: function(response) {
                // Populate modal form fields with user data
                $("input[name='firstName']").val(response.firstName);
                $("input[name='email']").val(response.email);
                $("input[name='position']").val(response.position);
                $("select[name='role']").val(response.role);
            },
            error: function(xhr, status, error) {
                // Handle errors
                console.error(xhr.responseText);
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const deleteLinks = document.querySelectorAll(".delete-user");

    deleteLinks.forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();

            const confirmDelete = confirm("Are you sure you want to delete?");

            if (confirmDelete) {
                window.location.href = link.getAttribute("href");
            }
        });
    });
});