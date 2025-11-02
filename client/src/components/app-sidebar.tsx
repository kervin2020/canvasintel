import {
  LayoutDashboard,
  Bed,
  Calendar,
  Users,
  UtensilsCrossed,
  FileText,
  Settings,
  Hotel,
  BarChart3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";

const hotelMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Rooms",
    url: "/rooms",
    icon: Bed,
  },
  {
    title: "Reservations",
    url: "/reservations",
    icon: Calendar,
  },
  {
    title: "Guests",
    url: "/guests",
    icon: Users,
  },
  {
    title: "Restaurant",
    url: "/restaurant",
    icon: UtensilsCrossed,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

const superAdminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Hotels",
    url: "/admin/hotels",
    icon: Hotel,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
  },
];

export function AppSidebar({ isSuperAdmin = false }: { isSuperAdmin?: boolean }) {
  const [location] = useLocation();
  const menuItems = isSuperAdmin ? superAdminMenuItems : hotelMenuItems;

  return (
    <Sidebar>
      <SidebarHeader className="h-20 flex items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Hotel className="h-6 w-6 text-sidebar-primary" />
          <div>
            <h2 className="font-semibold text-base text-sidebar-foreground">
              {isSuperAdmin ? "Super Admin" : "Hotel Manager"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isSuperAdmin ? "Platform Management" : "Management System"}
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-6 py-2">
            {isSuperAdmin ? "Platform" : "Main Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase()}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-accent-foreground">
              HM
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              Hotel Manager
            </p>
            <p className="text-xs text-muted-foreground truncate">
              manager@hotel.com
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
