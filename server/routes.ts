import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateToken, authenticateToken, requireRole } from "./auth";
import {
  insertHotelSchema, insertUserSchema, insertRoomSchema,
  insertReservationSchema, insertGuestSchema, insertPaymentSchema,
  insertInvoiceSchema, insertProductSchema, insertSaleSchema,
  insertPurchaseSchema, insertSupplierSchema,
} from "@shared/schema";
import { ZodError } from "zod";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Error handling middleware
  const handleValidationError = (error: any, res: any) => {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error("Error:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  };

  // ============== Authentication Routes ==============
  
  // Register a new hotel
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { hotelName, email, password, phone, address, currency = "HTG" } = req.body;
      
      // Check if hotel already exists
      const existingHotel = await storage.getHotelByEmail(email);
      if (existingHotel) {
        return res.status(400).json({ message: "Hotel with this email already exists" });
      }

      // Create hotel
      const hotel = await storage.createHotel({
        name: hotelName,
        email,
        phone,
        address,
        currency,
        plan: "trial",
        status: "trial",
      });

      // Create owner user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        hotelId: hotel.id,
        name: hotelName,
        email,
        password: hashedPassword,
        role: "owner",
        active: true,
      });

      res.status(201).json({ 
        message: "Hotel registered successfully",
        hotel: { id: hotel.id, name: hotel.name },
        user: { id: user.id, email: user.email, role: user.role }
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Get hotel info
      const hotel = user.hotelId ? await storage.getHotel(user.hotelId) : null;

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        hotelId: user.hotelId,
      });

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          hotelId: user.hotelId,
        },
        hotel: hotel ? {
          id: hotel.id,
          name: hotel.name,
          currency: hotel.currency,
          plan: hotel.plan,
        } : null,
        token,
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // ============== Hotel Routes ==============
  
  app.get("/api/hotels/:id", async (req, res) => {
    try {
      const hotel = await storage.getHotel(req.params.id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.json(hotel);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.patch("/api/hotels/:id", async (req, res) => {
    try {
      const hotel = await storage.updateHotel(req.params.id, req.body);
      res.json(hotel);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // ============== Room Routes ==============
  
  app.get("/api/hotels/:hotelId/rooms", async (req, res) => {
    try {
      const rooms = await storage.getRoomsByHotel(req.params.hotelId);
      res.json(rooms);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.get("/api/rooms/:id", async (req, res) => {
    try {
      const room = await storage.getRoom(req.params.id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.post("/api/hotels/:hotelId/rooms", async (req, res) => {
    try {
      const validated = insertRoomSchema.parse({
        ...req.body,
        hotelId: req.params.hotelId,
      });
      const room = await storage.createRoom(validated);
      res.status(201).json(room);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.patch("/api/rooms/:id", async (req, res) => {
    try {
      const room = await storage.updateRoom(req.params.id, req.body);
      res.json(room);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.delete("/api/rooms/:id", async (req, res) => {
    try {
      await storage.deleteRoom(req.params.id);
      res.status(204).send();
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // ============== Reservation Routes ==============
  
  app.get("/api/hotels/:hotelId/reservations", async (req, res) => {
    try {
      const reservations = await storage.getReservationsByHotel(req.params.hotelId);
      res.json(reservations);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.get("/api/reservations/:id", async (req, res) => {
    try {
      const reservation = await storage.getReservation(req.params.id);
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      res.json(reservation);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.post("/api/hotels/:hotelId/reservations", async (req, res) => {
    try {
      const { roomId, checkIn, checkOut } = req.body;
      
      // Check for double booking
      const existingReservations = await storage.getReservationsByRoom(
        roomId,
        new Date(checkIn),
        new Date(checkOut)
      );
      
      const hasConflict = existingReservations.some(r => 
        r.status !== "cancelled" && r.status !== "checked_out"
      );
      
      if (hasConflict) {
        return res.status(400).json({ 
          message: "Room is already booked for these dates" 
        });
      }

      const validated = insertReservationSchema.parse({
        ...req.body,
        hotelId: req.params.hotelId,
      });
      const reservation = await storage.createReservation(validated);
      res.status(201).json(reservation);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.patch("/api/reservations/:id", async (req, res) => {
    try {
      const reservation = await storage.updateReservation(req.params.id, req.body);
      res.json(reservation);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.delete("/api/reservations/:id", async (req, res) => {
    try {
      await storage.deleteReservation(req.params.id);
      res.status(204).send();
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // ============== Guest Routes ==============
  
  app.get("/api/hotels/:hotelId/guests", async (req, res) => {
    try {
      const guests = await storage.getGuestsByHotel(req.params.hotelId);
      res.json(guests);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.get("/api/guests/:id", async (req, res) => {
    try {
      const guest = await storage.getGuest(req.params.id);
      if (!guest) {
        return res.status(404).json({ message: "Guest not found" });
      }
      res.json(guest);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.post("/api/hotels/:hotelId/guests", async (req, res) => {
    try {
      const validated = insertGuestSchema.parse({
        ...req.body,
        hotelId: req.params.hotelId,
      });
      const guest = await storage.createGuest(validated);
      res.status(201).json(guest);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.patch("/api/guests/:id", async (req, res) => {
    try {
      const guest = await storage.updateGuest(req.params.id, req.body);
      res.json(guest);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // ============== Payment Routes ==============
  
  app.get("/api/hotels/:hotelId/payments", async (req, res) => {
    try {
      const payments = await storage.getPaymentsByHotel(req.params.hotelId);
      res.json(payments);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.post("/api/hotels/:hotelId/payments", async (req, res) => {
    try {
      const validated = insertPaymentSchema.parse({
        ...req.body,
        hotelId: req.params.hotelId,
      });
      const payment = await storage.createPayment(validated);
      res.status(201).json(payment);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.patch("/api/payments/:id", async (req, res) => {
    try {
      const payment = await storage.updatePayment(req.params.id, req.body);
      res.json(payment);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // ============== Invoice Routes ==============
  
  app.get("/api/hotels/:hotelId/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoicesByHotel(req.params.hotelId);
      res.json(invoices);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.post("/api/hotels/:hotelId/invoices", async (req, res) => {
    try {
      const validated = insertInvoiceSchema.parse({
        ...req.body,
        hotelId: req.params.hotelId,
        invoiceNumber: `INV-${Date.now()}`, // Generate invoice number
      });
      const invoice = await storage.createInvoice(validated);
      res.status(201).json(invoice);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // ============== Restaurant Product Routes ==============
  
  app.get("/api/hotels/:hotelId/products", async (req, res) => {
    try {
      const products = await storage.getProductsByHotel(req.params.hotelId);
      res.json(products);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.get("/api/hotels/:hotelId/products/low-stock", async (req, res) => {
    try {
      const products = await storage.getLowStockProducts(req.params.hotelId);
      res.json(products);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.post("/api/hotels/:hotelId/products", async (req, res) => {
    try {
      const validated = insertProductSchema.parse({
        ...req.body,
        hotelId: req.params.hotelId,
      });
      const product = await storage.createProduct(validated);
      res.status(201).json(product);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // ============== Sales Routes ==============
  
  app.get("/api/hotels/:hotelId/sales", async (req, res) => {
    try {
      const sales = await storage.getSalesByHotel(req.params.hotelId);
      res.json(sales);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.get("/api/employees/:employeeId/sales", async (req, res) => {
    try {
      const sales = await storage.getSalesByEmployee(req.params.employeeId);
      res.json(sales);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.post("/api/hotels/:hotelId/sales", async (req, res) => {
    try {
      const validated = insertSaleSchema.parse({
        ...req.body,
        hotelId: req.params.hotelId,
      });
      
      // Update product stock
      const product = await storage.getProduct(validated.productId);
      if (product) {
        const newStock = Number(product.currentStock) - Number(validated.quantity);
        await storage.updateProduct(validated.productId, {
          currentStock: newStock.toString(),
        });
      }
      
      const sale = await storage.createSale(validated);
      res.status(201).json(sale);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // ============== Purchase Routes ==============
  
  app.get("/api/hotels/:hotelId/purchases", async (req, res) => {
    try {
      const purchases = await storage.getPurchasesByHotel(req.params.hotelId);
      res.json(purchases);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.post("/api/hotels/:hotelId/purchases", async (req, res) => {
    try {
      const validated = insertPurchaseSchema.parse({
        ...req.body,
        hotelId: req.params.hotelId,
      });
      
      // Update product stock
      const product = await storage.getProduct(validated.productId);
      if (product) {
        const newStock = Number(product.currentStock) + Number(validated.quantity);
        await storage.updateProduct(validated.productId, {
          currentStock: newStock.toString(),
        });
      }
      
      const purchase = await storage.createPurchase(validated);
      res.status(201).json(purchase);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // ============== Supplier Routes ==============
  
  app.get("/api/hotels/:hotelId/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliersByHotel(req.params.hotelId);
      res.json(suppliers);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.post("/api/hotels/:hotelId/suppliers", async (req, res) => {
    try {
      const validated = insertSupplierSchema.parse({
        ...req.body,
        hotelId: req.params.hotelId,
      });
      const supplier = await storage.createSupplier(validated);
      res.status(201).json(supplier);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.patch("/api/suppliers/:id", async (req, res) => {
    try {
      const supplier = await storage.updateSupplier(req.params.id, req.body);
      res.json(supplier);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // ============== Report Routes ==============
  
  app.get("/api/hotels/:hotelId/reports/occupancy", async (req, res) => {
    try {
      const rooms = await storage.getRoomsByHotel(req.params.hotelId);
      const reservations = await storage.getReservationsByHotel(req.params.hotelId);
      
      const occupiedRooms = rooms.filter(r => r.status === "occupied").length;
      const totalRooms = rooms.length;
      const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
      
      res.json({
        totalRooms,
        occupiedRooms,
        availableRooms: rooms.filter(r => r.status === "available").length,
        occupancyRate: occupancyRate.toFixed(2),
        totalReservations: reservations.length,
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.get("/api/hotels/:hotelId/reports/revenue", async (req, res) => {
    try {
      const payments = await storage.getPaymentsByHotel(req.params.hotelId);
      const sales = await storage.getSalesByHotel(req.params.hotelId);
      
      const roomRevenue = payments
        .filter(p => p.status === "completed")
        .reduce((sum, p) => sum + Number(p.amount), 0);
      
      const restaurantRevenue = sales
        .reduce((sum, s) => sum + Number(s.total), 0);
      
      res.json({
        roomRevenue: roomRevenue.toFixed(2),
        restaurantRevenue: restaurantRevenue.toFixed(2),
        totalRevenue: (roomRevenue + restaurantRevenue).toFixed(2),
        totalPayments: payments.length,
        totalSales: sales.length,
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.get("/api/hotels/:hotelId/reports/inventory", async (req, res) => {
    try {
      const products = await storage.getProductsByHotel(req.params.hotelId);
      const lowStockProducts = await storage.getLowStockProducts(req.params.hotelId);
      
      const totalValue = products.reduce((sum, p) => 
        sum + (Number(p.currentStock) * Number(p.unitPrice)), 0
      );
      
      res.json({
        totalProducts: products.length,
        lowStockItems: lowStockProducts.length,
        totalInventoryValue: totalValue.toFixed(2),
        products: products.map(p => ({
          id: p.id,
          name: p.name,
          currentStock: p.currentStock,
          alertThreshold: p.alertThreshold,
          isLowStock: Number(p.currentStock) < Number(p.alertThreshold),
        })),
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // ============== Super Admin Routes ==============
  
  app.get("/api/superadmin/hotels", async (req, res) => {
    try {
      const hotels = await storage.getAllHotels();
      res.json(hotels);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.patch("/api/superadmin/hotels/:id", async (req, res) => {
    try {
      const hotel = await storage.updateHotel(req.params.id, req.body);
      res.json(hotel);
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  app.get("/api/superadmin/analytics", async (req, res) => {
    try {
      const hotels = await storage.getAllHotels();
      
      const totalHotels = hotels.length;
      const activeHotels = hotels.filter(h => h.status === "active").length;
      const trialHotels = hotels.filter(h => h.status === "trial").length;
      
      // Calculate MRR (Monthly Recurring Revenue)
      const planPrices: Record<string, number> = {
        basic: 800,
        pro: 2200,
        enterprise: 5000,
      };
      
      const mrr = hotels
        .filter(h => h.status === "active")
        .reduce((sum, h) => sum + (planPrices[h.plan] || 0), 0);
      
      res.json({
        totalHotels,
        activeHotels,
        trialHotels,
        suspendedHotels: hotels.filter(h => h.status === "suspended").length,
        mrr,
        growthRate: 15, // Mock data - would calculate from historical data
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
