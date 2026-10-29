const API_URL = '/api/items';

// Load items on page load
document.addEventListener('DOMContentLoaded', loadItems);

// Load all items
async function loadItems() {
    try {
        const response = await fetch(API_URL);
        const items = await response.json();
        displayItems(items);
    } catch (error) {
        console.error('Error loading items:', error);
        alert('Failed to load items');
    }
}

// Display items in table
function displayItems(items) {
    const tbody = document.getElementById('itemsTableBody');
    tbody.innerHTML = '';

    items.forEach(item => {
        const row = document.createElement('tr');
        const price = item.price !== undefined && item.price !== null ? parseFloat(item.price).toFixed(2) : '0.00';
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${escapeHtml(item.name)}</td>
            <td>₹${price}</td>
            <td class="actions">
                <button class="btn btn-edit" onclick="editItem(${item.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Open modal for adding new item
function openModal(isEdit = false) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('itemForm');
    
    modal.style.display = 'flex';
    
    if (!isEdit) {
        modalTitle.textContent = 'Add Item';
        form.reset();
        document.getElementById('itemId').value = '';
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Handle form submission
document.getElementById('itemForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const itemId = document.getElementById('itemId').value;
    const name = document.getElementById('itemName').value;
    const price = document.getElementById('itemPrice').value;

    const itemData = {
        name,
        price: parseFloat(price) || 0
    };

    try {
        if (itemId) {
            // Update existing item
            await fetch(`${API_URL}/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(itemData)
            });
        } else {
            // Create new item
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(itemData)
            });
        }

        closeModal();
        loadItems();
    } catch (error) {
        console.error('Error saving item:', error);
        alert('Failed to save item');
    }
});

// Edit item
async function editItem(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const item = await response.json();

        document.getElementById('itemId').value = item.id;
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemPrice').value = item.price;

        const modalTitle = document.getElementById('modalTitle');
        modalTitle.textContent = 'Edit Item';

        openModal(true);
    } catch (error) {
        console.error('Error loading item:', error);
        alert('Failed to load item');
    }
}

// Delete item
async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        loadItems();
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
