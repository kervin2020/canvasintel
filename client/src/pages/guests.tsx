import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Search, Mail, Phone, User, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Guests() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    idCard: "",
  });

  // Mock data
  const guests = [
    {
      id: "1",
      name: "Jean Baptiste",
      email: "jean.baptiste@email.com",
      phone: "+509 1234 5678",
      totalStays: 5,
      totalSpent: "22500",
    },
    {
      id: "2",
      name: "Marie Claire Dubois",
      email: "marie.claire@email.com",
      phone: "+509 2345 6789",
      totalStays: 3,
      totalSpent: "15000",
    },
    {
      id: "3",
      name: "Pierre Louis",
      email: "pierre.louis@email.com",
      phone: "+509 3456 7890",
      totalStays: 8,
      totalSpent: "35000",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Guest added",
      description: `${formData.name} has been added to your guest list.`,
    });
    setIsDialogOpen(false);
    setFormData({ name: "", email: "", phone: "", idCard: "" });
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Guests</h1>
          <p className="text-muted-foreground">Manage guest profiles and booking history</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12" data-testid="button-add-guest">
              <Plus className="h-5 w-5 mr-2" />
              Add Guest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Add New Guest</DialogTitle>
              <DialogDescription>
                Enter guest information for their profile
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Jean Baptiste"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="guest@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+509 1234 5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    data-testid="input-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idCard">ID Card Number</Label>
                  <Input
                    id="idCard"
                    placeholder="ID123456"
                    value={formData.idCard}
                    onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                    data-testid="input-id-card"
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
                <Button type="submit" data-testid="button-save-guest">
                  Save Guest
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
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
          data-testid="input-search"
        />
      </div>

      {/* Guests List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGuests.map((guest) => (
          <Card key={guest.id} className="hover-elevate" data-testid={`guest-card-${guest.id}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-foreground mb-3">{guest.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground truncate">{guest.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">{guest.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {guest.totalStays} stays • HTG {guest.totalSpent} total spent
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" data-testid={`button-view-${guest.id}`}>
                      View History
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGuests.length === 0 && (
        <Card className="py-12">
          <CardContent>
            <div className="text-center">
              <p className="text-muted-foreground">No guests found matching your search.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
