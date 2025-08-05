import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function DebtDetails({ show, onClose, selectedUser, userDebts, onAddDebt, onMarkAsPaid, error }) {
   if (!show || !selectedUser) return null;

   return (
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
         <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content rounded-3 shadow" style={{ maxHeight: '90vh', overflowY: 'auto' }}>

               <div className="modal-header bg-light border-bottom">
                  <h5 className="modal-title">Chi tiết nợ - {selectedUser.name}</h5>
                  <button type="button" className="btn-close" onClick={onClose}></button>
               </div>
               <div className="modal-body">
                  <div className="card mb-3">
                     <div className="card-body">
                        <h6 className="card-title">Thông tin người nợ:</h6>
                        <p className="card-text mb-1">Tên: {selectedUser.name}</p>
                        <p className="card-text mb-1">Email: {selectedUser.email}</p>
                        {selectedUser.phone && <p className="card-text mb-1">SĐT: {selectedUser.phone}</p>}
                        <p className="card-text mb-1">
                           Tổng nợ: <span className="text-danger fw-bold">{selectedUser.totalDebt?.toLocaleString() || 0} VND</span>
                        </p>
                     </div>
                  </div>

                  {error && <div className="alert alert-danger mb-3">{error}</div>}
                  <div className="d-flex justify-content-between mb-3">
                     <h6>Danh sách các khoản nợ</h6>
                     <button className="btn btn-primary btn-sm" onClick={onAddDebt}>
                        Thêm khoản nợ mới
                     </button>
                  </div>

                  <div className="table-responsive">
                     <table className="table table-striped table-bordered align-middle">
                        <thead className="table-dark">
                           <tr>
                              <th>Ngày</th>
                              <th className="text-end">Số tiền</th>
                              <th>Ghi chú</th>
                              <th>Trạng thái</th>

                           </tr>
                        </thead>
                        <tbody>
                           {userDebts.map((debt) => (
                              <tr key={debt._id}>
                                 <td>{debt.formattedDate}</td>
                                 <td className="text-end fw-bold">{debt.amount?.toLocaleString()} VND</td>
                                 <td className='text-wrap'>{debt.description}</td>
                                 <td>
                                    <span className={`badge ${debt.status === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                                       {debt.status === 'paid' ? 'Đã trả' : 'Chưa trả'}
                                    </span>
                                 </td>


                              </tr>
                           ))}
                           {userDebts.length === 0 && (
                              <tr>
                                 <td colSpan="5" className="text-center">
                                    Chưa có khoản nợ nào
                                 </td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

DebtDetails.propTypes = {
   show: PropTypes.bool.isRequired,
   onClose: PropTypes.func.isRequired,
   selectedUser: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
      totalDebt: PropTypes.number.isRequired,
   }),
   userDebts: PropTypes.arrayOf(
      PropTypes.shape({
         _id: PropTypes.string.isRequired,
         formattedDate: PropTypes.string.isRequired,
         amount: PropTypes.number.isRequired,
         description: PropTypes.string.isRequired,
         status: PropTypes.string,
      })
   ).isRequired,
   onAddDebt: PropTypes.func.isRequired,
   onMarkAsPaid: PropTypes.func.isRequired,
   error: PropTypes.string,
};

export default DebtDetails;