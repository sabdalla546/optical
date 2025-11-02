import bcrypt from "bcrypt";
import { Role, Permission, User, UserRole } from "../models";

export async function seedDefaultAdmin() {
  const userCount = await User.count();
  if (userCount > 0) return; // already seeded

  console.log("🪄 Seeding default admin user...");

  // 1️⃣ Create role
  const role = await Role.create({
    name: "SuperAdmin",
    description: "Full system access",
  });

  // 2️⃣ Create permissions
  const basePermissions = ["manage_users", "manage_roles", "manage_inventory"];
  const perms = await Promise.all(
    basePermissions.map((p) => Permission.create({ name: p }))
  );

  // 3️⃣ Link role ↔ permissions
  await role.$add("permissions", perms);

  // 4️⃣ Create admin user
  const password_hash = await bcrypt.hash("admin123", 10);
  const admin = await User.create({
    name: "System Admin",
    phone: "+201000000000",
    email: "admin@example.com",
    password_hash,
    is_active: true,
  });

  // 5️⃣ Assign role
  await UserRole.create({
    userId: admin.id,
    roleId: role.id,
  });

  console.log("✅ Default admin created:");
  console.log("Email:", admin.email);
  console.log("Password: admin123");
}
