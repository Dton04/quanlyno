import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Dashboard() {
  const [totalDebt, setTotalDebt] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/debts`);
        const total = data.debts.reduce((sum, debt) => sum + debt.amount, 0);
        const users = new Set(data.debts.map((debt) => debt.userId._id)).size;
        setTotalDebt(total);
        setUserCount(users);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Tổng Quan</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Tổng Nợ</h5>
              <p className="card-text fs-3">{totalDebt.toLocaleString()} VND</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Tổng Số Người Nợ</h5>
              <p className="card-text fs-3">{userCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;