// ─── Auth & User Types ───────────────────────────────────────────────────────────────
export type Role = "super_admin" | "zonal_manager" | "branch_manager" | "staff";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  zoneId?: string;
  branchId?: string;
  designation: string;
  avatar: string;
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  roles: Role[];
}

// ─── Organization ──────────────────────────────────────────────────────────────────
export interface Zone {
  id: string;
  name: string;
  managerId: string;
  branchCount: number;
  totalRevenue: number;
  totalCustomers: number;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  zoneId: string;
  managerId: string;
  address: string;
  phone: string;
  employeeCount: number;
  customerCount: number;
  monthlyCollection: number;
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

// ─── Employee ─────────────────────────────────────────────────────────────────────
export type EmployeeStatus = "active" | "inactive" | "on_leave" | "transferred";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  zoneId: string;
  branchId: string;
  designation: string;
  hireDate: string;
  status: EmployeeStatus;
  performanceScore: number;
  avatar: string;
  salaryGrade: string;
}

// ─── Customer ─────────────────────────────────────────────────────────────────────
export type CustomerStatus = "active" | "inactive" | "overdue" | "closed";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  occupation: string;
  branchId: string;
  zoneId: string;
  assignedStaffId: string;
  loanAmount: number;
  emiAmount: number;
  outstandingAmount: number;
  riskLevel: RiskLevel;
  status: CustomerStatus;
  kycVerified: boolean;
  aadhaarNumber: string;
  panNumber: string;
  createdAt: string;
  lastPaymentDate: string;
  nextDueDate: string;
  paymentHistory: Payment[];
}

// ─── Payment & EMI ─────────────────────────────────────────────────────────────
export type PaymentMethod =
  | "cash"
  | "bank_transfer"
  | "upi"
  | "cheque"
  | "neft"
  | "rtgs";
export type PaymentStatus = "completed" | "pending" | "failed" | "bounced";

export interface Payment {
  id: string;
  customerId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string;
  collectedBy: string;
}

export interface EMISchedule {
  id: string;
  customerId: string;
  installmentNo: number;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paidDate: string | null;
  paidAmount: number | null;
}

// ─── Notifications ───────────────────────────────────────────────────────────────
export type NotificationType =
  | "payment_due"
  | "overdue_alert"
  | "transfer_request"
  | "transfer_approval"
  | "attendance_missing"
  | "target_achieved"
  | "new_customer"
  | "leave_request"
  | "kyc_pending"
  | "birthday_reminder"
  | "system_alert"
  | "memo"
  | "program"
  | "event"
  | "marketing_notice";

export type NotificationPriority = "low" | "medium" | "high" | "critical";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  isRead: boolean;
  createdAt: string;
  priority: NotificationPriority;
}

// ─── Attendance & Leave ──────────────────────────────────────────────────────────
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: "present" | "absent" | "late" | "weekend" | "holiday";
  location: string;
  notes: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: "casual" | "sick" | "annual" | "maternity" | "paternity";
  fromDate: string;
  toDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy: string | null;
  createdAt: string;
}

// ─── Transfers ────────────────────────────────────────────────────────────────────
export type TransferStatus = "pending" | "approved" | "rejected" | "completed";

export interface Transfer {
  id: string;
  employeeId: string;
  fromBranchId: string;
  toBranchId: string;
  requestedBy: string;
  approvedBy: string | null;
  status: TransferStatus;
  reason: string;
  requestedAt: string;
  processedAt: string | null;
}

// ─── Activity Log ─────────────────────────────────────────────────────────────────
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
  createdAt: string;
}

// ─── Chart & Analytics Data ───────────────────────────────────────────────────────
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ZoneRevenue {
  month: string;
  kochi: number;
  thrissur: number;
  calicut: number;
  trivandrum: number;
}

export interface CollectionData {
  date: string;
  collected: number;
  target: number;
  pending: number;
}

export interface BranchRevenue {
  branchName: string;
  revenue: number;
  target: number;
  achievement: number;
}

export interface KPICard {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend: "up" | "down" | "neutral";
  trendValue?: number;
  icon: string;
  iconColor?: string;
}

// ─── Generic API Wrapper ──────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
