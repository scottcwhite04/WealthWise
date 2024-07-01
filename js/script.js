const apiUrl = 'https://your-app-name.herokuapp.com'; // Replace with your actual Heroku app URL

let bills = [];
let isEditing = false;
let currentBillId = null;

async function addOrUpdateBill() {
    const billName = document.getElementById('billName').value;
    const billAmount = parseFloat(document.getElementById('billAmount').value);
    const billDueDate = parseInt(document.getElementById('billDueDate').value);

    if (billName && !isNaN(billAmount) && !isNaN(billDueDate) && billDueDate >= 1 && billDueDate <= 31) {
        if (isEditing) {
            await updateBillOnServer(currentBillId, billName, billAmount, billDueDate);
        } else {
            await addBillToServer(billName, billAmount, billDueDate);
        }
        clearForm();
    } else {
        alert('Please enter valid bill details.');
    }
}

async function addBillToServer(name, amount, dueDate) {
    const response = await fetch(`${apiUrl}/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount, dueDate })
    });
    const bill = await response.json();
    bills.push(bill);
    displayBills();
}

async function updateBillOnServer(id, name, amount, dueDate) {
    const response = await fetch(`${apiUrl}/bills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount, dueDate })
    });
    const updatedBill = await response.json();
    const billIndex = bills.findIndex(bill => bill.id === id);
    if (billIndex !== -1) {
        bills[billIndex] = updatedBill;
        displayBills();
        isEditing = false;
        currentBillId = null;
        document.getElementById('cancelEditButton').style.display = 'none';
    }
}

async function deleteBillFromServer(id) {
    await fetch(`${apiUrl}/bills/${id}`, { method: 'DELETE' });
    bills = bills.filter(bill => bill.id !== id);
    displayBills();
}

async function loadBillsFromServer() {
    const response = await fetch(`${apiUrl}/bills`);
    bills = await response.json();
    displayBills();
}

function displayBills() {
    const billsTableBody = document.getElementById('billsTableBody');
    billsTableBody.innerHTML = '';

    bills.forEach(bill => {
        const row = `<tr>
            <td>${bill.name}</td>
            <td>${bill.amount.toFixed(2)}</td>
            <td>${bill.dueDate}</td>
            <td class="actions">
                <button onclick="editBill(${bill.id})">Edit</button>
                <button onclick="deleteBillFromServer(${bill.id})">Delete</button>
            </td>
        </tr>`;
        billsTableBody.innerHTML += row;
    });
}

function editBill(id) {
    const bill = bills.find(bill => bill.id === id);
    if (bill) {
        document.getElementById('billName').value = bill.name;
        document.getElementById('billAmount').value = bill.amount;
        document.getElementById('billDueDate').value = bill.dueDate;
        isEditing = true;
        currentBillId = id;
        document.getElementById('cancelEditButton').style.display = 'inline-block';
    }
}

function clearForm() {
    document.getElementById('billName').value = '';
    document.getElementById('billAmount').value = '';
    document.getElementById('billDueDate').value = '';
    isEditing = false;
    currentBillId = null;
    document.getElementById('cancelEditButton').style.display = 'none';
}

function cancelEdit() {
    clearForm();
}

// Load bills initially
loadBillsFromServer();
 
