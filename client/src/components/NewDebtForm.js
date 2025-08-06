import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function NewDebtForm({ show, onClose, onSubmit, users, error, success, selectedUserId }) {
  const [newDebt, setNewDebt] = useState({ userId: selectedUserId || '', amount: '', description: '' });
  const [errors, setErrors] = useState({});

  // Cập nhật userId khi selectedUserId thay đổi
  useEffect(() => {
    if (selectedUserId) {
      setNewDebt(prev => ({ ...prev, userId: selectedUserId }));
    }
  }, [selectedUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDebt({ ...newDebt, [name]: name === 'amount' ? Number(value) : value });

    // Kiểm tra hợp lệ
    const newErrors = {};
    if (!newDebt.userId) newErrors.userId = 'Vui lòng chọn người nợ';
    if (newDebt.amount <= 0) newErrors.amount = 'Số tiền phải lớn hơn 0';
    if (!newDebt.description) newErrors.description = 'Ghi chú là bắt buộc';
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newDebt.userId || newDebt.amount <= 0 || !newDebt.description) {
      setErrors({
        userId: !newDebt.userId ? 'Vui lòng chọn người nợ' : '',
        amount: newDebt.amount <= 0 ? 'Số tiền phải lớn hơn 0' : '',
        description: !newDebt.description ? 'Ghi chú là bắt buộc' : '',
      });
      return;
    }
    onSubmit(newDebt);
    setNewDebt({ userId: '', amount: '', description: '' });
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thêm khoản nợ mới</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Người nợ</label>
                <select
                  className={`form-select ${errors.userId ? 'is-invalid' : ''}`}
                  name="userId"
                  value={newDebt.userId}
                  onChange={handleChange}
                  required
                  disabled={!!selectedUserId}
                >
                  <option value="">Chọn người nợ</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} - {user.phone || 'N/A'}
                    </option>
                  ))}
                </select>
                {errors.userId && <div className="invalid-feedback">{errors.userId}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Số tiền (VND)</label>
                <input
                  type="number"
                  className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                  name="amount"
                  value={newDebt.amount}
                  onChange={handleChange}
                  required
                  min="1"
                />
                {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Ghi chú</label>
                <textarea
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  name="description"
                  value={newDebt.description}
                  onChange={handleChange}
                  required
                ></textarea>
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={Object.keys(errors).length > 0 || !newDebt.userId || newDebt.amount <= 0 || !newDebt.description}
              >
                Thêm khoản nợ
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

NewDebtForm.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      phone: PropTypes.string,
    })
  ).isRequired,
  error: PropTypes.string,
  success: PropTypes.string,
  selectedUserId: PropTypes.string
};

export default NewDebtForm;