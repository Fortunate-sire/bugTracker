/* eslint-disable */

function updateTable(users) {
  const tableBody = document.querySelector('#userTable tbody');
  tableBody.innerHTML = ''; // Clear existing rows
  if (users.length === 0) {
      // If no users found, display a message
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="5">No users found</td>';
      tableBody.appendChild(row);
  } else {
      // Populate table with users
      users.forEach((user) => {
          const row = document.createElement('tr');

          // Create and append table cells
          row.innerHTML = `
              <td>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="${user._id}" id="checkbox${user._id}" name="selected">
                      <label class="form-check-label" for="checkbox${user._id}"></label>
                  </div>
              </td>
              <td>
                  <div class="client">
                      <div class="client-info">
                          <h4>${user.firstName}</h4>
                          <small>${user.email}</small>
                      </div>
                  </div>
              </td>
              <td>${user.position ? user.position.position : 'none'}</td>
              <td>${user.role}</td>
              <td>
                  <div class="actions">
                      <div class="dropdown">
                          <i class="fa-solid fa-caret-down" id="actionsDropdown" data-bs-toggle="dropdown" aria-expanded="false"></i>
                          <ul class="dropdown-menu" aria-labelledby="actionsDropdown">
                              <li><a class="dropdown-item edit-user" href="#" data-bs-toggle="modal" data-bs-target="#edithUserModal" data-user-id="${user._id}">Edit</a></li>
                              <li><a class="dropdown-item delete" href="delete/${user._id}">Delete</a></li>
                          </ul>
                      </div>
                  </div>
              </td>
          `;
          tableBody.appendChild(row);
      });
  }
}

function updateProjectTable(projects) {
  const tableBody = document.querySelector('#userTable tbody');
  tableBody.innerHTML = ''; // Clear existing rows
  if (projects.length === 0) {
      // If no users found, display a message
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="5">No Projects found</td>';
      tableBody.appendChild(row);
  } else {
      // Populate table with users
      projects.forEach((project) => {
          const row = document.createElement('tr');

          // Create and append table cells
          row.innerHTML = `
              <td>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="${project._id}" id="checkbox${project._id}" name="selected">
                      <label class="form-check-label" for="checkbox${project._id}"></label>
                  </div>
              </td>
              <td>
                  <div class="client">
                      <div class="client-info">
                    <a style="text-decoration: none;" href="tickets/${project._id}">
                      <h4 style="cursor: pointer; color: rgb(8, 114, 79); font-size: 20px;">${project.title}</h4>
                    </a>
                      </div>
                  </div>
              </td>
              <td>${project.description.substring(0, 50)}${project.description.length > 50 ? '...' : ''}</td>
              <td>
              ${project.contributors.map(contributor => contributor.firstName).join(', ').substring(0, 20)}${project.contributors.map(contributor => contributor.firstName).join(', ').length > 20 ? '...' : ''}
                </td>
              <td>
                  <div class="actions">
                      <div class="dropdown">
                          <i class="fa-solid fa-caret-down" id="actionsDropdown" data-bs-toggle="dropdown" aria-expanded="false"></i>
                          <ul class="dropdown-menu" aria-labelledby="actionsDropdown">
                              <li><a class="dropdown-item edit-project" href="#" data-bs-toggle="modal" data-bs-target="#edithUserModal" data-user-id="${project._id}">Edit</a></li>
                              <li><a class="dropdown-item delete" href="deleteProject/${project._id }">Delete</a></li>
                          </ul>
                      </div>
                  </div>
              </td>
          `;
          tableBody.appendChild(row);
      });
  }
}

// eslint-disable-next-line no-unused-vars
function searchData(e) {
  fetch('searchUser', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ payload: e.value }), // holds the value of the input
  }).then((res) => res.json()).then((data) => {
      const { payload } = data;
      updateTable(payload);
  });
}

function searchProjects(e) {
  fetch('searchProjects', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ payload: e.value }), // holds the value of the input
  }).then((res) => res.json()).then((data) => {
      const { payload } = data;
      updateProjectTable(payload);
  });
}

// Search for contributors to add to a project
let checkedUsers = []; // Maintain an array to store checked users

$(document).ready(function() {
  function getCheckedUserNames() {
      const contributorsArea = $('.scrollable-box');
      contributorsArea.find('input[type="checkbox"]:checked').each(function() {
          checkedUsers.push($(this).val());
      });
  }
  // Attach a handler to the modal shown event
  $('#edithProjectModal, #editTicketModal').on('shown.bs.modal', function() {
      getCheckedUserNames();
  });
});

function updateProjectContributors(users) {
  const contributorsArea = $('.scrollable-box');
  contributorsArea.empty();
  users.forEach((user, index) => {
      const isChecked = checkedUsers.includes(user.userName); // Check if user is checked
      const contributorCheckbox = $('<input>', { class: 'form-check-input', type: 'checkbox', value: user.userName, name: 'contributors', id: 'contributor' + index });
      if (isChecked) {
          contributorCheckbox.prop('checked', true); // Check the checkbox if user was previously checked
      }
      const contributorLabel = $('<label>', { class: 'form-check-label', text: user.firstName, for: 'contributor' + index });
      const contributorDiv = $('<div>', { class: 'form-check' }).append(contributorCheckbox, contributorLabel);
      contributorsArea.append(contributorDiv);
  });
}

// Event listener for checkbox change
$('.scrollable-box').on('change', 'input[type="checkbox"]', function() {
  const isChecked = $(this).prop('checked');
  const userName = $(this).val();

  if (isChecked && !checkedUsers.includes(userName)) {
      checkedUsers.push(userName); // Add checked user to array
  } else if (!isChecked && checkedUsers.includes(userName)) {
      checkedUsers = checkedUsers.filter((user) => user !== userName);
  }
});

// eslint-disable-next-line no-unused-vars
function searchProjectContributors(e) {
  fetch('searchProjectContributors', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ payload: e.value }),
  }).then((res) => res.json()).then((data) => {
      const { payload } = data;
      updateProjectContributors(payload);
  });
}

function searchTicketProjectContributors(e) {
    const inputElement = e; // 'e' here is the input element itself passed from the onkeyup event
    const projectId = inputElement.getAttribute('data-project-id');
    fetch('/searchTicketProjectContributors/' + projectId, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ payload: e.value }),
    }).then((res) => res.json()).then((data) => {
        const { payload } = data;
        console.log(payload)
        updateProjectContributors(payload);
    });
  }