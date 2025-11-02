import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { Hotel, Users, DollarSign, TrendingUp } from "lucide-react";

export default function AdminAnalytics() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Platform Analytics</h1>
        <p className="text-muted-foreground">Overview of platform performance and metrics</p>
      </div>

      {/* Key Metrics */}
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
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="MRR"
          value="HTG 83,600"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Growth Rate"
          value="15%"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">Chart: MRR growth over time</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hotel Distribution by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">Chart: Hotels by subscription plan</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Trial</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">8</p>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">Hotels</p>
            </div>
            <div className="p-6 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
              <p className="text-sm font-medium text-green-900 dark:text-green-300 mb-2">Basic</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">15</p>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">HTG 12,000/mo</p>
            </div>
            <div className="p-6 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900">
              <p className="text-sm font-medium text-purple-900 dark:text-purple-300 mb-2">Pro</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">15</p>
              <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">HTG 33,000/mo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { hotel: "Grand Hotel", action: "Upgraded to Pro plan", time: "2 hours ago" },
              { hotel: "Ocean View Resort", action: "New hotel registered", time: "5 hours ago" },
              { hotel: "Mountain Lodge", action: "Started trial", time: "1 day ago" },
              { hotel: "Sunset Beach Hotel", action: "Payment received", time: "2 days ago" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-border"
                data-testid={`activity-${index}`}
              >
                <div>
                  <p className="font-medium text-foreground">{activity.hotel}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
