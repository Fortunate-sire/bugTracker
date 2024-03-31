/* eslint-disable */
// jQuery editing User AJAX
$(document).ready(function() {
    $(document).on('click', '.edit-user', function() {
        var userId = $(this).data('user-id');
        $("form[name='editUserForm']").attr('action', '/edit/' + userId);
        
        // Send AJAX request to fetch user data by Id
        $.ajax({
            url: '/edit/' + userId,
            method: 'GET',
            success: function(response) {
                console.log(response.position);
                $("input[name='firstName']").val(response.firstName);
                $("input[name='email']").val(response.email);
                $("select[name='position']").val(response.position);
                $("select[name='role']").val(response.role);
               
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    });
});


// jQuery for pupulating contibutors Using ajax
function populateContributors(users, contributors) {
    const contributorsArea = $('.scrollable-box');
    contributorsArea.empty();
    users.forEach((user, index) => {
        let isChecked = contributors && contributors.includes(user.userName);
        var contributorCheckbox = $('<input>', { class: 'form-check-input',  type: 'checkbox', value: user.userName, name: 'contributors', id: 'contributor' + index });
        if (isChecked) {
            contributorCheckbox.attr('checked', true);
        }
        var contributorLabel = $('<label>', { class: 'form-check-label', text: user.firstName, for: 'contributor' + index });
        var contributorDiv = $('<div>', { class: 'form-check' }).append(contributorCheckbox, contributorLabel);
        contributorsArea.append(contributorDiv);
    });
}
$(document).ready(function() {
    $(document).on('click', '.getUsers', function() {
        
        // Send AJAX request to fetch user data
        $.ajax({
            url: '/allUsers',
            method: 'GET',
            success: function(users) {
                populateContributors(users);
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    });
});


// for editing projects
$(document).ready(function() {
    $(document).on('click', '.edit-project', function() {
        const projectId = $(this).data('project-id');
        $("form[name='edithProjectForm']").attr('action', '/editProject/' + projectId);
        
        // Send AJAX request to fetch user data by Id
        $.ajax({
            url: '/getProject/' + projectId,
            method: 'GET',
            success: function(response) {
                $("input[name='title']").val(response.title);
                $("textarea[name='description']").val(response.description);
                const contributors = []
                $.ajax({
                    url: '/allUsers',
                    method: 'GET',
                    success: function(users) {
                      response.contributors.forEach((contributor) => {
                            contributors.push(contributor.userName);
                        });
                        populateContributors(users, contributors);
                    },
                    error: function(xhr, status, error) {
                        console.error(xhr.responseText);
                    }
                });   
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    });
});

$(document).ready(function() {
    $(document).on('click', '.edit-ticket', function() {
        var ticketId = $(this).data('ticket-id');
        $("form[name='editTicketForm']").attr('action', '/editTicket/' + ticketId);
        const assingedUsers = []
        
        // Send AJAX request to fetch user data by Id
        $.ajax({
            url: '/getTicket/' + ticketId,
            method: 'GET',
            success: function(response) {
                console.log(response);
                $("input[name='title']").val(response.ticket.title);
                $("textarea[name='description']").val(response.ticket.description);
                $("select[name='type']").val(response.ticket.type);
                $("select[name='priority']").val(response.ticket.priority);
                $("select[name='status']").val(response.ticket.status);

                response.ticket.assinged.forEach((assinged) => {
                    assingedUsers.push(assinged.userName);
                });
                users = response.project.contributors
                populateContributors(users, assingedUsers);
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    });
});