import { Branch, Role, User, UserRole, Address } from "../models";

/**
 * Seeds branches, addresses, and assigns roles to them.
 * Automatically links Admin to all branches, others to one.
 */
export async function seedBranchRoles() {
  console.log("🌱 Seeding branches & role assignments...");

  // === 1. Ensure branches exist ===
  const branchCount = await Branch.count();
  if (branchCount === 0) {
    const address1 = await Address.create({
      governorate: "Cairo",
      area: "Nasr City",
      street: "El Tayaran Street",
    });

    const address2 = await Address.create({
      governorate: "Alexandria",
      area: "Smouha",
      street: "Victory Avenue",
    });

    await Branch.bulkCreate([
      { name: "Head Office", phone: "+201000000001", address_id: address1.id },
      { name: "Alex Branch", phone: "+201000000002", address_id: address2.id },
    ]);

    console.log("✅ Default branches created.");
  }

  const branches = await Branch.findAll();

  // === 2. Ensure roles exist ===
  const roles = await Role.findAll();
  if (!roles.length) {
    throw new Error(
      "❌ Roles not found. Please seed roles before branch roles."
    );
  }

  const adminRole = roles.find((r) => r.name === "Admin");
  const managerRole = roles.find((r) => r.name === "Manager");
  const cashierRole = roles.find((r) => r.name === "Cashier");

  // === 3. Ensure an Admin user exists ===
  const adminUser = await User.findOne({
    where: { email: "admin@example.com" },
  });
  if (!adminUser) {
    console.log("⚠️ Admin user not found — please run admin seeder first.");
    return;
  }

  // === 4. Assign Admin role globally (no branchId) ===
  const existingGlobalAdmin = await UserRole.findOne({
    where: {
      userId: adminUser.id,
      roleId: adminRole?.id || null,
      branchId: null,
    },
  });

  if (!existingGlobalAdmin && adminRole) {
    await UserRole.create({
      userId: adminUser.id,
      roleId: adminRole.id,
      branchId: null,
    });
    console.log("✅ Admin assigned globally (no branchId).");
  }

  // === 5. Assign Managers and Cashiers to specific branches (demo) ===
  const users = await User.findAll({ where: { id: { $ne: adminUser.id } } });

  for (const branch of branches) {
    for (const user of users) {
      const randomRole = Math.random() > 0.5 ? managerRole : cashierRole;

      if (!randomRole) continue;

      const exists = await UserRole.findOne({
        where: { userId: user.id, branchId: branch.id, roleId: randomRole.id },
      });

      if (!exists) {
        await UserRole.create({
          userId: user.id,
          branchId: branch.id,
          roleId: randomRole.id,
        });
        console.log(
          `→ Assigned ${user.name} as ${randomRole.name} to ${branch.name}`
        );
      }
    }
  }

  console.log("✅ Branch-role assignments complete.");
}
