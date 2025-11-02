import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  integer, 
  decimal, 
  timestamp, 
  boolean,
  pgEnum
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums for various statuses
export const hotelStatusEnum = pgEnum("hotel_status", ["active", "suspended", "trial"]);
export const userRoleEnum = pgEnum("user_role", ["super_admin", "owner", "receptionist", "housekeeping", "chef", "server", "accountant"]);
export const roomStatusEnum = pgEnum("room_status", ["available", "occupied", "cleaning", "maintenance"]);
export const reservationStatusEnum = pgEnum("reservation_status", ["pending", "confirmed", "checked_in", "checked_out", "cancelled"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"]);
export const paymentMethodEnum = pgEnum("payment_method", ["cash", "card", "transfer", "room_charge"]);
export const subscriptionPlanEnum = pgEnum("subscription_plan", ["trial", "basic", "pro", "enterprise"]);

// Hotels table - tenant table
export const hotels = pgTable("hotels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: text("email").notNull().unique(),
  plan: subscriptionPlanEnum("plan").default("trial").notNull(),
  currency: varchar("currency", { length: 3 }).default("HTG").notNull(), // HTG or USD
  status: hotelStatusEnum("status").default("trial").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Users table - multi-tenant
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").references(() => hotels.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").default("receptionist").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Rooms table
export const rooms = pgTable("rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").notNull().references(() => hotels.id, { onDelete: "cascade" }),
  roomNumber: varchar("room_number", { length: 20 }).notNull(),
  type: text("type").notNull(), // Single, Double, Suite, etc.
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  capacity: integer("capacity").notNull(),
  status: roomStatusEnum("status").default("available").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Guests table
export const guests = pgTable("guests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").notNull().references(() => hotels.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 20 }),
  email: text("email"),
  idCard: text("id_card"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reservations table
export const reservations = pgTable("reservations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").notNull().references(() => hotels.id, { onDelete: "cascade" }),
  roomId: varchar("room_id").notNull().references(() => rooms.id, { onDelete: "restrict" }),
  guestId: varchar("guest_id").notNull().references(() => guests.id, { onDelete: "restrict" }),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  status: reservationStatusEnum("status").default("pending").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").notNull().references(() => hotels.id, { onDelete: "cascade" }),
  reservationId: varchar("reservation_id").references(() => reservations.id, { onDelete: "set null" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("HTG").notNull(),
  method: paymentMethodEnum("method").notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  stripePaymentId: text("stripe_payment_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Invoices table
export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").notNull().references(() => hotels.id, { onDelete: "cascade" }),
  paymentId: varchar("payment_id").references(() => payments.id, { onDelete: "set null" }),
  invoiceNumber: text("invoice_number").notNull(),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Restaurant Products table
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").notNull().references(() => hotels.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  currentStock: decimal("current_stock", { precision: 10, scale: 2 }).default("0").notNull(),
  alertThreshold: decimal("alert_threshold", { precision: 10, scale: 2 }).default("10").notNull(),
  unit: text("unit").notNull(), // kg, liters, bottles, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sales table
export const sales = pgTable("sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").notNull().references(() => hotels.id, { onDelete: "cascade" }),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
  employeeId: varchar("employee_id").references(() => users.id, { onDelete: "set null" }),
  roomId: varchar("room_id").references(() => rooms.id, { onDelete: "set null" }), // Optional - link to room charge
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Purchases table (for inventory restocking)
export const purchases = pgTable("purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").notNull().references(() => hotels.id, { onDelete: "cascade" }),
  supplierId: varchar("supplier_id").references(() => suppliers.id, { onDelete: "set null" }),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  purchaseDate: timestamp("purchase_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Suppliers table
export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").notNull().references(() => hotels.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  contact: varchar("contact", { length: 20 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const hotelsRelations = relations(hotels, ({ many }) => ({
  users: many(users),
  rooms: many(rooms),
  guests: many(guests),
  reservations: many(reservations),
  payments: many(payments),
  invoices: many(invoices),
  products: many(products),
  sales: many(sales),
  purchases: many(purchases),
  suppliers: many(suppliers),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  hotel: one(hotels, {
    fields: [users.hotelId],
    references: [hotels.id],
  }),
  sales: many(sales),
  reservations: many(reservations),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  hotel: one(hotels, {
    fields: [rooms.hotelId],
    references: [hotels.id],
  }),
  reservations: many(reservations),
  sales: many(sales),
}));

export const guestsRelations = relations(guests, ({ one, many }) => ({
  hotel: one(hotels, {
    fields: [guests.hotelId],
    references: [hotels.id],
  }),
  reservations: many(reservations),
}));

export const reservationsRelations = relations(reservations, ({ one, many }) => ({
  hotel: one(hotels, {
    fields: [reservations.hotelId],
    references: [hotels.id],
  }),
  room: one(rooms, {
    fields: [reservations.roomId],
    references: [rooms.id],
  }),
  guest: one(guests, {
    fields: [reservations.guestId],
    references: [guests.id],
  }),
  createdByUser: one(users, {
    fields: [reservations.createdBy],
    references: [users.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  hotel: one(hotels, {
    fields: [payments.hotelId],
    references: [hotels.id],
  }),
  reservation: one(reservations, {
    fields: [payments.reservationId],
    references: [reservations.id],
  }),
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  hotel: one(hotels, {
    fields: [invoices.hotelId],
    references: [hotels.id],
  }),
  payment: one(payments, {
    fields: [invoices.paymentId],
    references: [payments.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  hotel: one(hotels, {
    fields: [products.hotelId],
    references: [hotels.id],
  }),
  sales: many(sales),
  purchases: many(purchases),
}));

export const salesRelations = relations(sales, ({ one }) => ({
  hotel: one(hotels, {
    fields: [sales.hotelId],
    references: [hotels.id],
  }),
  product: one(products, {
    fields: [sales.productId],
    references: [products.id],
  }),
  employee: one(users, {
    fields: [sales.employeeId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [sales.roomId],
    references: [rooms.id],
  }),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  hotel: one(hotels, {
    fields: [purchases.hotelId],
    references: [hotels.id],
  }),
  product: one(products, {
    fields: [purchases.productId],
    references: [products.id],
  }),
  supplier: one(suppliers, {
    fields: [purchases.supplierId],
    references: [suppliers.id],
  }),
}));

export const suppliersRelations = relations(suppliers, ({ one, many }) => ({
  hotel: one(hotels, {
    fields: [suppliers.hotelId],
    references: [hotels.id],
  }),
  purchases: many(purchases),
}));

// Insert schemas
export const insertHotelSchema = createInsertSchema(hotels).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
  createdAt: true,
});

export const insertGuestSchema = createInsertSchema(guests).omit({
  id: true,
  createdAt: true,
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertSaleSchema = createInsertSchema(sales).omit({
  id: true,
  createdAt: true,
});

export const insertPurchaseSchema = createInsertSchema(purchases).omit({
  id: true,
  createdAt: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
});

// Types
export type Hotel = typeof hotels.$inferSelect;
export type InsertHotel = z.infer<typeof insertHotelSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;

export type Guest = typeof guests.$inferSelect;
export type InsertGuest = z.infer<typeof insertGuestSchema>;

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Sale = typeof sales.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
