# Design Guidelines: Multi-Tenant Hotel & Restaurant Management SaaS

## Design Approach

**Selected Approach:** Design System - Material Design 3
**Justification:** This is a utility-focused, data-intensive business application requiring consistency, scalability, and professional credibility. Material Design 3 provides robust patterns for complex data tables, forms, dashboards, and multi-role interfaces while maintaining excellent mobile responsiveness.

---

## Typography System

**Font Family:**
- Primary: 'Inter' via Google Fonts - exceptional readability for data-dense interfaces
- Monospace: 'Roboto Mono' for numerical data, invoices, and financial reports

**Type Scale:**
- Display Large: 3.5rem (56px) - Super Admin dashboard headlines
- Headline Large: 2rem (32px) - Dashboard section headers
- Headline Medium: 1.5rem (24px) - Card titles, modal headers
- Title Large: 1.25rem (20px) - Table headers, form section titles
- Body Large: 1rem (16px) - Primary content, form labels
- Body Medium: 0.875rem (14px) - Table cells, secondary text
- Label Large: 0.875rem (14px) - Button text, input labels
- Label Small: 0.75rem (12px) - Helper text, timestamps

**Font Weights:**
- Regular (400): Body text, table data
- Medium (500): Labels, emphasized text
- Semibold (600): Headings, active navigation
- Bold (700): Dashboard metrics, CTA buttons

---

## Layout System

**Spacing Primitives:**
Primary units: 2, 4, 8, 12, 16, 24, 32
- Component padding: p-4, p-6, p-8
- Section spacing: gap-6, gap-8
- Page margins: px-4 (mobile), px-8 (tablet), px-12 (desktop)
- Card spacing: p-6 for standard cards, p-8 for hero cards

**Grid System:**
- 12-column responsive grid
- Container max-width: max-w-7xl (1280px)
- Gutter: gap-6 (24px)
- Breakpoints: sm:640px, md:768px, lg:1024px, xl:1280px

**Dashboard Layout Structure:**
- Persistent sidebar: w-64 (256px) on desktop, collapsible drawer on mobile
- Top navigation bar: h-16 (64px) with hotel logo, user menu, notifications
- Content area: Full remaining width with max-w-7xl centering
- Bottom padding: pb-16 for comfortable scrolling

---

## Component Library

### Navigation Components

**Sidebar Navigation:**
- Fixed left sidebar with hierarchical menu structure
- Top section: Hotel logo and name (h-20)
- Middle: Scrollable navigation groups with icons (h-12 per item)
- Bottom: User profile card with avatar and role badge
- Active state: Highlighted background panel with left border accent
- Icon size: 20x20px from Material Icons

**Top Bar:**
- Height: h-16
- Left: Hamburger menu (mobile), breadcrumb navigation (desktop)
- Center: Current page title
- Right: Search icon, notification bell with badge, user avatar dropdown
- Sticky positioning on scroll

**Tabs:**
- Horizontal tabs for switching between related views (Rooms/Restaurant/Reports)
- Underline indicator for active tab
- Full-width on mobile, auto-width on desktop

### Data Display

**Tables:**
- Striped rows for readability
- Sticky headers on scroll
- Row hover state with subtle elevation
- Action column (right-aligned) with icon buttons
- Sortable columns with arrow indicators
- Pagination footer: "Showing X-Y of Z entries" with page controls
- Mobile: Convert to stacked cards with key fields visible

**Cards:**
- Elevation: shadow-sm for standard, shadow-md for interactive
- Border radius: rounded-lg (8px)
- Structure: Image/icon top, title, metadata, action buttons bottom
- Stat cards: Large number (text-4xl font-bold), label below, optional trend indicator
- Booking cards: Guest info, dates, room number, status badge, action menu

**Status Badges:**
- Pill shape: rounded-full, px-3, py-1
- Size: text-sm font-medium
- States: Available, Occupied, Cleaning, Maintenance, Confirmed, Pending, Cancelled
- Icon prefix for quick scanning

**Charts & Visualizations:**
- Use Chart.js or Recharts library
- Occupancy rate: Donut chart with center percentage
- Revenue trends: Line chart with multiple series (rooms vs restaurant)
- Room status: Horizontal stacked bar chart
- Sales by category: Vertical bar chart
- Legend: Below chart on mobile, right-side on desktop

### Forms & Inputs

**Input Fields:**
- Height: h-12 (48px) for comfortable touch targets
- Label above input (text-sm font-medium, mb-2)
- Rounded corners: rounded-md
- Focus state: Ring outline
- Error state: Red ring with error message below (text-sm)
- Helper text: text-xs below input
- Icon support: Leading icon (search, calendar) or trailing icon (clear, dropdown)

**Buttons:**
- Primary: Large CTA (h-12, px-8, rounded-md, font-medium)
- Secondary: Outlined style (h-10, px-6)
- Tertiary: Text-only (h-10, px-4)
- Icon buttons: Square (h-10 w-10, rounded-md)
- Destructive: Red variant for delete actions
- Loading state: Spinner replaces content

**Select & Dropdowns:**
- Custom dropdown with search for long lists (room selection, guest lookup)
- Native select for short lists (< 10 items)
- Multi-select with chips for tags/categories

**Date Pickers:**
- Calendar popup with month/year navigation
- Range selection for check-in/check-out dates
- Quick presets: Today, Tomorrow, This Week, This Month
- Visual indication of booked dates (disabled with tooltip)

**File Upload:**
- Drag-and-drop zone with dashed border
- File preview thumbnails for images (ID cards, receipts)
- Progress bar during upload
- Maximum file size and type displayed

### Modals & Overlays

**Modal Dialogs:**
- Max-width: max-w-2xl for forms, max-w-4xl for detailed views
- Header: Title (text-xl font-semibold), close button
- Body: Scrollable content with p-6
- Footer: Action buttons (Cancel left, Primary right)
- Backdrop: Semi-transparent overlay

**Drawers:**
- Side panel from right for detail views (guest profile, reservation details)
- Width: w-96 (384px)
- Close on backdrop click or X button
- Smooth slide-in animation

**Toasts/Notifications:**
- Position: top-right corner
- Duration: 4s auto-dismiss
- Types: Success (checkmark), Error (X), Warning (exclamation), Info (i)
- Dismissible with close button
- Stack vertically if multiple

---

## Page-Specific Layouts

### Hotel Dashboard (Home)
- Hero metrics row: 4 stat cards (Occupancy Rate, Today's Check-ins, Revenue MTD, Restaurant Sales)
- Calendar section: Full-width monthly view with color-coded bookings
- Quick actions: Large button group (New Reservation, Check-in Guest, View Reports)
- Recent activity feed: Timeline-style list with icons
- Alerts: Prominent card for low stock, pending payments, maintenance requests

### Reservation Management
- Split view: Left side filter panel (w-80), right side table/calendar toggle
- Calendar view: Week grid with room rows, draggable booking blocks
- Table view: Paginated list with search, filters, bulk actions
- Add reservation: Multi-step form modal (Guest info → Room selection → Payment)

### Restaurant Module
- Tab navigation: Menu | Inventory | Orders | Reports
- Menu page: Grid of menu items (3 columns desktop, 1 mobile) with edit inline
- Inventory: Table with stock levels, color-coded alerts (red < 10%, yellow < 25%)
- POS interface: Left product grid, right order summary, numeric keypad for quick entry
- Link to room: Search dropdown to attach charges to guest room

### Super Admin Portal
- Different theme: Elevated admin feel with distinct navigation
- Hotel list: Cards with key metrics, status indicators, quick actions
- Analytics dashboard: Large charts showing MRR growth, churn, active hotels
- Subscription management: Table with filter by plan, payment status
- Support tickets: Kanban board or list view with priority badges

---

## Responsive Behavior

**Mobile (< 768px):**
- Hamburger menu with full-screen drawer
- Stack all multi-column layouts to single column
- Convert tables to card-based lists
- Bottom navigation bar for primary actions
- Floating action button for quick create actions

**Tablet (768px - 1024px):**
- Collapsible sidebar
- 2-column layouts where appropriate
- Maintain table views with horizontal scroll

**Desktop (> 1024px):**
- Full sidebar navigation visible
- Multi-column dashboards and grids
- Hover states and tooltips enabled
- Wider modals and detail panels

---

## Special Considerations

**Multi-Currency Display:**
- Always show currency symbol prefix (HTG or $)
- Format: HTG 1,234.56 or $1,234.56
- Toggle in user settings, persist preference
- Exchange rate indicator where relevant

**Print Optimization:**
- Invoices and reports: Clean print stylesheet
- Hide navigation and non-essential UI
- Ensure sufficient contrast for printed receipts
- QR code generation for invoice tracking

**Accessibility:**
- ARIA labels on all icon-only buttons
- Keyboard navigation support (Tab, Enter, Escape)
- Focus indicators on all interactive elements
- Screen reader announcements for dynamic updates (new booking, low stock alert)
- Color is never the only indicator (use icons + text)

**Performance:**
- Lazy load dashboard charts and heavy components
- Virtualized tables for large datasets (> 100 rows)
- Skeleton screens during data fetching
- Optimistic UI updates (instant feedback, sync in background)

---

## Images

**Hotel Dashboard:**
- Optional header image: Panoramic hotel exterior photo (h-48, rounded-lg) as page header banner - helps users identify their property at a glance

**Super Admin:**
- Each hotel card includes thumbnail image (w-24 h-16, rounded-md, object-cover) showing hotel property

**Empty States:**
- Illustration graphics for empty tables/lists (no reservations, no menu items) - use unDraw or similar illustration library
- Size: max-w-xs, centered with text below

No large hero images - this is a data-focused application prioritizing functionality.