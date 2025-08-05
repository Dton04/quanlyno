import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DebtList from './pages/DebtList';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

import GroceryList from './pages/GroceryList';


function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/debts" element={<DebtList />} />
          <Route path="/grocery" element={<GroceryList />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;