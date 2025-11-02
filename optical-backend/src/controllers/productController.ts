import { Request, Response } from "express";
import * as productService from "../services/productService";
import {
  createProductSchema,
  listProductsSchema,
} from "../validators/productValidators";

export async function createProduct(req: Request, res: Response) {
  try {
    const data = createProductSchema.parse(req.body);

    // Optionally validate subtype by type
    // you can add stricter zod checks here
    const p = await productService.createProduct(data);
    res.status(201).json(p);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const p = await productService.getProductWithSubtype(id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function listProducts(req: Request, res: Response) {
  try {
    const filter = listProductsSchema.parse(req.query);
    const list = await productService.listProducts(filter);
    res.json(list);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
