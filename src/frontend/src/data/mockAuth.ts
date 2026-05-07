import type { AuthUser } from "@/types";

export interface MockCredential {
  email: string;
  password: string;
  user: AuthUser;
}

export const mockCredentials: MockCredential[] = [
  {
    email: "admin@thirukochi.com",
    password: "Admin@123",
    user: {
      id: "e1",
      name: "Suresh Menon",
      email: "admin@thirukochi.com",
      role: "super_admin",
      zoneId: undefined,
      branchId: "b1",
      designation: "Managing Director",
      avatar: "",
      permissions: ["all"],
    },
  },
  {
    email: "zonal@thirukochi.com",
    password: "Admin@123",
    user: {
      id: "e5",
      name: "Priya Nair",
      email: "zonal@thirukochi.com",
      role: "zonal_manager",
      zoneId: "z2",
      branchId: "b4",
      designation: "Zonal Manager - Thrissur",
      avatar: "",
      permissions: [
        "view_zone",
        "view_branches",
        "manage_employees",
        "view_analytics",
        "manage_transfers",
      ],
    },
  },
  {
    email: "branch@thirukochi.com",
    password: "Admin@123",
    user: {
      id: "e14",
      name: "Rajesh Kumar",
      email: "branch@thirukochi.com",
      role: "branch_manager",
      zoneId: "z4",
      branchId: "b10",
      designation: "Branch Manager",
      avatar: "",
      permissions: [
        "view_branch",
        "manage_staff",
        "manage_customers",
        "view_analytics",
      ],
    },
  },
  {
    email: "staff@thirukochi.com",
    password: "Admin@123",
    user: {
      id: "e17",
      name: "Anjali Pillai",
      email: "staff@thirukochi.com",
      role: "staff",
      zoneId: "z1",
      branchId: "b1",
      designation: "Relationship Officer",
      avatar: "",
      permissions: ["view_customers", "collect_payments", "mark_attendance"],
    },
  },
];

export function validateCredentials(
  email: string,
  password: string,
): AuthUser | null {
  const match = mockCredentials.find(
    (c) =>
      c.email.toLowerCase() === email.toLowerCase() && c.password === password,
  );
  return match ? match.user : null;
}
