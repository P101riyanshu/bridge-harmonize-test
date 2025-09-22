import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import LoginForm from "@/components/LoginForm";
import Dashboard from "@/pages/Dashboard";
import SubmitGrievance from "@/pages/SubmitGrievance";
import GrievancesPage from "@/pages/GrievancesPage";
import Profile from "@/pages/Profile";
import AdminAnalytics from "@/pages/AdminAnalytics";
import AdminGrievances from "@/pages/AdminGrievances";
import AdminSettings from "@/pages/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <LoginForm onSuccess={() => window.location.reload()} />;
  }
  
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginForm onSuccess={() => window.location.reload()} />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginForm onSuccess={() => window.location.reload()} />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/submit" element={
        <ProtectedRoute>
          <SubmitGrievance />
        </ProtectedRoute>
      } />
      <Route path="/grievances" element={
        <ProtectedRoute>
          <GrievancesPage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute>
          <AdminAnalytics />
        </ProtectedRoute>
      } />
      <Route path="/admin/grievances" element={
        <ProtectedRoute>
          <AdminGrievances />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute>
          <AdminSettings />
        </ProtectedRoute>
      } />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
