import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Firms from './pages/Firms';
import KiranaHome from './pages/kirana/KiranaHome';
import CustomerDetail from './pages/kirana/CustomerDetail';
import StoreSelect from './pages/cold/StoreSelect';
import StoreHome from './pages/cold/StoreHome';
import MillSelect from './pages/rice-mill/MillSelect';
import MillHome from './pages/rice-mill/MillHome';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="app-shell">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/firms" element={<Firms />} />
              <Route path="/kirana" element={<KiranaHome />} />
              <Route path="/kirana/customers/:id" element={<CustomerDetail />} />
              <Route path="/cold-storage" element={<StoreSelect />} />
              <Route path="/cold-storage/:storeId" element={<StoreHome />} />
              <Route path="/rice-mill" element={<MillSelect />} />
              <Route path="/rice-mill/:millId" element={<MillHome />} />
            </Route>

            <Route path="*" element={<Navigate to="/firms" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}
