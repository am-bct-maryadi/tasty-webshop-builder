import { CustomerAuthProvider } from '@/contexts/CustomerAuthContext';
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Index from "./pages/Index";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import { CustomerDashboard } from "./pages/CustomerDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <AdminProvider>
              <CustomerAuthProvider>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/admin/*" element={<AdminPanel />} />
                    <Route path="/customer/*" element={<CustomerDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Toaster />
                <Sonner />
              </CustomerAuthProvider>
            </AdminProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;