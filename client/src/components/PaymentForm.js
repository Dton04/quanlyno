import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function PaymentForm({ show, onClose, onSubmit, selectedUser, error, success }) {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const value = Number(e.target.value);
    setPaymentAmount(value);

    // Kiểm tra hợp lệ
    const newErrors = {};
    if (value <= 0) newErrors.amount = 'Số tiền phải lớn hơn 0';
    if (value > selectedUser.totalDebt) newErrors.amount = `Số tiền không được vượt quá ${selectedUser.totalDebt.toLocaleString()} VND`;
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentAmount <= 0 || paymentAmount > selectedUser.totalDebt) {
      setErrors({
        amount: paymentAmount <= 0 ? 'Số tiền phải lớn hơn 0' : `Số tiền không được vượt quá ${selectedUser.totalDebt.toLocaleString()} VND`,
      });
      return;
    }
    onSubmit(paymentAmount);
    setPaymentAmount('');
  };

  if (!show || !selectedUser) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thanh toán nợ - {selectedUser.name}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Số tiền thanh toán (VND)</label>
                <input
                  type="number"
                  className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                  value={paymentAmount}
                  onChange={handleChange}
                  required
                  min="1"
                  max={selectedUser.totalDebt}
                />
                {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
              </div>
              <div className="mb-3">
                <p>Tổng nợ hiện tại: <strong>{selectedUser.totalDebt?.toLocaleString()} VND</strong></p>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={Object.keys(errors).length > 0 || paymentAmount <= 0 || paymentAmount > selectedUser.totalDebt}
              >
                Xác nhận thanh toán
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

PaymentForm.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  selectedUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    totalDebt: PropTypes.number.isRequired,
  }),
  error: PropTypes.string,
  success: PropTypes.string,
};

export default PaymentForm;