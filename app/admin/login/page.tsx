import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminLoginClient from "./AdminLoginClient";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin/dashboard");
  }

  return <AdminLoginClient />;
}
