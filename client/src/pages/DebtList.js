import { useEffect, useState } from 'react';
import {
  getUsers,
  getUserDebts,
  addUser,
  addDebt,
  updateDebtStatus,
  makePayment,
} from '../api/debt';
import NewUserForm from '../components/NewUserForm';
import NewDebtForm from '../components/NewDebtForm';
import PaymentForm from '../components/PaymentForm';
import DebtDetails from '../components/DebtDetails';

function DebtList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDebts, setUserDebts] = useState([]);
  const [search, setSearch] = useState('');
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showNewDebtForm, setShowNewDebtForm] = useState(false);
  const [showDebtDetails, setShowDebtDetails] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getUsers();
        setUsers(data);
        setError('');
      } catch (error) {
        setError(error.response?.data?.message || 'Không thể tải danh sách người nợ');
      }
    };
    fetchUsers();
  }, []);

  const fetchUserDebts = async (userId) => {
    try {
      const { data } = await getUserDebts(userId);
      setUserDebts(data.debts);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Không thể tải danh sách khoản nợ');
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleAddUser = async (userData) => {
    try {
      const response = await addUser(userData);
      setSuccess(response.data.message || 'Thêm người nợ thành công');
      setShowNewUserForm(false);
      const { data } = await getUsers();
      setUsers(data);
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi thêm người nợ');
    }
  };

  const handleAddDebt = async (debtData) => {
    try {
      await addDebt(debtData);
      setSuccess('Thêm khoản nợ thành công');
      setShowNewDebtForm(false);
      const { data } = await getUsers();
      setUsers(data);
      if (selectedUser && showDebtDetails) {
        fetchUserDebts(selectedUser._id);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi thêm khoản nợ');
    }
  };

  const handleMarkAsPaid = async (debtId) => {
    try {
      await updateDebtStatus(debtId, 'paid');
      const { data } = await getUsers();
      setUsers(data);
      if (selectedUser) {
        fetchUserDebts(selectedUser._id);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái khoản nợ');
    }
  };

  const handlePayment = async (amount) => {
    try {
      const response = await makePayment(selectedUser._id, amount);
      setSuccess(response.data.message || 'Thanh toán thành công');
      setShowPaymentForm(false);
      const { data } = await getUsers();
      setUsers(data);
      if (selectedUser) {
        fetchUserDebts(selectedUser._id);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi thanh toán');
    }
  };

  const filteredUsers = users
    .filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      (user.phone && user.phone.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container py-4">
      <h2 className="mb-4">Danh sách người nợ</h2>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm theo tên hoặc số điện thoại"
          value={search}
          onChange={handleSearch}
        />
      </div>
      <div className="mb-3 d-flex flex-column flex-md-row gap-2">
        <button
          className="btn btn-primary"
          onClick={() => setShowNewUserForm(true)}
        >
          Thêm người nợ mới
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Tên người nợ</th>
              <th className="d-none d-md-table-cell">Thông tin liên hệ</th>
              <th>Tổng nợ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  {search ? 'Không tìm thấy người nợ' : 'Không có người nợ'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div>{user.name}</div>
                    <div className="d-md-none small text-muted">
                      {user.phone && <div>SĐT: {user.phone}</div>}
                    </div>
                  </td>
                  <td className="d-none d-md-table-cell">
                    <div>Email: {user.email}</div>
                    {user.phone && <div>SĐT: {user.phone}</div>}
                  </td>
                  <td className="text-end fw-bold text-danger">
                    {user.totalDebt?.toLocaleString() || 0} VND
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setShowNewDebtForm(true);
                          setSelectedUser(user);
                        }}
                      >
                        Thêm nợ
                      </button>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => {
                          setSelectedUser(user);
                          fetchUserDebts(user._id);
                          setShowDebtDetails(true);
                        }}
                      >
                        Xem chi tiết
                      </button>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowPaymentForm(true);
                        }}
                      >
                        Thanh toán
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <NewUserForm
        show={showNewUserForm}
        onClose={() => {
          setShowNewUserForm(false);
          setError('');
          setSuccess('');
        }}
        onSubmit={handleAddUser}
        error={error}
        success={success}
      />

      <NewDebtForm
        show={showNewDebtForm}
        onClose={() => {
          setShowNewDebtForm(false);
          setSelectedUser(null);
          setError('');
          setSuccess('');
        }}
        onSubmit={handleAddDebt}
        users={users}
        error={error}
        success={success}
        selectedUserId={selectedUser?._id}
      />

      <PaymentForm
        show={showPaymentForm}
        onClose={() => {
          setShowPaymentForm(false);
          setSelectedUser(null);
          setError('');
          setSuccess('');
        }}
        onSubmit={handlePayment}
        selectedUser={selectedUser}
        error={error}
        success={success}
      />

      <DebtDetails
        show={showDebtDetails}
        onClose={() => {
          setShowDebtDetails(false);
          setSelectedUser(null);
          setError('');
        }}
        selectedUser={selectedUser}
        userDebts={userDebts}
        onAddDebt={() => {
          setShowDebtDetails(false);
          setShowNewDebtForm(true);
        }}
        onMarkAsPaid={handleMarkAsPaid}
        error={error}
      />
    </div>
  );
}

export default DebtList;