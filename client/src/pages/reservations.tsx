import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Calendar as CalendarIcon } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Reservations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("list");

  // Mock data
  const reservations = [
    {
      id: "1",
      guest: "Jean Baptiste",
      room: "101",
      checkIn: "2024-01-15",
      checkOut: "2024-01-18",
      status: "confirmed",
      amount: "4500",
    },
    {
      id: "2",
      guest: "Marie Claire Dubois",
      room: "205",
      checkIn: "2024-01-16",
      checkOut: "2024-01-20",
      status: "pending",
      amount: "10000",
    },
    {
      id: "3",
      guest: "Pierre Louis",
      room: "103",
      checkIn: "2024-01-15",
      checkOut: "2024-01-17",
      status: "checked_in",
      amount: "3000",
    },
    {
      id: "4",
      guest: "Sophie Martin",
      room: "301",
      checkIn: "2024-01-14",
      checkOut: "2024-01-15",
      status: "checked_out",
      amount: "1500",
    },
  ];

  const filteredReservations = reservations.filter(res =>
    res.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.room.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Reservations</h1>
          <p className="text-muted-foreground">Manage bookings and check-ins/check-outs</p>
        </div>
        <Button className="h-12" data-testid="button-new-reservation">
          <Plus className="h-5 w-5 mr-2" />
          New Reservation
        </Button>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by guest name or room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
            data-testid="input-search"
          />
        </div>
        <Tabs value={view} onValueChange={setView} className="w-fit">
          <TabsList>
            <TabsTrigger value="list" data-testid="tab-list">List View</TabsTrigger>
            <TabsTrigger value="calendar" data-testid="tab-calendar">Calendar View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Reservations List */}
      <TabsContent value="list" className="mt-0">
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <Card key={reservation.id} className="hover-elevate" data-testid={`reservation-${reservation.id}`}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2">
                    <p className="font-semibold text-foreground mb-1">{reservation.guest}</p>
                    <p className="text-sm text-muted-foreground">Room {reservation.room}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-foreground">{reservation.checkIn}</p>
                      <p className="text-muted-foreground text-xs">Check-in</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-foreground">{reservation.checkOut}</p>
                      <p className="text-muted-foreground text-xs">Check-out</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-mono font-semibold text-foreground">HTG {reservation.amount}</p>
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-3">
                    <StatusBadge status={reservation.status} type="reservation" />
                    <Button variant="outline" size="sm" data-testid={`button-view-${reservation.id}`}>
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* Calendar View */}
      <TabsContent value="calendar" className="mt-0">
        <Card className="p-8">
          <div className="text-center space-y-4">
            <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Calendar View</h3>
              <p className="text-muted-foreground">
                Interactive calendar view will be implemented here showing all reservations
              </p>
            </div>
          </div>
        </Card>
      </TabsContent>

      {filteredReservations.length === 0 && view === "list" && (
        <Card className="py-12">
          <CardContent>
            <div className="text-center">
              <p className="text-muted-foreground">No reservations found matching your search.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
