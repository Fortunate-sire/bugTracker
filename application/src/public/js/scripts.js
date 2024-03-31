document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#userTable, #ticketTable tbody');
  // Event delegation for delete links
  tableBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete')) {
      event.preventDefault();
      const confirmDelete = confirm('Are you sure you want to delete?');
      if (confirmDelete) {
        window.location.href = event.target.getAttribute('href');
      }
    }
  });
});
