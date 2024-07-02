const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://atlas-sql-667eebe5bd6e616451d355b5-59xyr.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const BillSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    dueDate: Number
});

const Bill = mongoose.model('Bill', BillSchema);

// Routes
app.get('/bills', async (req, res) => {
    const bills = await Bill.find();
    res.json(bills);
});

app.post('/bills', async (req, res) => {
    const { name, amount, dueDate } = req.body;
    const bill = new Bill({ name, amount, dueDate });
    await bill.save();
    res.json(bill);
});

app.put('/bills/:id', async (req, res) => {
    const { id } = req.params;
    const { name, amount, dueDate } = req.body;
    const bill = await Bill.findByIdAndUpdate(id, { name, amount, dueDate }, { new: true });
    res.json(bill);
});

app.delete('/bills/:id', async (req, res) => {
    const { id } = req.params;
    await Bill.findByIdAndDelete(id);
    res.json({ message: 'Bill deleted' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});