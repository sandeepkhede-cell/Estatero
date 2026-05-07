import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthModalProvider } from './context/AuthModalContext';
import { FavouritesProvider } from './context/FavouritesContext';
import AuthModal from './components/ui/AuthModal';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import DetailPage from './pages/DetailPage';
import SavedPage from './pages/SavedPage';
import AuthPage from './pages/AuthPage';
import PostPropertyPage from './pages/PostPropertyPage';
import ProfilePage from './pages/ProfilePage';
import AgentProfilePage from './pages/AgentProfilePage';
import AgentsPage from './pages/AgentsPage';

const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <Outlet />
    <Footer />
    <MobileNav />
  </div>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <FavouritesProvider>
      <AuthModalProvider>
        <AuthModal />
        <Routes>
          <Route path="/auth"          element={<AuthPage />} />
          <Route path="/post-property" element={<PostPropertyPage />} />
          <Route element={<MainLayout />}>
            <Route path="/"             element={<HomePage />} />
            <Route path="/listings"       element={<ListingsPage />} />
            <Route path="/property/:id"   element={<DetailPage />} />
            <Route path="/saved"          element={<SavedPage />} />
            <Route path="/profile"        element={<ProfilePage />} />
            <Route path="/agents"          element={<AgentsPage />} />
            <Route path="/agent/:id"      element={<AgentProfilePage />} />
          </Route>
        </Routes>
      </AuthModalProvider>
      </FavouritesProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
