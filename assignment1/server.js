const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// In-memory array to store items
let items = [];

let nextId = 1;

// GET all items
app.get('/api/items', (req, res) => {
    res.json(items);
});

// GET single item by ID
app.get('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
});

// POST create new item
app.post('/api/items', (req, res) => {
    const { name, price } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    const newItem = {
        id: nextId++,
        name,
        price: price || 0
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

// PUT update item
app.put('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(i => i.id === id);
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }
    const { name, price } = req.body;
    items[itemIndex] = {
        ...items[itemIndex],
        name: name || items[itemIndex].name,
        price: price !== undefined ? price : items[itemIndex].price
    };
    res.json(items[itemIndex]);
});

// DELETE item
app.delete('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(i => i.id === id);
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }
    items.splice(itemIndex, 1);
    res.status(204).send();
});

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
