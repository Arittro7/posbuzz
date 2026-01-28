import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './components/Layout';      
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sales" element={<Sales />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;