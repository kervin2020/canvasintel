import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Rooms from "@/pages/rooms";
import Reservations from "@/pages/reservations";
import Guests from "@/pages/guests";
import Restaurant from "@/pages/restaurant";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminHotels from "@/pages/admin/hotels";
import AdminAnalytics from "@/pages/admin/analytics";

function AppContent() {
  const [location, setLocation] = useLocation();
  // const { isAuthenticated, user } = useAuth();

  // Check if we're on an auth page (login or register)
  const isAuthPage = location === "/login" || location === "/register";

  // Check if we're on an admin page
  const isAdminPage = location.startsWith("/admin");

  // Redirect to login if not authenticated and not on auth page
  // if (!isAuthenticated && !isAuthPage) {
  //   setLocation("/login");
  //   return null;
  // }

  // // Redirect super admin to admin dashboard
  // if (isAuthenticated && user?.role === "super_admin" && !isAdminPage && location === "/") {
  //   setLocation("/admin");
  //   return null;
  // }

  // if (isAuthPage) {
  //   // If already authenticated, redirect to appropriate dashboard
  //   if (isAuthenticated) {
  //     if (user?.role === "super_admin") {
  //       setLocation("/admin");
  //     } else {
  //       setLocation("/");
  //     }
  //     return null;
  //   }

  //   // Render auth pages without sidebar
  //   return (
  //     <Switch>
  //       <Route path="/login" component={Login} />
  //       <Route path="/register" component={Register} />
  //     </Switch>
  //   );
  // }

  // Custom sidebar width for hotel application
  const style = {
    "--sidebar-width": "16rem",       // 256px for better navigation
    "--sidebar-width-icon": "3rem",   // default icon width
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar isSuperAdmin={isAdminPage} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {isAdminPage ? "Platform Management" : "Hotel Management"}
                </h2>
              </div>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto bg-background">
            <div className="max-w-7xl mx-auto p-6 lg:p-8">
              <Switch>
                {/* Hotel Pages */}
                <Route path="/" component={Dashboard} />
                <Route path="/rooms" component={Rooms} />
                <Route path="/reservations" component={Reservations} />
                <Route path="/guests" component={Guests} />
                <Route path="/restaurant" component={Restaurant} />
                <Route path="/reports" component={Reports} />
                <Route path="/settings" component={Settings} />

                {/* Super Admin Pages */}
                <Route path="/admin" component={AdminDashboard} />
                <Route path="/admin/hotels" component={AdminHotels} />
                <Route path="/admin/analytics" component={AdminAnalytics} />

                {/* Fallback to 404 */}
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
