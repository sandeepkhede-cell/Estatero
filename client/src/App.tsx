import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import ChatFAB from './components/layout/ChatFAB';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import DetailPage from './pages/DetailPage';
import SavedPage from './pages/SavedPage';
import AuthPage from './pages/AuthPage';

const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <Outlet />
    <Footer />
    <MobileNav />
    <ChatFAB />
  </div>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<MainLayout />}>
          <Route path="/"             element={<HomePage />} />
          <Route path="/listings"     element={<ListingsPage />} />
          <Route path="/property/:id" element={<DetailPage />} />
          <Route path="/saved"        element={<SavedPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
