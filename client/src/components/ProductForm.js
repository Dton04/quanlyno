import { useState, useEffect } from 'react';

export default function ProductForm({ initialData, onSubmit, onClose }) {
  const [form, setForm] = useState({ name: '', price: '', quantity: '' });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'price' || name === 'quantity' ? Number(value) : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{initialData ? 'Chỉnh sửa' : 'Thêm'} hàng hóa</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Tên hàng</label>
                <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Giá (VND)</label>
                <input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Số lượng</label>
                <input type="number" className="form-control" name="quantity" value={form.quantity} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary">Lưu</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
