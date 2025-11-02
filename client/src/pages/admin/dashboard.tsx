import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel, Users, DollarSign, AlertCircle } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";

export default function AdminDashboard() {
  const recentHotels = [
    { id: "1", name: "Grand Hotel", plan: "pro", status: "active", date: "2024-01-10" },
    { id: "2", name: "Ocean View Resort", plan: "basic", status: "active", date: "2024-01-12" },
    { id: "3", name: "Mountain Lodge", plan: "trial", status: "trial", date: "2024-01-14" },
  ];

  const alerts = [
    { id: "1", message: "3 hotels payment failed - requires attention", severity: "high" },
    { id: "2", message: "5 trial periods ending this week", severity: "medium" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Hotels"
          value="38"
          icon={Hotel}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Active Users"
          value="156"
          icon={Users}
        />
        <StatCard
          title="Monthly Revenue"
          value="HTG 83,600"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Trial Hotels"
          value="8"
          icon={AlertCircle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Hotels */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Registered Hotels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover-elevate"
                  data-testid={`hotel-${hotel.id}`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{hotel.name}</p>
                    <p className="text-sm text-muted-foreground">Registered: {hotel.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground capitalize">{hotel.plan}</span>
                    <StatusBadge status={hotel.status} type="hotel" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.severity === 'high'
                      ? 'border-red-500/50 bg-red-50 dark:bg-red-950/20'
                      : 'border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20'
                  }`}
                  data-testid={`alert-${alert.id}`}
                >
                  <p className="text-sm text-foreground">{alert.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
