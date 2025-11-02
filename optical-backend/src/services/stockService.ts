import Stock from "../models/stock";
import StockMovement from "../models/stockMovement";
import Product from "../models/product";
import { Sequelize } from "sequelize";

/**
 * Helper to find or create stock record
 */
async function findOrCreateStock(branchId: number, productId: number) {
  const [stock] = await Stock.findOrCreate({
    where: { branchId, productId },
    defaults: { branchId, productId, quantity: 0, avgCost: 0, lastCost: null },
  });
  return stock;
}

/**
 * Receive stock: increase quantity and recalc avg cost
 */
export async function receiveStock({
  branchId,
  productId,
  quantity,
  unitCost,
  createdBy,
  reference,
}: {
  branchId: number;
  productId: number;
  quantity: number;
  unitCost: number;
  createdBy?: number | null;
  reference?: string | null;
}) {
  const sequelize = Stock.sequelize as Sequelize;
  const t = await sequelize.transaction();
  try {
    const stock = await findOrCreateStock(branchId, productId);

    // current values
    const currentQty = Number(stock.getDataValue("quantity"));
    const currentAvg = Number(stock.getDataValue("avgCost")) || 0;

    const incomingQty = quantity;
    const incomingCost = Number(unitCost);

    // avg cost calculation (weighted average)
    const totalCostExisting = currentQty * currentAvg;
    const totalCostIncoming = incomingQty * incomingCost;
    const newQty = currentQty + incomingQty;
    const newAvg =
      newQty === 0 ? 0 : (totalCostExisting + totalCostIncoming) / newQty;

    stock.set("quantity", newQty);
    stock.set("avgCost", newAvg);
    stock.set("lastCost", incomingCost);
    await stock.save({ transaction: t });

    await StockMovement.create(
      {
        stockId: stock.id,
        branchId,
        productId,
        change: incomingQty,
        cost: incomingCost,
        type: "receive",
        reference: reference || null,
        createdBy: createdBy || null,
      },
      { transaction: t }
    );

    await t.commit();
    return stock;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * Adjust stock manually (positive or negative). If positive and unitCost provided, recalc avg cost.
 */
export async function adjustStock({
  branchId,
  productId,
  change,
  unitCost,
  createdBy,
  reason,
}: {
  branchId: number;
  productId: number;
  change: number;
  unitCost?: number | null;
  createdBy?: number | null;
  reason?: string | null;
}) {
  const sequelize = Stock.sequelize as Sequelize;
  const t = await sequelize.transaction();
  try {
    const stock = await findOrCreateStock(branchId, productId);

    const currentQty = Number(stock.getDataValue("quantity"));
    const currentAvg = Number(stock.getDataValue("avgCost")) || 0;

    let newQty = currentQty + change;
    if (newQty < 0) throw new Error("Stock cannot be negative");

    let newAvg = currentAvg;
    if (change > 0 && unitCost) {
      // weighted average
      const totalCostExisting = currentQty * currentAvg;
      const totalCostIncoming = change * unitCost;
      newAvg = (totalCostExisting + totalCostIncoming) / (currentQty + change);
      stock.set("lastCost", unitCost);
    }

    stock.set("quantity", newQty);
    stock.set("avgCost", newAvg);
    await stock.save({ transaction: t });

    await StockMovement.create(
      {
        stockId: stock.id,
        branchId,
        productId,
        change,
        cost: unitCost || null,
        type: "adjust",
        reference: reason || null,
        createdBy: createdBy || null,
      },
      { transaction: t }
    );

    await t.commit();
    return stock;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * Transfer stock between branches
 */
export async function transferStock({
  productId,
  fromBranchId,
  toBranchId,
  quantity,
  createdBy,
  reference,
}: {
  productId: number;
  fromBranchId: number;
  toBranchId: number;
  quantity: number;
  createdBy?: number | null;
  reference?: string | null;
}) {
  const sequelize = Stock.sequelize as Sequelize;
  const t = await sequelize.transaction();
  try {
    // debit from source
    const fromStock = await findOrCreateStock(fromBranchId, productId);
    const currentQty = Number(fromStock.getDataValue("quantity"));
    if (currentQty < quantity)
      throw new Error("Not enough stock in source branch");

    fromStock.set("quantity", currentQty - quantity);
    await fromStock.save({ transaction: t });

    await StockMovement.create(
      {
        stockId: fromStock.id,
        branchId: fromBranchId,
        productId,
        change: -quantity,
        cost: Number(fromStock.getDataValue("avgCost")) || null,
        type: "transfer_out",
        reference: reference || null,
        createdBy: createdBy || null,
      },
      { transaction: t }
    );

    // credit to destination (use source avg cost)
    const destStock = await findOrCreateStock(toBranchId, productId);
    const destQty = Number(destStock.getDataValue("quantity"));
    const destAvg = Number(destStock.getDataValue("avgCost")) || 0;

    const sourceAvg = Number(fromStock.getDataValue("avgCost")) || 0;
    const newQty = destQty + quantity;
    const newAvg =
      newQty === 0 ? 0 : (destQty * destAvg + quantity * sourceAvg) / newQty;

    destStock.set("quantity", newQty);
    destStock.set("avgCost", newAvg);
    await destStock.save({ transaction: t });

    await StockMovement.create(
      {
        stockId: destStock.id,
        branchId: toBranchId,
        productId,
        change: quantity,
        cost: sourceAvg || null,
        type: "transfer_in",
        reference: reference || null,
        createdBy: createdBy || null,
      },
      { transaction: t }
    );

    await t.commit();
    return { fromStock, destStock };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * List stock for branch
 */
export async function listStockForBranch(branchId: number) {
  return Stock.findAll({
    where: { branchId },
    include: [{ model: Product, as: "product" }],
  });
}

/**
 * Get single stock
 */
export async function getStock(branchId: number, productId: number) {
  return Stock.findOne({
    where: { branchId, productId },
    include: [{ model: Product, as: "product" }],
  });
}
