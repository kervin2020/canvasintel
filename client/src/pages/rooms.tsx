import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { useToast } from "@/hooks/use-toast";

export default function Rooms() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: "",
    type: "single",
    pricePerNight: "",
    capacity: "1",
    status: "available",
    notes: "",
  });

  // Mock data
  const rooms = [
    { id: "1", roomNumber: "101", type: "Single", pricePerNight: "1500", capacity: 1, status: "available" },
    { id: "2", roomNumber: "102", type: "Double", pricePerNight: "2500", capacity: 2, status: "occupied" },
    { id: "3", roomNumber: "201", type: "Suite", pricePerNight: "5000", capacity: 4, status: "cleaning" },
    { id: "4", roomNumber: "202", type: "Double", pricePerNight: "2500", capacity: 2, status: "available" },
    { id: "5", roomNumber: "301", type: "Single", pricePerNight: "1500", capacity: 1, status: "maintenance" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Room created",
      description: `Room ${formData.roomNumber} has been added successfully.`,
    });
    setIsDialogOpen(false);
    setFormData({
      roomNumber: "",
      type: "single",
      pricePerNight: "",
      capacity: "1",
      status: "available",
      notes: "",
    });
  };

  const filteredRooms = rooms.filter(room =>
    room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Rooms</h1>
          <p className="text-muted-foreground">Manage your hotel rooms and pricing</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12" data-testid="button-add-room">
              <Plus className="h-5 w-5 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new room to your hotel
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomNumber">Room Number *</Label>
                    <Input
                      id="roomNumber"
                      placeholder="101"
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      required
                      data-testid="input-room-number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Room Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger data-testid="select-room-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="double">Double</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                        <SelectItem value="deluxe">Deluxe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerNight">Price per Night (HTG) *</Label>
                    <Input
                      id="pricePerNight"
                      type="number"
                      placeholder="1500"
                      value={formData.pricePerNight}
                      onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                      required
                      data-testid="input-price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity *</Label>
                    <Select
                      value={formData.capacity}
                      onValueChange={(value) => setFormData({ ...formData, capacity: value })}
                    >
                      <SelectTrigger data-testid="select-capacity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Person</SelectItem>
                        <SelectItem value="2">2 People</SelectItem>
                        <SelectItem value="3">3 People</SelectItem>
                        <SelectItem value="4">4 People</SelectItem>
                        <SelectItem value="5">5+ People</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information about this room..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    data-testid="input-notes"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-save-room">
                  Save Room
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by room number or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
          data-testid="input-search"
        />
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="hover-elevate" data-testid={`room-card-${room.id}`}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-1">Room {room.roomNumber}</CardTitle>
                  <p className="text-sm text-muted-foreground">{room.type}</p>
                </div>
                <StatusBadge status={room.status} type="room" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price per night:</span>
                  <span className="font-mono font-semibold">HTG {room.pricePerNight}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="font-medium">{room.capacity} {room.capacity === 1 ? 'Person' : 'People'}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" data-testid={`button-edit-${room.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" data-testid={`button-delete-${room.id}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <Card className="py-12">
          <CardContent>
            <div className="text-center">
              <p className="text-muted-foreground">No rooms found matching your search.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
