import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Quản Lý Nợ</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Tổng Quan</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/debts">Danh Sách Nợ</Link>
            </li>
            <li>
              <Link className="nav-link" to="/grocery">Tạp Hóa</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;