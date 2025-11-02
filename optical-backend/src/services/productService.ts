import Product from "../models/product";
import Frame from "../models/frame";
import Lens from "../models/lens";
import Accessory from "../models/accessory";
import Bag from "../models/bag";
import { Sequelize } from "sequelize";

export async function createProduct(payload: any) {
  // payload: { sku, name, type, brandId, companyId, defaultCost, subtype }
  const t = await (Product.sequelize as Sequelize).transaction();
  try {
    const p = await Product.create(
      {
        sku: payload.sku,
        name: payload.name,
        type: payload.type,
        brandId: payload.brandId || null,
        companyId: payload.companyId || null,
        defaultCost: payload.defaultCost || null,
      },
      { transaction: t }
    );

    if (payload.type === "frame" && payload.subtype) {
      await Frame.create(
        { productId: p.id, ...payload.subtype },
        { transaction: t }
      );
    } else if (payload.type === "lens" && payload.subtype) {
      await Lens.create(
        { productId: p.id, ...payload.subtype },
        { transaction: t }
      );
    } else if (payload.type === "accessory" && payload.subtype) {
      await Accessory.create(
        { productId: p.id, ...payload.subtype },
        { transaction: t }
      );
    } else if (payload.type === "bag" && payload.subtype) {
      await Bag.create(
        { productId: p.id, ...payload.subtype },
        { transaction: t }
      );
    }

    await t.commit();
    return p;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function getProductWithSubtype(id: number) {
  return Product.findByPk(id, {
    include: [
      { model: Frame, as: "frame" },
      { model: Lens, as: "lens" },
      { model: Accessory, as: "accessory" },
      { model: Bag, as: "bag" },
    ],
  });
}

export async function listProducts(filter: any = {}) {
  const where: any = {};
  if (filter.type) where.type = filter.type;
  if (filter.q) where.name = { [Sequelize.Op.like]: `%${filter.q}%` };
  return Product.findAll({
    where,
    include: [
      { model: Frame, as: "frame" },
      { model: Lens, as: "lens" },
      { model: Accessory, as: "accessory" },
      { model: Bag, as: "bag" },
    ],
    limit: filter.limit || 100,
    order: [["createdAt", "DESC"]],
  });
}
