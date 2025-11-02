import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Users, Bed, UtensilsCrossed } from "lucide-react";
import { StatCard } from "@/components/stat-card";

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">View insights and export reports for your hotel</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="month">
            <SelectTrigger className="w-40" data-testid="select-period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="HTG 425,680"
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Guests"
          value="342"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Room Revenue"
          value="HTG 310,420"
          icon={Bed}
        />
        <StatCard
          title="Restaurant Revenue"
          value="HTG 115,260"
          icon={UtensilsCrossed}
        />
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="occupancy" className="space-y-6">
        <TabsList>
          <TabsTrigger value="occupancy" data-testid="tab-occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="revenue" data-testid="tab-revenue">Revenue</TabsTrigger>
          <TabsTrigger value="restaurant" data-testid="tab-restaurant">Restaurant</TabsTrigger>
        </TabsList>

        <TabsContent value="occupancy" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground">Chart: Occupancy rate over time</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Room Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground">Chart: Room status breakdown</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Occupancy Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Average Occupancy</p>
                  <p className="text-2xl font-bold text-foreground">75%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Peak Occupancy</p>
                  <p className="text-2xl font-bold text-foreground">95%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold text-foreground">156</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Stay Duration</p>
                  <p className="text-2xl font-bold text-foreground">3.2 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground">Chart: Revenue by source (Rooms vs Restaurant)</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-mono font-bold text-foreground">HTG 425,680</p>
                <p className="text-sm text-green-600 mt-1">↑ 12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Avg. Revenue per Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-mono font-bold text-foreground">HTG 2,730</p>
                <p className="text-sm text-muted-foreground mt-1">Based on 156 bookings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-mono font-bold text-foreground">94%</p>
                <p className="text-sm text-muted-foreground mt-1">HTG 25,000 pending</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="restaurant" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground">Chart: Sales by menu category</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Griot with Rice", sales: "156", revenue: "54,600" },
                    { name: "Tassot Cabrit", sales: "128", revenue: "51,200" },
                    { name: "Legume Haitien", sales: "98", revenue: "29,400" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.sales} orders</p>
                      </div>
                      <p className="font-mono font-semibold text-foreground">HTG {item.revenue}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Items</p>
                  <p className="text-2xl font-bold text-foreground">24</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Low Stock Items</p>
                  <p className="text-2xl font-bold text-yellow-600">3</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-foreground">HTG 45,200</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">This Month Purchases</p>
                  <p className="text-2xl font-bold text-foreground">HTG 32,500</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
