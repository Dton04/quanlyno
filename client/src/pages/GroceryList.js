import { useEffect, useState } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../api/products';
import ProductForm from '../components/ProductForm';

function GroceryList() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
   const handleSearch = (e) => {
      setSearch(e.target.value);
   };
   const filteredProducts = products
  .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  .sort((a, b) => a.name.localeCompare(b.name));


  const fetchProducts = async () => {
    try {
      const { data } = await getProducts();
      setProducts(data);
    } catch (err) {
      alert('Lỗi tải sản phẩm');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (form) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, form);
      } else {
        await createProduct(form);
      }
      fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      alert('Lỗi khi lưu sản phẩm');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        alert('Xóa thất bại');
      }
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Tạp Hóa</h2>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm theo tên hoặc số điện thoại"
          value={search}
          onChange={handleSearch}
        />
      </div>
      <button className="btn btn-primary mb-3" onClick={() => {
        setEditingProduct(null);
        setShowForm(true);
      }}>Thêm hàng</button>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Tên</th>
            <th className="text-end">Giá (VND)</th>
            <th className="text-end">SL</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan="4" className="text-center">Không có sản phẩm</td></tr>
          ) : filteredProducts.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td className="text-end">{p.price?.toLocaleString()}</td>
              <td className="text-end">{p.quantity}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => {
                  setEditingProduct(p);
                  setShowForm(true);
                }}>Sửa</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default GroceryList;
