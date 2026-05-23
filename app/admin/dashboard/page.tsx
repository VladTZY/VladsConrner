import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return <AdminDashboardClient />;
}
