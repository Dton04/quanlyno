const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const debtRoutes = require('./routes/debtRoutes');
const productRoutes = require('./routes/productRoutes');

require('dotenv').config();

const app = express();
connectDB();

app.use(cors({
  origin: [
    'http://localhost:3000', 'https://mqstoreno.vercel.app'
  ],
}));
app.use(express.json());
app.use('/api/debts', debtRoutes);
app.use('/api/products', productRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));