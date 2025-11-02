import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Percent, 
  UserCheck, 
  DollarSign, 
  UtensilsCrossed,
  Plus,
  AlertCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";

export default function Dashboard() {
  // Mock data
  const stats = {
    occupancy: "75%",
    todayCheckins: 8,
    monthlyRevenue: "45,250",
    restaurantSales: "12,340",
  };

  const recentReservations = [
    { id: "1", guest: "Jean Baptiste", room: "101", checkIn: "2024-01-15", status: "confirmed" },
    { id: "2", guest: "Marie Claire", room: "205", checkIn: "2024-01-15", status: "pending" },
    { id: "3", guest: "Pierre Louis", room: "103", checkIn: "2024-01-16", status: "confirmed" },
  ];

  const alerts = [
    { id: "1", type: "warning", message: "Low stock: Coffee beans (5 kg remaining)", time: "2h ago" },
    { id: "2", type: "info", message: "Room 203 maintenance scheduled for tomorrow", time: "5h ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Occupancy Rate"
          value={stats.occupancy}
          icon={Percent}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Today's Check-ins"
          value={stats.todayCheckins}
          icon={UserCheck}
        />
        <StatCard
          title="Revenue MTD"
          value={`HTG ${stats.monthlyRevenue}`}
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Restaurant Sales"
          value={`HTG ${stats.restaurantSales}`}
          icon={UtensilsCrossed}
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button className="h-12" data-testid="button-new-reservation">
              <Plus className="h-5 w-5 mr-2" />
              New Reservation
            </Button>
            <Button variant="outline" className="h-12" data-testid="button-check-in">
              <UserCheck className="h-5 w-5 mr-2" />
              Check-in Guest
            </Button>
            <Button variant="outline" className="h-12" data-testid="button-view-reports">
              <CalendarIcon className="h-5 w-5 mr-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Today's Arrivals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover-elevate"
                  data-testid={`reservation-${reservation.id}`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{reservation.guest}</p>
                    <p className="text-sm text-muted-foreground">Room {reservation.room}</p>
                  </div>
                  <StatusBadge status={reservation.status} type="reservation" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-lg border border-border"
                  data-testid={`alert-${alert.id}`}
                >
                  <p className="text-sm text-foreground mb-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
