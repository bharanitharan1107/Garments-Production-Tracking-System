// ============================================================
// AKASH GARMENTS MANAGEMENT SYSTEM — MOCK DATA
// ============================================================

export type UserRole = 'Admin' | 'Production Manager' | 'Worker' | 'QC Inspector';
export type OrderStatus = 'Pending' | 'In Progress' | 'QC Review' | 'Completed' | 'Cancelled' | 'On Hold';
export type ProductionStage = 'Cutting' | 'Sewing' | 'Finishing' | 'QC' | 'Packaging';
export type MachineStatus = 'Running' | 'Idle' | 'Maintenance' | 'Breakdown';
export type ShipmentStatus = 'Preparing' | 'Dispatched' | 'In Transit' | 'Delivered' | 'Returned';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Shift = 'Morning' | 'Afternoon' | 'Night';

export interface User {
  id: string; name: string; email: string; password: string;
  role: UserRole; status: 'Active' | 'Inactive'; department: string;
  avatar: string; lastLogin: string; joinDate: string;
}

export interface Customer {
  id: string; name: string; email: string; phone: string;
  address: string; country: string; totalOrders: number; totalValue: number;
}

export interface Order {
  id: string; orderNumber: string; customerId: string; customerName: string;
  product: string; quantity: number; status: OrderStatus; deadline: string;
  priority: Priority; assignedTo: string; notes: string;
  createdAt: string; unitPrice: number; totalValue: number;
}

export interface InventoryItem {
  id: string; name: string; category: string; sku: string;
  quantity: number; unit: string; minStock: number; maxStock: number;
  location: string; supplier: string; costPerUnit: number; lastUpdated: string;
}

export interface ProductionLine {
  id: string; orderId: string; orderNumber: string; product: string;
  stage: ProductionStage; progress: number; startDate: string; endDate: string;
  assignedWorkers: string[]; machineId: string; status: 'Active' | 'Paused' | 'Completed' | 'Delayed';
  targetQty: number; completedQty: number; notes: string;
}

export interface Worker {
  id: string; employeeId: string; name: string; email: string;
  phone: string; department: string; role: string; shift: Shift;
  status: 'On Duty' | 'Off Duty' | 'On Leave' | 'Absent';
  efficiency: number; tasksCompleted: number; joinDate: string;
}

export interface QCRecord {
  id: string; orderId: string; orderNumber: string; productName: string;
  inspector: string; date: string;
  status: 'Passed' | 'Failed' | 'Under Review' | 'Rework Required';
  totalInspected: number; defectsFound: number;
  defectType: string; severity: 'Low' | 'Medium' | 'High' | 'Critical';
  notes: string; resolved: boolean;
}

export interface Machine {
  id: string; name: string; type: string;
  status: MachineStatus; efficiency: number;
  operatingHours: number; lastMaintenance: string;
  nextMaintenance: string; operator: string;
  location: string; model: string; manufacturer: string;
  serialNumber: string;
}

export interface Shipment {
  id: string; orderId: string; orderNumber: string;
  customerId: string; customerName: string;
  destination: string; carrier: string; trackingNumber: string;
  status: ShipmentStatus; weight: number;
  shippedDate: string; estimatedDelivery: string;
  actualDelivery: string; notes: string;
}

// ---- USERS ----
export const users: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@akashgarments.com', password: 'admin123', role: 'Admin', status: 'Active', department: 'Management', avatar: 'AU', lastLogin: '2026-03-10T08:00:00', joinDate: '2020-01-15' },
  { id: 'u2', name: 'Sarah Johnson', email: 'sarah@akashgarments.com', password: 'sarah123', role: 'Admin', status: 'Active', department: 'Management', avatar: 'SJ', lastLogin: '2026-03-09T17:30:00', joinDate: '2021-03-20' },
  { id: 'u3', name: 'Michael Chen', email: 'mchen@akashgarments.com', password: 'mike123', role: 'Production Manager', status: 'Active', department: 'Production', avatar: 'MC', lastLogin: '2026-03-10T07:45:00', joinDate: '2021-06-10' },
  { id: 'u4', name: 'Priya Patel', email: 'priya@akashgarments.com', password: 'priya123', role: 'Production Manager', status: 'Active', department: 'Production', avatar: 'PP', lastLogin: '2026-03-10T08:15:00', joinDate: '2022-02-14' },
  { id: 'u5', name: 'James Wilson', email: 'jwilson@akashgarments.com', password: 'james123', role: 'Worker', status: 'Active', department: 'Sewing', avatar: 'JW', lastLogin: '2026-03-10T06:00:00', joinDate: '2023-01-09' },
  { id: 'u6', name: 'Fatima Al-Hassan', email: 'fatima@akashgarments.com', password: 'fatima123', role: 'Worker', status: 'Active', department: 'Cutting', avatar: 'FH', lastLogin: '2026-03-09T18:00:00', joinDate: '2023-07-22' },
  { id: 'u7', name: 'David Park', email: 'dpark@akashgarments.com', password: 'david123', role: 'QC Inspector', status: 'Active', department: 'Quality Control', avatar: 'DP', lastLogin: '2026-03-10T08:30:00', joinDate: '2022-11-05' },
  { id: 'u8', name: 'Lisa Torres', email: 'ltorres@akashgarments.com', password: 'lisa123', role: 'QC Inspector', status: 'Active', department: 'Quality Control', avatar: 'LT', lastLogin: '2026-03-10T09:00:00', joinDate: '2023-04-18' },
];

// ---- CUSTOMERS ----
export const customers: Customer[] = [
  { id: 'c1', name: 'Lakshmi Silks & Fashions', email: 'orders@lakshmisilks.in', phone: '+91-44-2433-5678', address: 'T. Nagar, Chennai 600017', country: 'India', totalOrders: 45, totalValue: 3720000 },
  { id: 'c2', name: 'Coimbatore Textile Hub', email: 'purchase@cottoncity.in', phone: '+91-422-2345-678', address: 'Gandhipuram, Coimbatore 641012', country: 'India', totalOrders: 38, totalValue: 3180000 },
  { id: 'c3', name: 'Salem Garment Exports', email: 'import@salemgarments.in', phone: '+91-427-2345-678', address: 'Omalur Main Road, Salem 636002', country: 'India', totalOrders: 29, totalValue: 2420000 },
  { id: 'c4', name: 'Madurai Fashion Corner', email: 'orders@maduraifashion.in', phone: '+91-452-2345-678', address: 'Anna Nagar, Madurai 625020', country: 'India', totalOrders: 22, totalValue: 1830000 },
  { id: 'c5', name: 'Tirupur Export House', email: 'buy@tirupurexports.in', phone: '+91-421-2345-678', address: 'Kangeyam Road, Tirupur 641604', country: 'India', totalOrders: 31, totalValue: 2580000 },
  { id: 'c6', name: 'Bangalore Knits Pvt Ltd', email: 'orders@bangaloreknits.in', phone: '+91-80-2345-6789', address: 'Peenya Industrial Area, Bangalore 560058', country: 'India', totalOrders: 19, totalValue: 1590000 },
  { id: 'c7', name: 'Chennai Garment Mall', email: 'orders@chennaigarment.in', phone: '+91-44-2345-6789', address: 'Pondy Bazaar, Chennai 600017', country: 'India', totalOrders: 54, totalValue: 4510000 },
  { id: 'c8', name: 'Erode Silk Sarees Co', email: 'commandes@erodesilk.in', phone: '+91-424-2345-678', address: 'Brough Road, Erode 638001', country: 'India', totalOrders: 16, totalValue: 1340000 },
];

// ---- ORDERS ----
export const orders: Order[] = [
  { id: 'o1', orderNumber: 'ORD-2026-001', customerId: 'c1', customerName: 'Lakshmi Silks & Fashions', product: 'Classic White T-Shirt', quantity: 5000, status: 'In Progress', deadline: '2026-03-20', priority: 'High', assignedTo: 'Michael Chen', notes: 'Premium cotton, size S-XXL', createdAt: '2026-02-15', unitPrice: 185, totalValue: 925000 },
  { id: 'o2', orderNumber: 'ORD-2026-002', customerId: 'c2', customerName: 'Coimbatore Textile Hub', product: 'Slim Fit Jeans', quantity: 3000, status: 'QC Review', deadline: '2026-03-25', priority: 'Medium', assignedTo: 'Priya Patel', notes: 'Stretch denim, dark wash', createdAt: '2026-02-18', unitPrice: 550, totalValue: 1650000 },
  { id: 'o3', orderNumber: 'ORD-2026-003', customerId: 'c3', customerName: 'Salem Garment Exports', product: 'Floral Summer Dress', quantity: 2500, status: 'Pending', deadline: '2026-04-05', priority: 'Medium', assignedTo: 'Michael Chen', notes: 'Light fabric, various prints', createdAt: '2026-02-20', unitPrice: 750, totalValue: 1875000 },
  { id: 'o4', orderNumber: 'ORD-2026-004', customerId: 'c4', customerName: 'Madurai Fashion Corner', product: 'Men\'s Polo Shirt', quantity: 4000, status: 'In Progress', deadline: '2026-03-18', priority: 'Critical', assignedTo: 'Priya Patel', notes: 'Embroidered logo, size M-XL', createdAt: '2026-02-22', unitPrice: 320, totalValue: 1280000 },
  { id: 'o5', orderNumber: 'ORD-2026-005', customerId: 'c5', customerName: 'Tirupur Export House', product: 'Athletic Hoodie', quantity: 6000, status: 'Completed', deadline: '2026-03-10', priority: 'High', assignedTo: 'Michael Chen', notes: 'Moisture-wicking fabric', createdAt: '2026-02-01', unitPrice: 850, totalValue: 5100000 },
  { id: 'o6', orderNumber: 'ORD-2026-006', customerId: 'c6', customerName: 'Bangalore Knits Pvt Ltd', product: 'Women\'s Blazer', quantity: 1500, status: 'In Progress', deadline: '2026-04-10', priority: 'Low', assignedTo: 'Priya Patel', notes: 'Structured fit, neutral colors', createdAt: '2026-02-25', unitPrice: 1800, totalValue: 2700000 },
  { id: 'o7', orderNumber: 'ORD-2026-007', customerId: 'c7', customerName: 'Chennai Garment Mall', product: 'Kurta Set', quantity: 8000, status: 'In Progress', deadline: '2026-03-28', priority: 'High', assignedTo: 'Michael Chen', notes: 'Traditional embroidery, festive collection', createdAt: '2026-03-01', unitPrice: 450, totalValue: 3600000 },
  { id: 'o8', orderNumber: 'ORD-2026-008', customerId: 'c8', customerName: 'Erode Silk Sarees Co', product: 'Evening Gown', quantity: 500, status: 'Pending', deadline: '2026-04-20', priority: 'High', assignedTo: 'Priya Patel', notes: 'Silk fabric, hand stitching required', createdAt: '2026-03-02', unitPrice: 4500, totalValue: 2250000 },
  { id: 'o9', orderNumber: 'ORD-2026-009', customerId: 'c1', customerName: 'Lakshmi Silks & Fashions', product: 'Cargo Shorts', quantity: 3500, status: 'Cancelled', deadline: '2026-03-15', priority: 'Low', assignedTo: 'Michael Chen', notes: 'Cancelled by customer', createdAt: '2026-02-10', unitPrice: 280, totalValue: 980000 },
  { id: 'o10', orderNumber: 'ORD-2026-010', customerId: 'c2', customerName: 'Coimbatore Textile Hub', product: 'Denim Jacket', quantity: 2000, status: 'On Hold', deadline: '2026-04-01', priority: 'Medium', assignedTo: 'Priya Patel', notes: 'Waiting for fabric delivery', createdAt: '2026-03-03', unitPrice: 1200, totalValue: 2400000 },
  { id: 'o11', orderNumber: 'ORD-2026-011', customerId: 'c3', customerName: 'Salem Garment Exports', product: 'Chiffon Blouse', quantity: 4000, status: 'In Progress', deadline: '2026-03-22', priority: 'High', assignedTo: 'Michael Chen', notes: 'Delicate fabric, careful handling', createdAt: '2026-02-28', unitPrice: 380, totalValue: 1520000 },
  { id: 'o12', orderNumber: 'ORD-2026-012', customerId: 'c5', customerName: 'Tirupur Export House', product: 'Track Pants', quantity: 5000, status: 'QC Review', deadline: '2026-03-30', priority: 'Medium', assignedTo: 'Priya Patel', notes: 'Elastic waistband, reflective strips', createdAt: '2026-03-05', unitPrice: 520, totalValue: 2600000 },
];

// ---- INVENTORY ----
export const inventory: InventoryItem[] = [
  { id: 'inv1', name: 'White Cotton Fabric', category: 'Fabric', sku: 'FAB-COT-001', quantity: 5000, unit: 'meters', minStock: 2000, maxStock: 10000, location: 'Warehouse A - Shelf 1', supplier: 'Chennai Textiles Pvt Ltd', costPerUnit: 120, lastUpdated: '2026-03-08' },
  { id: 'inv2', name: 'Blue Denim Fabric', category: 'Fabric', sku: 'FAB-DEN-002', quantity: 1800, unit: 'meters', minStock: 2000, maxStock: 8000, location: 'Warehouse A - Shelf 3', supplier: 'Coimbatore Denim Mills', costPerUnit: 280, lastUpdated: '2026-03-07' },
  { id: 'inv3', name: 'Black Polyester Thread', category: 'Thread', sku: 'THR-POL-001', quantity: 800, unit: 'spools', minStock: 500, maxStock: 2000, location: 'Supply Room B', supplier: 'Tirupur Thread Works', costPerUnit: 45, lastUpdated: '2026-03-09' },
  { id: 'inv4', name: 'White Polyester Thread', category: 'Thread', sku: 'THR-POL-002', quantity: 350, unit: 'spools', minStock: 500, maxStock: 2000, location: 'Supply Room B', supplier: 'Tirupur Thread Works', costPerUnit: 45, lastUpdated: '2026-03-09' },
  { id: 'inv5', name: 'Plastic Buttons (12mm)', category: 'Accessories', sku: 'ACC-BTN-001', quantity: 50000, unit: 'pieces', minStock: 10000, maxStock: 100000, location: 'Storage C - Bin 4', supplier: 'Salem Button Industries', costPerUnit: 2, lastUpdated: '2026-03-06' },
  { id: 'inv6', name: 'Metal Zippers (20cm)', category: 'Accessories', sku: 'ACC-ZIP-001', quantity: 3000, unit: 'pieces', minStock: 2000, maxStock: 10000, location: 'Storage C - Bin 7', supplier: 'Erode Zipper Co', costPerUnit: 25, lastUpdated: '2026-03-08' },
  { id: 'inv7', name: 'Floral Print Chiffon', category: 'Fabric', sku: 'FAB-CHF-003', quantity: 2200, unit: 'meters', minStock: 1500, maxStock: 6000, location: 'Warehouse A - Shelf 5', supplier: 'Kanchipuram Silks', costPerUnit: 350, lastUpdated: '2026-03-05' },
  { id: 'inv8', name: 'Elastic Band (2.5cm)', category: 'Accessories', sku: 'ACC-ELB-001', quantity: 450, unit: 'meters', minStock: 500, maxStock: 2000, location: 'Storage C - Bin 2', supplier: 'Madurai Elastics', costPerUnit: 12, lastUpdated: '2026-03-07' },
  { id: 'inv9', name: 'Embroidery Thread Set', category: 'Thread', sku: 'THR-EMB-003', quantity: 120, unit: 'sets', minStock: 100, maxStock: 500, location: 'Supply Room B', supplier: 'ArtThreads India', costPerUnit: 650, lastUpdated: '2026-03-08' },
  { id: 'inv10', name: 'Silk Fabric (Premium)', category: 'Fabric', sku: 'FAB-SLK-004', quantity: 800, unit: 'meters', minStock: 500, maxStock: 3000, location: 'Warehouse A - Shelf 8', supplier: 'Kanchipuram Silks', costPerUnit: 950, lastUpdated: '2026-03-09' },
  { id: 'inv11', name: 'Iron-on Labels', category: 'Labels', sku: 'LBL-IRN-001', quantity: 25000, unit: 'pieces', minStock: 10000, maxStock: 50000, location: 'Storage D - Bin 1', supplier: 'LabelTech Chennai', costPerUnit: 3, lastUpdated: '2026-03-06' },
  { id: 'inv12', name: 'Packing Boxes (Medium)', category: 'Packaging', sku: 'PKG-BOX-001', quantity: 1200, unit: 'pieces', minStock: 500, maxStock: 3000, location: 'Packaging Area', supplier: 'BoxWorld India', costPerUnit: 35, lastUpdated: '2026-03-08' },
  { id: 'inv13', name: 'Grey Jersey Knit', category: 'Fabric', sku: 'FAB-JKN-005', quantity: 3500, unit: 'meters', minStock: 2000, maxStock: 8000, location: 'Warehouse A - Shelf 2', supplier: 'Tirupur Knit Mills', costPerUnit: 180, lastUpdated: '2026-03-07' },
  { id: 'inv14', name: 'Shoulder Pads', category: 'Accessories', sku: 'ACC-SHP-002', quantity: 280, unit: 'pairs', minStock: 300, maxStock: 1500, location: 'Storage C - Bin 9', supplier: 'TailoringSupplies India', costPerUnit: 55, lastUpdated: '2026-03-05' },
  { id: 'inv15', name: 'Hang Tags', category: 'Labels', sku: 'LBL-HNG-002', quantity: 18000, unit: 'pieces', minStock: 5000, maxStock: 30000, location: 'Storage D - Bin 3', supplier: 'LabelTech Chennai', costPerUnit: 5, lastUpdated: '2026-03-09' },
];

// ---- PRODUCTION LINES ----
export const productionLines: ProductionLine[] = [
  { id: 'pl1', orderId: 'o1', orderNumber: 'ORD-2026-001', product: 'Classic White T-Shirt', stage: 'Sewing', progress: 65, startDate: '2026-02-20', endDate: '2026-03-20', assignedWorkers: ['w1', 'w2', 'w3'], machineId: 'm1', status: 'Active', targetQty: 5000, completedQty: 3250, notes: 'On schedule' },
  { id: 'pl2', orderId: 'o2', orderNumber: 'ORD-2026-002', product: 'Slim Fit Jeans', stage: 'QC', progress: 90, startDate: '2026-02-22', endDate: '2026-03-25', assignedWorkers: ['w4', 'w5'], machineId: 'm3', status: 'Active', targetQty: 3000, completedQty: 2700, notes: 'Moving to QC review' },
  { id: 'pl3', orderId: 'o4', orderNumber: 'ORD-2026-004', product: 'Men\'s Polo Shirt', stage: 'Finishing', progress: 78, startDate: '2026-02-25', endDate: '2026-03-18', assignedWorkers: ['w6', 'w7', 'w8'], machineId: 'm2', status: 'Delayed', targetQty: 4000, completedQty: 3120, notes: 'Slightly behind schedule' },
  { id: 'pl4', orderId: 'o5', orderNumber: 'ORD-2026-005', product: 'Athletic Hoodie', stage: 'Packaging', progress: 100, startDate: '2026-02-05', endDate: '2026-03-10', assignedWorkers: ['w9', 'w10'], machineId: 'm4', status: 'Completed', targetQty: 6000, completedQty: 6000, notes: 'Completed on time' },
  { id: 'pl5', orderId: 'o7', orderNumber: 'ORD-2026-007', product: 'Kurta Set', stage: 'Cutting', progress: 35, startDate: '2026-03-05', endDate: '2026-03-28', assignedWorkers: ['w11', 'w12', 'w13', 'w14'], machineId: 'm5', status: 'Active', targetQty: 8000, completedQty: 2800, notes: 'Embroidery department at capacity' },
  { id: 'pl6', orderId: 'o6', orderNumber: 'ORD-2026-006', product: 'Women\'s Blazer', stage: 'Sewing', progress: 42, startDate: '2026-03-01', endDate: '2026-04-10', assignedWorkers: ['w15', 'w16'], machineId: 'm6', status: 'Active', targetQty: 1500, completedQty: 630, notes: 'Structured pieces require extra care' },
  { id: 'pl7', orderId: 'o11', orderNumber: 'ORD-2026-011', product: 'Chiffon Blouse', stage: 'Sewing', progress: 58, startDate: '2026-03-02', endDate: '2026-03-22', assignedWorkers: ['w1', 'w17'], machineId: 'm7', status: 'Delayed', targetQty: 4000, completedQty: 2320, notes: 'Delicate fabric causing slowdowns' },
  { id: 'pl8', orderId: 'o12', orderNumber: 'ORD-2026-012', product: 'Track Pants', stage: 'QC', progress: 88, startDate: '2026-03-08', endDate: '2026-03-30', assignedWorkers: ['w4', 'w18'], machineId: 'm8', status: 'Active', targetQty: 5000, completedQty: 4400, notes: 'QC in progress' },
];

// ---- WORKERS ----
export const workers: Worker[] = [
  { id: 'w1', employeeId: 'EMP-001', name: 'Karthik Rajan', email: 'karthik@akashgarments.com', phone: '+91-98765-43210', department: 'Sewing', role: 'Senior Tailor', shift: 'Morning', status: 'On Duty', efficiency: 94, tasksCompleted: 342, joinDate: '2020-03-15' },
  { id: 'w2', employeeId: 'EMP-002', name: 'Priya Devi', email: 'priya.d@akashgarments.com', phone: '+91-98765-43211', department: 'Sewing', role: 'Tailor', shift: 'Morning', status: 'On Duty', efficiency: 88, tasksCompleted: 287, joinDate: '2021-06-20' },
  { id: 'w3', employeeId: 'EMP-003', name: 'Mohan Sundaram', email: 'mohan@akashgarments.com', phone: '+91-98765-43212', department: 'Sewing', role: 'Tailor', shift: 'Afternoon', status: 'On Duty', efficiency: 91, tasksCompleted: 315, joinDate: '2021-04-10' },
  { id: 'w4', employeeId: 'EMP-004', name: 'Lakshmi Narayan', email: 'lakshmi@akashgarments.com', phone: '+91-98765-43213', department: 'Cutting', role: 'Cutter', shift: 'Morning', status: 'On Duty', efficiency: 96, tasksCompleted: 401, joinDate: '2019-11-05' },
  { id: 'w5', employeeId: 'EMP-005', name: 'Senthil Kumar', email: 'senthil@akashgarments.com', phone: '+91-98765-43214', department: 'Cutting', role: 'Cutter', shift: 'Morning', status: 'On Duty', efficiency: 85, tasksCompleted: 256, joinDate: '2022-08-14' },
  { id: 'w6', employeeId: 'EMP-006', name: 'Anitha Rani', email: 'anitha@akashgarments.com', phone: '+91-98765-43215', department: 'Finishing', role: 'Finisher', shift: 'Afternoon', status: 'On Duty', efficiency: 89, tasksCompleted: 298, joinDate: '2021-09-30' },
  { id: 'w7', employeeId: 'EMP-007', name: 'Rajesh Menon', email: 'rajesh@akashgarments.com', phone: '+91-98765-43216', department: 'Finishing', role: 'Finisher', shift: 'Night', status: 'Off Duty', efficiency: 92, tasksCompleted: 334, joinDate: '2020-12-01' },
  { id: 'w8', employeeId: 'EMP-008', name: 'Deepa Krishnan', email: 'deepa@akashgarments.com', phone: '+91-98765-43217', department: 'Embroidery', role: 'Embroiderer', shift: 'Morning', status: 'On Duty', efficiency: 97, tasksCompleted: 445, joinDate: '2019-05-22' },
  { id: 'w9', employeeId: 'EMP-009', name: 'Vel Murugan', email: 'vel@akashgarments.com', phone: '+91-98765-43218', department: 'Packaging', role: 'Packer', shift: 'Morning', status: 'On Duty', efficiency: 83, tasksCompleted: 521, joinDate: '2023-02-10' },
  { id: 'w10', employeeId: 'EMP-010', name: 'Meena Kumari', email: 'meena@akashgarments.com', phone: '+91-98765-43219', department: 'Packaging', role: 'Packer', shift: 'Afternoon', status: 'On Leave', efficiency: 86, tasksCompleted: 382, joinDate: '2022-05-18' },
  { id: 'w11', employeeId: 'EMP-011', name: 'Suresh Babu', email: 'suresh@akashgarments.com', phone: '+91-98765-43220', department: 'Cutting', role: 'Senior Cutter', shift: 'Morning', status: 'On Duty', efficiency: 95, tasksCompleted: 378, joinDate: '2020-07-15' },
  { id: 'w12', employeeId: 'EMP-012', name: 'Kavitha Suresh', email: 'kavitha@akashgarments.com', phone: '+91-98765-43221', department: 'Sewing', role: 'Tailor', shift: 'Night', status: 'On Duty', efficiency: 87, tasksCompleted: 263, joinDate: '2023-01-25' },
  { id: 'w13', employeeId: 'EMP-013', name: 'Arun Prakash', email: 'arun@akashgarments.com', phone: '+91-98765-43222', department: 'Sewing', role: 'Tailor', shift: 'Morning', status: 'Absent', efficiency: 82, tasksCompleted: 198, joinDate: '2023-09-12' },
  { id: 'w14', employeeId: 'EMP-014', name: 'Revathi Sharma', email: 'revathi@akashgarments.com', phone: '+91-98765-43223', department: 'Embroidery', role: 'Embroiderer', shift: 'Afternoon', status: 'On Duty', efficiency: 93, tasksCompleted: 312, joinDate: '2021-11-08' },
  { id: 'w15', employeeId: 'EMP-015', name: 'Ganesh Iyer', email: 'ganesh@akashgarments.com', phone: '+91-98765-43224', department: 'Finishing', role: 'Finisher', shift: 'Night', status: 'On Duty', efficiency: 90, tasksCompleted: 289, joinDate: '2022-03-30' },
  { id: 'w16', employeeId: 'EMP-016', name: 'Divya Lakshmi', email: 'divya@akashgarments.com', phone: '+91-98765-43225', department: 'Sewing', role: 'Senior Tailor', shift: 'Morning', status: 'On Duty', efficiency: 98, tasksCompleted: 467, joinDate: '2019-08-20' },
  { id: 'w17', employeeId: 'EMP-017', name: 'Balaji Nair', email: 'balaji@akashgarments.com', phone: '+91-98765-43226', department: 'Cutting', role: 'Cutter', shift: 'Afternoon', status: 'On Duty', efficiency: 84, tasksCompleted: 231, joinDate: '2023-06-14' },
  { id: 'w18', employeeId: 'EMP-018', name: 'Uma Maheshwari', email: 'uma@akashgarments.com', phone: '+91-98765-43227', department: 'Finishing', role: 'Finisher', shift: 'Morning', status: 'On Duty', efficiency: 91, tasksCompleted: 345, joinDate: '2021-02-28' },
];

// ---- QC RECORDS ----
export const qcRecords: QCRecord[] = [
  { id: 'qc1', orderId: 'o2', orderNumber: 'ORD-2026-002', productName: 'Slim Fit Jeans', inspector: 'David Park', date: '2026-03-09', status: 'Passed', totalInspected: 500, defectsFound: 12, defectType: 'Minor Stitching', severity: 'Low', notes: 'Within acceptable range', resolved: true },
  { id: 'qc2', orderId: 'o4', orderNumber: 'ORD-2026-004', productName: 'Men\'s Polo Shirt', inspector: 'Lisa Torres', date: '2026-03-08', status: 'Failed', totalInspected: 300, defectsFound: 45, defectType: 'Logo Alignment', severity: 'High', notes: 'Logo embroidery off-center on 15% of units', resolved: false },
  { id: 'qc3', orderId: 'o5', orderNumber: 'ORD-2026-005', productName: 'Athletic Hoodie', inspector: 'David Park', date: '2026-03-09', status: 'Passed', totalInspected: 1000, defectsFound: 8, defectType: 'Color Variation', severity: 'Low', notes: 'Excellent quality batch', resolved: true },
  { id: 'qc4', orderId: 'o1', orderNumber: 'ORD-2026-001', productName: 'Classic White T-Shirt', inspector: 'Lisa Torres', date: '2026-03-07', status: 'Under Review', totalInspected: 400, defectsFound: 28, defectType: 'Fabric Pilling', severity: 'Medium', notes: 'Reviewing fabric batch quality', resolved: false },
  { id: 'qc5', orderId: 'o12', orderNumber: 'ORD-2026-012', productName: 'Track Pants', inspector: 'David Park', date: '2026-03-10', status: 'Rework Required', totalInspected: 600, defectsFound: 72, defectType: 'Elastic Defect', severity: 'High', notes: 'Elastic not meeting tension specifications', resolved: false },
  { id: 'qc6', orderId: 'o7', orderNumber: 'ORD-2026-007', productName: 'Kurta Set', inspector: 'Lisa Torres', date: '2026-03-06', status: 'Passed', totalInspected: 250, defectsFound: 5, defectType: 'Minor Stitching', severity: 'Low', notes: 'High quality embroidery work', resolved: true },
  { id: 'qc7', orderId: 'o11', orderNumber: 'ORD-2026-011', productName: 'Chiffon Blouse', inspector: 'David Park', date: '2026-03-08', status: 'Failed', totalInspected: 300, defectsFound: 58, defectType: 'Seam Puckering', severity: 'Critical', notes: 'Delicate fabric handling issue — return to sewing', resolved: false },
  { id: 'qc8', orderId: 'o6', orderNumber: 'ORD-2026-006', productName: 'Women\'s Blazer', inspector: 'Lisa Torres', date: '2026-03-09', status: 'Passed', totalInspected: 100, defectsFound: 3, defectType: 'Button Placement', severity: 'Low', notes: 'Exceptional craftsmanship', resolved: true },
];

// ---- MACHINES ----
export const machines: Machine[] = [
  { id: 'm1', name: 'Industrial Sewing Machine A1', type: 'Sewing', status: 'Running', efficiency: 92, operatingHours: 4280, lastMaintenance: '2026-02-15', nextMaintenance: '2026-03-15', operator: 'Ahmed Hassan', location: 'Hall A - Row 1', model: 'JUKI DDL-9000C', manufacturer: 'JUKI', serialNumber: 'SN-M1-20200315' },
  { id: 'm2', name: 'Industrial Sewing Machine A2', type: 'Sewing', status: 'Running', efficiency: 88, operatingHours: 3950, lastMaintenance: '2026-02-20', nextMaintenance: '2026-03-20', operator: 'Maria Santos', location: 'Hall A - Row 2', model: 'JUKI DDL-9000C', manufacturer: 'JUKI', serialNumber: 'SN-M2-20200315' },
  { id: 'm3', name: 'Automated Cutting Machine C1', type: 'Cutting', status: 'Running', efficiency: 97, operatingHours: 2100, lastMaintenance: '2026-02-28', nextMaintenance: '2026-03-28', operator: 'Yuki Tanaka', location: 'Hall B - Station 1', model: 'Gerber Paragon', manufacturer: 'Gerber Technology', serialNumber: 'SN-C1-20210601' },
  { id: 'm4', name: 'Overlock Machine O1', type: 'Overlock', status: 'Idle', efficiency: 79, operatingHours: 5600, lastMaintenance: '2026-01-10', nextMaintenance: '2026-03-10', operator: 'Liu Wei', location: 'Hall A - Row 5', model: 'Brother MA4-B551', manufacturer: 'Brother', serialNumber: 'SN-O1-20190801' },
  { id: 'm5', name: 'Embroidery Machine E1', type: 'Embroidery', status: 'Running', efficiency: 94, operatingHours: 1890, lastMaintenance: '2026-03-01', nextMaintenance: '2026-04-01', operator: 'Elena Popescu', location: 'Hall C - Row 1', model: 'Tajima TMEX-C', manufacturer: 'Tajima', serialNumber: 'SN-E1-20220301' },
  { id: 'm6', name: 'Heat Press Machine H1', type: 'Heat Press', status: 'Maintenance', efficiency: 0, operatingHours: 3200, lastMaintenance: '2026-03-09', nextMaintenance: '2026-04-09', operator: 'Amara Diallo', location: 'Hall D - Station 2', model: 'Hotronix Fusion IQ', manufacturer: 'Stahls', serialNumber: 'SN-H1-20210101' },
  { id: 'm7', name: 'Industrial Sewing Machine B1', type: 'Sewing', status: 'Running', efficiency: 86, operatingHours: 2780, lastMaintenance: '2026-02-10', nextMaintenance: '2026-03-10', operator: 'Sophia Klein', location: 'Hall A - Row 8', model: 'Singer 4423', manufacturer: 'Singer', serialNumber: 'SN-M7-20210815' },
  { id: 'm8', name: 'Washing Machine W1', type: 'Washing', status: 'Running', efficiency: 91, operatingHours: 1560, lastMaintenance: '2026-03-05', nextMaintenance: '2026-04-05', operator: 'Carlos Rivera', location: 'Hall E - Bay 1', model: 'Ramsons RWT-100', manufacturer: 'Ramsons', serialNumber: 'SN-W1-20230101' },
  { id: 'm9', name: 'Automated Cutting Machine C2', type: 'Cutting', status: 'Breakdown', efficiency: 0, operatingHours: 4100, lastMaintenance: '2026-01-20', nextMaintenance: '2026-02-20', operator: 'Kenji Mori', location: 'Hall B - Station 3', model: 'Gerber Paragon', manufacturer: 'Gerber Technology', serialNumber: 'SN-C2-20200901' },
  { id: 'm10', name: 'Button Attaching Machine BA1', type: 'Button Attach', status: 'Running', efficiency: 98, operatingHours: 890, lastMaintenance: '2026-03-08', nextMaintenance: '2026-04-08', operator: 'Nadia Volkov', location: 'Hall D - Row 3', model: 'Yamato BA-B', manufacturer: 'Yamato', serialNumber: 'SN-BA1-20240101' },
  { id: 'm11', name: 'Steam Iron Press SP1', type: 'Steam Press', status: 'Idle', efficiency: 75, operatingHours: 3450, lastMaintenance: '2026-02-01', nextMaintenance: '2026-03-01', operator: 'Tomas Novak', location: 'Hall D - Bay 2', model: 'Sussman SSP-110', manufacturer: 'Sussman', serialNumber: 'SN-SP1-20200201' },
  { id: 'm12', name: 'Printing Machine P1', type: 'Screen Printing', status: 'Running', efficiency: 90, operatingHours: 1200, lastMaintenance: '2026-03-07', nextMaintenance: '2026-04-07', operator: 'Raj Sharma', location: 'Hall F - Station 1', model: 'M&R Chameleon', manufacturer: 'M&R', serialNumber: 'SN-P1-20230601' },
];

// ---- SHIPMENTS ----
export const shipments: Shipment[] = [
  { id: 'sh1', orderId: 'o5', orderNumber: 'ORD-2026-005', customerId: 'c5', customerName: 'Tirupur Export House', destination: 'Tirupur, Tamil Nadu', carrier: 'Delhivery', trackingNumber: 'DLV-78452319', status: 'In Transit', weight: 420, shippedDate: '2026-03-10', estimatedDelivery: '2026-03-14', actualDelivery: '', notes: 'Fragile — handle with care' },
  { id: 'sh2', orderId: 'o2', orderNumber: 'ORD-2026-002', customerId: 'c2', customerName: 'Coimbatore Textile Hub', destination: 'Coimbatore, Tamil Nadu', carrier: 'Blue Dart', trackingNumber: 'BD-12398745', status: 'Preparing', weight: 180, shippedDate: '', estimatedDelivery: '2026-03-28', actualDelivery: '', notes: 'Awaiting QC clearance' },
  { id: 'sh3', orderId: 'o9', orderNumber: 'ORD-2026-009', customerId: 'c1', customerName: 'Lakshmi Silks & Fashions', destination: 'Chennai, Tamil Nadu', carrier: 'DTDC', trackingNumber: 'DT-45612378', status: 'Returned', weight: 220, shippedDate: '2026-03-05', estimatedDelivery: '2026-03-07', actualDelivery: '2026-03-07', notes: 'Order cancelled — return to warehouse' },
  { id: 'sh4', orderId: 'o3', orderNumber: 'ORD-2026-003', customerId: 'c3', customerName: 'Salem Garment Exports', destination: 'Salem, Tamil Nadu', carrier: 'Professional Couriers', trackingNumber: 'PC-99123456', status: 'Preparing', weight: 145, shippedDate: '', estimatedDelivery: '2026-04-05', actualDelivery: '', notes: 'Road freight' },
  { id: 'sh5', orderId: 'o7', orderNumber: 'ORD-2026-007', customerId: 'c7', customerName: 'Chennai Garment Mall', destination: 'Chennai, Tamil Nadu', carrier: 'Shadowfax', trackingNumber: 'SF-78901234', status: 'Preparing', weight: 380, shippedDate: '', estimatedDelivery: '2026-03-30', actualDelivery: '', notes: 'Express delivery requested' },
];

// ---- CHART DATA ----
export const productionTrendData = [
  { month: 'Sep', units: 18400, target: 20000 },
  { month: 'Oct', units: 21200, target: 20000 },
  { month: 'Nov', units: 19800, target: 21000 },
  { month: 'Dec', units: 22500, target: 21000 },
  { month: 'Jan', units: 20100, target: 22000 },
  { month: 'Feb', units: 23800, target: 22000 },
  { month: 'Mar', units: 16200, target: 24000 },
];

export const orderStatusData = [
  { status: 'Completed', count: 34, color: '#10b981' },
  { status: 'In Progress', count: 28, color: '#3b82f6' },
  { status: 'Pending', count: 18, color: '#f59e0b' },
  { status: 'QC Review', count: 12, color: '#8b5cf6' },
  { status: 'On Hold', count: 8, color: '#6b7280' },
  { status: 'Cancelled', count: 5, color: '#ef4444' },
];

export const qualityTrendData = [
  { week: 'W36', passRate: 94, defectRate: 6 },
  { week: 'W37', passRate: 96, defectRate: 4 },
  { week: 'W38', passRate: 92, defectRate: 8 },
  { week: 'W39', passRate: 97, defectRate: 3 },
  { week: 'W40', passRate: 95, defectRate: 5 },
  { week: 'W41', passRate: 98, defectRate: 2 },
  { week: 'W42', passRate: 91, defectRate: 9 },
  { week: 'W43', passRate: 93, defectRate: 7 },
];

export const departmentOutputData = [
  { dept: 'Cutting', output: 9200, capacity: 10000 },
  { dept: 'Sewing', output: 7800, capacity: 9000 },
  { dept: 'Finishing', output: 6500, capacity: 8000 },
  { dept: 'Embroidery', output: 3200, capacity: 4000 },
  { dept: 'Packaging', output: 8900, capacity: 10000 },
];

// ---- AI INSIGHTS (computed from mock data) ----
export interface AIInsight {
  id: string; type: 'warning' | 'danger' | 'info' | 'success';
  category: string; title: string; description: string;
  confidence: number; action: string;
}

export const aiInsights: AIInsight[] = [
  { id: 'ai1', type: 'danger', category: 'Production Delay', title: 'ORD-2026-004 At High Risk', description: 'Polo Shirt order is 22% behind schedule. At current rate, deadline of Mar 18 will be missed by ~2 days.', confidence: 87, action: 'Reassign 3 workers from Packaging line' },
  { id: 'ai2', type: 'warning', category: 'Machine Failure', title: 'Machine C2 Breakdown Detected', description: 'Cutting Machine C2 is down. Overdue maintenance by 18 days. Expected repair: 2–3 days.', confidence: 94, action: 'Schedule emergency maintenance immediately' },
  { id: 'ai3', type: 'warning', category: 'Inventory Alert', title: 'Low Stock: 4 Critical Items', description: 'White Polyester Thread, Elastic Band, Shoulder Pads, and Blue Denim are below minimum thresholds.', confidence: 99, action: 'Place emergency purchase order' },
  { id: 'ai4', type: 'info', category: 'Quality Trend', title: 'Chiffon Blouse Defect Spike', description: 'Seam puckering defect rate is 19.3% on Blouse line — 4× above average. Pattern suggests needle pressure issue.', confidence: 82, action: 'Calibrate sewing machines M7 & M2' },
  { id: 'ai5', type: 'success', category: 'Inventory Forecast', title: 'Optimal Stock for Q2 Planning', description: 'Based on Q2 orders pipeline, recommend purchasing 12,000m cotton fabric and 8,000m jersey knit by Apr 1.', confidence: 78, action: 'Generate purchase order for Q2' },
];

// ---- ACTIVITY FEED ----
export interface Activity {
  id: string; user: string; action: string; target: string;
  timestamp: string; type: 'order' | 'production' | 'qc' | 'shipment' | 'inventory' | 'machine';
}

export const recentActivity: Activity[] = [
  { id: 'act1', user: 'David Park', action: 'completed QC inspection for', target: 'ORD-2026-012 (Track Pants)', timestamp: '2026-03-10T09:45:00', type: 'qc' },
  { id: 'act2', user: 'Michael Chen', action: 'advanced production stage for', target: 'ORD-2026-001 to Sewing', timestamp: '2026-03-10T09:30:00', type: 'production' },
  { id: 'act3', user: 'Admin User', action: 'created new order', target: 'ORD-2026-012', timestamp: '2026-03-10T09:15:00', type: 'order' },
  { id: 'act4', user: 'Lisa Torres', action: 'flagged quality issue on', target: 'ORD-2026-004 (Polo Shirt)', timestamp: '2026-03-10T08:55:00', type: 'qc' },
  { id: 'act5', user: 'Priya Patel', action: 'dispatched shipment for', target: 'ORD-2026-005 to Sydney', timestamp: '2026-03-10T08:40:00', type: 'shipment' },
  { id: 'act6', user: 'Admin User', action: 'updated inventory for', target: 'Blue Denim Fabric (-200m)', timestamp: '2026-03-10T08:20:00', type: 'inventory' },
];
