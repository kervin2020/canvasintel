import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your hotel and account settings</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="hotel" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hotel" data-testid="tab-hotel">Hotel Info</TabsTrigger>
          <TabsTrigger value="preferences" data-testid="tab-preferences">Preferences</TabsTrigger>
          <TabsTrigger value="team" data-testid="tab-team">Team</TabsTrigger>
          <TabsTrigger value="billing" data-testid="tab-billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="hotel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Information</CardTitle>
              <CardDescription>Update your hotel's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotelName">Hotel Name</Label>
                  <Input id="hotelName" defaultValue="Grand Hotel" data-testid="input-hotel-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="contact@grandhotel.ht" data-testid="input-email" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" defaultValue="+509 1234 5678" data-testid="input-phone" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="HTG">
                    <SelectTrigger data-testid="select-currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HTG">HTG - Haitian Gourde</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Main Street, Port-au-Prince" data-testid="input-address" />
              </div>
              <Button onClick={handleSave} data-testid="button-save-hotel">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>Customize how you view your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Theme</p>
                  <p className="text-sm text-muted-foreground">Choose light or dark mode</p>
                </div>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium text-foreground">Language</p>
                  <p className="text-sm text-muted-foreground">Select your preferred language</p>
                </div>
                <Select defaultValue="en">
                  <SelectTrigger className="w-40" data-testid="select-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ht">Kreyòl</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium text-foreground">Date Format</p>
                  <p className="text-sm text-muted-foreground">How dates are displayed</p>
                </div>
                <Select defaultValue="dmy">
                  <SelectTrigger className="w-40" data-testid="select-date-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} data-testid="button-save-preferences">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your hotel staff and their roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Marie Claire", email: "marie@grandhotel.ht", role: "Receptionist" },
                { name: "Pierre Louis", email: "pierre@grandhotel.ht", role: "Chef" },
                { name: "Sophie Martin", email: "sophie@grandhotel.ht", role: "Housekeeping" },
              ].map((member, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{member.role}</span>
                    <Button variant="outline" size="sm" data-testid={`button-edit-member-${index}`}>
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline" data-testid="button-invite-member">
                <Plus className="h-4 w-4 mr-2" />
                Invite Team Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-foreground">Pro Plan</p>
                    <p className="text-muted-foreground">HTG 2,200 / month</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    Active
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">✓ Unlimited rooms</p>
                  <p className="text-muted-foreground">✓ Restaurant management</p>
                  <p className="text-muted-foreground">✓ Advanced reports</p>
                  <p className="text-muted-foreground">✓ Priority support</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" data-testid="button-change-plan">Change Plan</Button>
                <Button variant="outline" data-testid="button-billing-history">View Billing History</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Plus } from "lucide-react";
