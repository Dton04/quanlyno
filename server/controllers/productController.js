const Product = require('../models/Product');

const addProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    if (!name || !price || !quantity) {
      return res.status(400).json({ message: 'Tên, giá và số lượng là bắt buộc' });
    }

    const product = new Product({ name, price, quantity });
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
}

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
}

const updateProduct = async (req, res) => {
   try {
      const { id } = req.params;
      const { name, price, quantity } = req.body;
   
      if (!name || !price || !quantity) {
         return res.status(400).json({ message: 'Tên, giá và số lượng là bắt buộc' });
      }
   
      const product = await Product.findByIdAndUpdate(id, { name, price, quantity }, { new: true });
      if (!product) {
         return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
      }
   
      res.status(200).json(product);
   } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Lỗi server: ' + error.message });
   }
}


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
    }
      res.status(200).json({ message: 'Sản phẩm đã được xóa' });
   } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Lỗi server: ' + error.message });
   }   
}

module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct
};
