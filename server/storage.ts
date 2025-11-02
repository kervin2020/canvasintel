// Reference: javascript_database blueprint
import {
  hotels, users, rooms, reservations, guests, payments, invoices,
  products, sales, purchases, suppliers,
  type Hotel, type InsertHotel,
  type User, type InsertUser,
  type Room, type InsertRoom,
  type Reservation, type InsertReservation,
  type Guest, type InsertGuest,
  type Payment, type InsertPayment,
  type Invoice, type InsertInvoice,
  type Product, type InsertProduct,
  type Sale, type InsertSale,
  type Purchase, type InsertPurchase,
  type Supplier, type InsertSupplier,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export interface IStorage {
  // Hotel methods
  getHotel(id: string): Promise<Hotel | undefined>;
  getHotelByEmail(email: string): Promise<Hotel | undefined>;
  getAllHotels(): Promise<Hotel[]>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;
  updateHotel(id: string, hotel: Partial<InsertHotel>): Promise<Hotel>;

  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsersByHotel(hotelId: string): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;

  // Room methods
  getRoom(id: string): Promise<Room | undefined>;
  getRoomsByHotel(hotelId: string): Promise<Room[]>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: string, room: Partial<InsertRoom>): Promise<Room>;
  deleteRoom(id: string): Promise<void>;

  // Reservation methods
  getReservation(id: string): Promise<Reservation | undefined>;
  getReservationsByHotel(hotelId: string): Promise<Reservation[]>;
  getReservationsByRoom(roomId: string, startDate: Date, endDate: Date): Promise<Reservation[]>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservation(id: string, reservation: Partial<InsertReservation>): Promise<Reservation>;
  deleteReservation(id: string): Promise<void>;

  // Guest methods
  getGuest(id: string): Promise<Guest | undefined>;
  getGuestsByHotel(hotelId: string): Promise<Guest[]>;
  createGuest(guest: InsertGuest): Promise<Guest>;
  updateGuest(id: string, guest: Partial<InsertGuest>): Promise<Guest>;

  // Payment methods
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentsByHotel(hotelId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment>;

  // Invoice methods
  getInvoice(id: string): Promise<Invoice | undefined>;
  getInvoicesByHotel(hotelId: string): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;

  // Product methods
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByHotel(hotelId: string): Promise<Product[]>;
  getLowStockProducts(hotelId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  // Sale methods
  getSale(id: string): Promise<Sale | undefined>;
  getSalesByHotel(hotelId: string): Promise<Sale[]>;
  getSalesByEmployee(employeeId: string): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;

  // Purchase methods
  getPurchase(id: string): Promise<Purchase | undefined>;
  getPurchasesByHotel(hotelId: string): Promise<Purchase[]>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;

  // Supplier methods
  getSupplier(id: string): Promise<Supplier | undefined>;
  getSuppliersByHotel(hotelId: string): Promise<Supplier[]>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier>;
}

export class DatabaseStorage implements IStorage {
  // Hotel methods
  async getHotel(id: string): Promise<Hotel | undefined> {
    const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id));
    return hotel || undefined;
  }

  async getHotelByEmail(email: string): Promise<Hotel | undefined> {
    const [hotel] = await db.select().from(hotels).where(eq(hotels.email, email));
    return hotel || undefined;
  }

  async getAllHotels(): Promise<Hotel[]> {
    return await db.select().from(hotels).orderBy(desc(hotels.createdAt));
  }

  async createHotel(insertHotel: InsertHotel): Promise<Hotel> {
    const [hotel] = await db.insert(hotels).values(insertHotel).returning();
    return hotel;
  }

  async updateHotel(id: string, updateData: Partial<InsertHotel>): Promise<Hotel> {
    const [hotel] = await db.update(hotels).set(updateData).where(eq(hotels.id, id)).returning();
    return hotel;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUsersByHotel(hotelId: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.hotelId, hotelId));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return user;
  }

  // Room methods
  async getRoom(id: string): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
    return room || undefined;
  }

  async getRoomsByHotel(hotelId: string): Promise<Room[]> {
    return await db.select().from(rooms).where(eq(rooms.hotelId, hotelId));
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const [room] = await db.insert(rooms).values(insertRoom).returning();
    return room;
  }

  async updateRoom(id: string, updateData: Partial<InsertRoom>): Promise<Room> {
    const [room] = await db.update(rooms).set(updateData).where(eq(rooms.id, id)).returning();
    return room;
  }

  async deleteRoom(id: string): Promise<void> {
    await db.delete(rooms).where(eq(rooms.id, id));
  }

  // Reservation methods
  async getReservation(id: string): Promise<Reservation | undefined> {
    const [reservation] = await db.select().from(reservations).where(eq(reservations.id, id));
    return reservation || undefined;
  }

  async getReservationsByHotel(hotelId: string): Promise<Reservation[]> {
    return await db.select().from(reservations)
      .where(eq(reservations.hotelId, hotelId))
      .orderBy(desc(reservations.checkIn));
  }

  async getReservationsByRoom(roomId: string, startDate: Date, endDate: Date): Promise<Reservation[]> {
    return await db.select().from(reservations)
      .where(
        and(
          eq(reservations.roomId, roomId),
          gte(reservations.checkOut, startDate),
          lte(reservations.checkIn, endDate)
        )
      );
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const [reservation] = await db.insert(reservations).values(insertReservation).returning();
    return reservation;
  }

  async updateReservation(id: string, updateData: Partial<InsertReservation>): Promise<Reservation> {
    const [reservation] = await db.update(reservations)
      .set(updateData)
      .where(eq(reservations.id, id))
      .returning();
    return reservation;
  }

  async deleteReservation(id: string): Promise<void> {
    await db.delete(reservations).where(eq(reservations.id, id));
  }

  // Guest methods
  async getGuest(id: string): Promise<Guest | undefined> {
    const [guest] = await db.select().from(guests).where(eq(guests.id, id));
    return guest || undefined;
  }

  async getGuestsByHotel(hotelId: string): Promise<Guest[]> {
    return await db.select().from(guests)
      .where(eq(guests.hotelId, hotelId))
      .orderBy(desc(guests.createdAt));
  }

  async createGuest(insertGuest: InsertGuest): Promise<Guest> {
    const [guest] = await db.insert(guests).values(insertGuest).returning();
    return guest;
  }

  async updateGuest(id: string, updateData: Partial<InsertGuest>): Promise<Guest> {
    const [guest] = await db.update(guests).set(updateData).where(eq(guests.id, id)).returning();
    return guest;
  }

  // Payment methods
  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async getPaymentsByHotel(hotelId: string): Promise<Payment[]> {
    return await db.select().from(payments)
      .where(eq(payments.hotelId, hotelId))
      .orderBy(desc(payments.createdAt));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }

  async updatePayment(id: string, updateData: Partial<InsertPayment>): Promise<Payment> {
    const [payment] = await db.update(payments)
      .set(updateData)
      .where(eq(payments.id, id))
      .returning();
    return payment;
  }

  // Invoice methods
  async getInvoice(id: string): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice || undefined;
  }

  async getInvoicesByHotel(hotelId: string): Promise<Invoice[]> {
    return await db.select().from(invoices)
      .where(eq(invoices.hotelId, hotelId))
      .orderBy(desc(invoices.createdAt));
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(insertInvoice).returning();
    return invoice;
  }

  // Product methods
  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByHotel(hotelId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.hotelId, hotelId));
  }

  async getLowStockProducts(hotelId: string): Promise<Product[]> {
    const allProducts = await db.select().from(products).where(eq(products.hotelId, hotelId));
    return allProducts.filter(p => Number(p.currentStock) < Number(p.alertThreshold));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db.update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Sale methods
  async getSale(id: string): Promise<Sale | undefined> {
    const [sale] = await db.select().from(sales).where(eq(sales.id, id));
    return sale || undefined;
  }

  async getSalesByHotel(hotelId: string): Promise<Sale[]> {
    return await db.select().from(sales)
      .where(eq(sales.hotelId, hotelId))
      .orderBy(desc(sales.createdAt));
  }

  async getSalesByEmployee(employeeId: string): Promise<Sale[]> {
    return await db.select().from(sales)
      .where(eq(sales.employeeId, employeeId))
      .orderBy(desc(sales.createdAt));
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const [sale] = await db.insert(sales).values(insertSale).returning();
    return sale;
  }

  // Purchase methods
  async getPurchase(id: string): Promise<Purchase | undefined> {
    const [purchase] = await db.select().from(purchases).where(eq(purchases.id, id));
    return purchase || undefined;
  }

  async getPurchasesByHotel(hotelId: string): Promise<Purchase[]> {
    return await db.select().from(purchases)
      .where(eq(purchases.hotelId, hotelId))
      .orderBy(desc(purchases.createdAt));
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const [purchase] = await db.insert(purchases).values(insertPurchase).returning();
    return purchase;
  }

  // Supplier methods
  async getSupplier(id: string): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier || undefined;
  }

  async getSuppliersByHotel(hotelId: string): Promise<Supplier[]> {
    return await db.select().from(suppliers).where(eq(suppliers.hotelId, hotelId));
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const [supplier] = await db.insert(suppliers).values(insertSupplier).returning();
    return supplier;
  }

  async updateSupplier(id: string, updateData: Partial<InsertSupplier>): Promise<Supplier> {
    const [supplier] = await db.update(suppliers)
      .set(updateData)
      .where(eq(suppliers.id, id))
      .returning();
    return supplier;
  }
}

export const storage = new DatabaseStorage();
