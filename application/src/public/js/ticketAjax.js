/* eslint-disable */
function getUsers(projectId) {
    // Send AJAX request to fetch project Contributors data
    $.ajax({
        url: '/getProjectContributors/' + projectId,
        method: 'GET',
        success: function(users) {
            populateContributors(users);
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
}

$(document).ready(function() {
    $(document).on('click', '.getContributors', function() {
        const projectId = $(this).data('project-id');
        getUsers(projectId);
    });
});

$(document).ready(function() {
    $(document).on('click', '.sendMessage', function(event) {
        event.preventDefault();
        const ticketId = $(this).data('ticket-id');
        $.ajax({
            url: '/ticketMessage/' + ticketId,
            method: 'POST',
            data: $('#messageForm').serialize(),
            success: function(response) {
                const formattedDate = new Date(response.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                // Append the new message to the messages container
                $('.messages').append(`
                    <div class="chat-message d-flex justify-content-between align-items-center">
                        <div>
                            <p class="mb-1"><strong>${response.user.firstName}</strong> - <span class="message-date">${formattedDate}</span></p>
                            <p class="mb-0">${response.message}</p>
                            <hr>
                        </div>
                        <button class="btn btn-sm btn-danger delete-message"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `);
                
                // Clear the input field after sending the message
                $('#messageForm input[name="message"]').val('');
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    });
});

