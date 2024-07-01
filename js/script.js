document.addEventListener('DOMContentLoaded', function() {
  const billForm = document.getElementById('billForm');
  const billTableBody = document.getElementById('billTableBody');
  let editMode = false; // Flag to track edit mode
  let editedRowIndex = -1; // Index of the row being edited

  // Function to format due date to only show the day
  function formatDueDate(fullDate) {
    const day = parseInt(fullDate); // Convert to integer
    if (day >= 1 && day <= 31) {
      return day; // Return the day if it's within valid range
    } else {
      return null; // Return null for invalid input
    }
  }

  // Function to reset form and edit mode
  function resetForm() {
    billForm.reset();
    editMode = false;
    editedRowIndex = -1;
  }

  // Function to populate form fields for editing
  function populateFormForEdit(row) {
    const cells = row.querySelectorAll('td');
    document.getElementById('billName').value = cells[0].textContent;
    document.getElementById('billAmount').value = parseFloat(cells[1].textContent.replace('$', ''));
    document.getElementById('billDueDate').value = cells[2].textContent;
    editMode = true;
    editedRowIndex = Array.from(billTableBody.children).indexOf(row);
  }

  // Event listener for form submission
  billForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const billName = document.getElementById('billName').value.trim();
    const billAmount = parseFloat(document.getElementById('billAmount').value);
    const billDueDate = formatDueDate(document.getElementById('billDueDate').value);

    // Validate input
    if (!billName || isNaN(billAmount) || billDueDate === null) {
      alert('Please fill out all fields correctly.');
      return;
    }

    // If in edit mode, update the existing row
    if (editMode && editedRowIndex !== -1) {
      const row = billTableBody.children[editedRowIndex];
      row.innerHTML = `
        <td>${billName}</td>
        <td>$${billAmount.toFixed(2)}</td>
        <td>${billDueDate}</td>
        <td>
          <button class="deleteBtn">Delete</button>
          <button class="editBtn">Edit</button>
        </td>
      `;
      resetForm();
      return;
    }

    // Create a new row in the table
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${billName}</td>
      <td>$${billAmount.toFixed(2)}</td>
      <td>${billDueDate}</td>
      <td>
        <button class="deleteBtn">Delete</button>
        <button class="editBtn">Edit</button>
      </td>
    `;
    billTableBody.appendChild(newRow);

    // Clear form fields after adding bill
    resetForm();
  });

  // Event listener for deleting or editing bills
  billTableBody.addEventListener('click', function(event) {
    const target = event.target;
    const row = target.closest('tr');

    if (target.classList.contains('deleteBtn')) {
      row.remove(); // Delete the row
    } else if (target.classList.contains('editBtn')) {
      populateFormForEdit(row); // Edit the row
    }
  });
});
