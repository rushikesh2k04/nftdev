import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from './context/WalletContext';
import Header from './components/Header';

// Lazy load pages
const Marketplace = React.lazy(() => import('./pages/Marketplace'));
const Profile = React.lazy(() => import('./pages/Profile'));
const MedicalServices = React.lazy(() => import('./pages/MedicalServices'));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <React.Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Marketplace />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/medical-services" element={<MedicalServices />} />
                </Routes>
              </React.Suspense>
            </main>
          </div>
        </Router>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;