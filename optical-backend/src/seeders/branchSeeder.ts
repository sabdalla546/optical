import Branch from "../models/branch";
import Address from "../models/address";

export async function seedBranches() {
  const count = await Branch.count();
  if (count > 0) return;

  const addr = await Address.create({
    governorate: "Cairo",
    area: "Nasr City",
    street: "Main Street",
  });
  await Branch.create({
    name: "Head Office",
    phone: "+201000000001",
    address_id: addr.id,
    created_by: null,
  });

  console.log("✅ Seeded default branch");
}
