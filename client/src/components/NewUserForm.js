import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function NewUserForm({ show, onClose, onSubmit, error, success }) {
  const [newUser, setNewUser] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });

    // Kiểm tra hợp lệ
    const newErrors = {};
    if (!newUser.name) newErrors.name = 'Tên là bắt buộc';
    if (newUser.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) newErrors.email = 'Email không hợp lệ';
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name) {
      setErrors({ name: 'Tên là bắt buộc' });
      return;
    }
    if (newUser.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      setErrors({ email: 'Email không hợp lệ' });
      return;
    }
    onSubmit(newUser);
    setNewUser({ name: '', phone: '', email: '' });
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thêm Người Nợ Mới</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Tên</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  name="name"
                  value={newUser.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={Object.keys(errors).length > 0 || !newUser.name}
              >
                Thêm người nợ
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

NewUserForm.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  success: PropTypes.string,
};

export default NewUserForm;