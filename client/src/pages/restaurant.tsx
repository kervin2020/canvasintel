import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus, Search, AlertTriangle, Edit, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Restaurant() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);

  // Mock data
  const menuItems = [
    { id: "1", name: "Griot with Rice", category: "Main Course", price: "350", available: true },
    { id: "2", name: "Tassot Cabrit", category: "Main Course", price: "400", available: true },
    { id: "3", name: "Legume Haitien", category: "Main Course", price: "300", available: true },
    { id: "4", name: "Fresh Mango Juice", category: "Beverage", price: "80", available: true },
  ];

  const inventoryItems = [
    { id: "1", name: "Rice", category: "Grains", currentStock: "25", threshold: "10", unit: "kg", status: "ok" },
    { id: "2", name: "Coffee Beans", category: "Beverage", currentStock: "5", threshold: "10", unit: "kg", status: "low" },
    { id: "3", name: "Cooking Oil", category: "Cooking", currentStock: "8", threshold: "15", unit: "liters", status: "low" },
    { id: "4", name: "Chicken", category: "Meat", currentStock: "15", threshold: "10", unit: "kg", status: "ok" },
  ];

  const recentSales = [
    { id: "1", item: "Griot with Rice", quantity: "2", total: "700", room: "101", time: "2h ago" },
    { id: "2", item: "Fresh Mango Juice", quantity: "3", total: "240", room: null, time: "3h ago" },
    { id: "3", item: "Tassot Cabrit", quantity: "1", total: "400", room: "205", time: "4h ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Restaurant Management</h1>
        <p className="text-muted-foreground">Manage your restaurant menu, inventory, and sales</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="menu" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit">
          <TabsTrigger value="menu" data-testid="tab-menu">Menu</TabsTrigger>
          <TabsTrigger value="inventory" data-testid="tab-inventory">Inventory</TabsTrigger>
          <TabsTrigger value="pos" data-testid="tab-pos">POS</TabsTrigger>
          <TabsTrigger value="reports" data-testid="tab-reports">Reports</TabsTrigger>
        </TabsList>

        {/* Menu Tab */}
        <TabsContent value="menu" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
                data-testid="input-search-menu"
              />
            </div>
            <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-12" data-testid="button-add-menu-item">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Menu Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Menu Item</DialogTitle>
                  <DialogDescription>Create a new item for your menu</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemName">Item Name *</Label>
                    <Input id="itemName" placeholder="Griot with Rice" data-testid="input-item-name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appetizer">Appetizer</SelectItem>
                          <SelectItem value="main">Main Course</SelectItem>
                          <SelectItem value="dessert">Dessert</SelectItem>
                          <SelectItem value="beverage">Beverage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (HTG) *</Label>
                      <Input id="price" type="number" placeholder="350" data-testid="input-price" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsMenuDialogOpen(false)}>Cancel</Button>
                  <Button data-testid="button-save-menu-item">Save Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Card key={item.id} className="hover-elevate" data-testid={`menu-item-${item.id}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-2xl font-mono font-bold text-foreground">HTG {item.price}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`button-edit-${item.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant={item.available ? "outline" : "default"}
                      size="sm"
                      data-testid={`button-toggle-${item.id}`}
                    >
                      {item.available ? "Available" : "Unavailable"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                className="pl-10 h-12"
                data-testid="input-search-inventory"
              />
            </div>
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-12" data-testid="button-add-product">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Inventory Product</DialogTitle>
                  <DialogDescription>Add a new product to track in inventory</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input id="productName" placeholder="Coffee Beans" data-testid="input-product-name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Current Stock *</Label>
                      <Input id="stock" type="number" placeholder="25" data-testid="input-stock" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit *</Label>
                      <Select>
                        <SelectTrigger data-testid="select-unit">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          <SelectItem value="liters">Liters</SelectItem>
                          <SelectItem value="pieces">Pieces</SelectItem>
                          <SelectItem value="bottles">Bottles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Alert Threshold *</Label>
                    <Input id="threshold" type="number" placeholder="10" data-testid="input-threshold" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>Cancel</Button>
                  <Button data-testid="button-save-product">Save Product</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {inventoryItems.map((item) => (
              <Card
                key={item.id}
                className={`hover-elevate ${item.status === 'low' ? 'border-yellow-500/50' : ''}`}
                data-testid={`inventory-item-${item.id}`}
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2">
                        {item.status === 'low' && (
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-mono font-bold text-foreground">{item.currentStock}</p>
                      <p className="text-xs text-muted-foreground">{item.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Alert at: {item.threshold} {item.unit}</p>
                      {item.status === 'low' && (
                        <p className="text-sm font-medium text-yellow-600">Low stock!</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid={`button-restock-${item.id}`}>
                        Restock
                      </Button>
                      <Button variant="outline" size="sm" data-testid={`button-edit-inventory-${item.id}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* POS Tab */}
        <TabsContent value="pos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {menuItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="outline"
                      className="h-24 flex flex-col items-start justify-between p-4"
                      data-testid={`pos-item-${item.id}`}
                    >
                      <span className="font-medium text-sm">{item.name}</span>
                      <span className="font-mono font-semibold">HTG {item.price}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Link to Room (Optional)</Label>
                  <Select>
                    <SelectTrigger data-testid="select-room-charge">
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="101">Room 101</SelectItem>
                      <SelectItem value="102">Room 102</SelectItem>
                      <SelectItem value="201">Room 201</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">No items added yet</p>
                </div>
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="font-mono">HTG 0</span>
                  </div>
                </div>
                <Button className="w-full h-12" data-testid="button-complete-sale">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Complete Sale
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Today's Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-mono font-bold text-foreground">HTG 12,340</p>
                <p className="text-sm text-muted-foreground mt-1">42 transactions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-mono font-bold text-foreground">HTG 185,600</p>
                <p className="text-sm text-green-600 mt-1">↑ 15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Item</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-foreground">Griot with Rice</p>
                <p className="text-sm text-muted-foreground mt-1">156 orders this month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                    data-testid={`sale-${sale.id}`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{sale.item}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {sale.quantity} • {sale.room ? `Room ${sale.room}` : 'Walk-in'} • {sale.time}
                      </p>
                    </div>
                    <p className="font-mono font-semibold text-foreground">HTG {sale.total}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
