import { Request, Response } from 'express';
import { DataService } from '../services/dataService';
import { Product } from '../models/Product';

const dataService = DataService.getInstance();

export const getAllProducts = (req: Request, res: Response) => {
  try {
    const products = dataService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const searchProducts = (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }
    const products = dataService.searchProducts(q);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error searching products' });
  }
};

export const getProductById = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = dataService.getProductById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

export const createProduct = (req: Request, res: Response) => {
  try {
    const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = req.body;
    const product = dataService.createProduct(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
};

export const updateProduct = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const productData: Partial<Product> = req.body;
    const product = dataService.updateProduct(id, productData);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

export const deleteProduct = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = dataService.deleteProduct(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
}; 