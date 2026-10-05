import type { Customer } from '@/types/customer';

// Mock customers. Emails use the reserved example.com domain; phone numbers are fictitious.
export const seedCustomers: Customer[] = [
  { id: 'cus-001', name: 'Ananya Reddy', email: 'ananya.reddy@example.com', phone: '9000000101', city: 'Hyderabad', createdAt: '2026-05-04T09:12:00.000Z' },
  { id: 'cus-002', name: 'Priya Raghavan', email: 'priya.raghavan@example.com', phone: '9000000102', city: 'Chennai', createdAt: '2026-05-18T11:40:00.000Z' },
  { id: 'cus-003', name: 'Meera Nair', email: 'meera.nair@example.com', phone: '9000000103', city: 'Kochi', createdAt: '2026-06-02T15:05:00.000Z' },
  { id: 'cus-004', name: 'Kavya Sharma', email: 'kavya.sharma@example.com', phone: '9000000104', city: 'Bengaluru', createdAt: '2026-06-16T10:22:00.000Z' },
  { id: 'cus-005', name: 'Lakshmi Prasanna', email: 'lakshmi.prasanna@example.com', phone: '9000000105', city: 'Vijayawada', createdAt: '2026-07-01T08:48:00.000Z' },
  { id: 'cus-006', name: 'Divya Iyer', email: 'divya.iyer@example.com', phone: '9000000106', city: 'Mumbai', createdAt: '2026-07-14T17:30:00.000Z' },
  { id: 'cus-007', name: 'Sneha Kulkarni', email: 'sneha.kulkarni@example.com', phone: '9000000107', city: 'Pune', createdAt: '2026-08-08T12:10:00.000Z' },
  { id: 'cus-008', name: 'Harini Subramanian', email: 'harini.s@example.com', phone: '9000000108', city: 'Coimbatore', createdAt: '2026-08-22T14:55:00.000Z' },
  { id: 'cus-009', name: 'Swathi Varma', email: 'swathi.varma@example.com', phone: '9000000109', city: 'Visakhapatnam', createdAt: '2026-09-03T10:00:00.000Z' },
  { id: 'cus-010', name: 'Aishwarya Rao', email: 'aishwarya.rao@example.com', phone: '9000000110', city: 'Mysuru', createdAt: '2026-09-11T16:20:00.000Z' },
];
