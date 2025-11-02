import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MoreVertical } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminHotels() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const hotels = [
    {
      id: "1",
      name: "Grand Hotel",
      email: "contact@grandhotel.ht",
      phone: "+509 1234 5678",
      plan: "pro",
      status: "active",
      rooms: 25,
      revenue: "425,680",
    },
    {
      id: "2",
      name: "Ocean View Resort",
      email: "info@oceanview.ht",
      phone: "+509 2345 6789",
      plan: "basic",
      status: "active",
      rooms: 15,
      revenue: "185,200",
    },
    {
      id: "3",
      name: "Mountain Lodge",
      email: "hello@mountainlodge.ht",
      phone: "+509 3456 7890",
      plan: "trial",
      status: "trial",
      rooms: 10,
      revenue: "0",
    },
  ];

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Hotels</h1>
        <p className="text-muted-foreground">Manage all hotels on the platform</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search hotels by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
          data-testid="input-search"
        />
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHotels.map((hotel) => (
          <Card key={hotel.id} className="hover-elevate" data-testid={`hotel-card-${hotel.id}`}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl mb-1 truncate">{hotel.name}</CardTitle>
                  <p className="text-sm text-muted-foreground truncate">{hotel.email}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" data-testid={`button-menu-${hotel.id}`}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Suspend</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <StatusBadge status={hotel.status} type="hotel" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan:</span>
                <span className="text-sm font-medium text-foreground capitalize">{hotel.plan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rooms:</span>
                <span className="text-sm font-medium text-foreground">{hotel.rooms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Monthly Revenue:</span>
                <span className="text-sm font-mono font-semibold text-foreground">HTG {hotel.revenue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Contact:</span>
                <span className="text-sm text-muted-foreground">{hotel.phone}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <Card className="py-12">
          <CardContent>
            <div className="text-center">
              <p className="text-muted-foreground">No hotels found matching your search.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
