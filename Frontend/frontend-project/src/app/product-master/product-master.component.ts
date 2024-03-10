// src/app/product-master.component.ts

import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product.interface';

@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.css']
})
export class ProductMasterComponent implements OnInit {
  products: Product[] = [];
  newProductName = '';
  newCategoryId: number | undefined;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts()
      .subscribe((data: any[]) => {
        this.products = data;
      });
  }

  addProduct(): void {
    if (this.newProductName.trim() && this.newCategoryId) {
      this.productService.addProduct(this.newProductName, this.newCategoryId).subscribe(() => {
        this.loadProducts();
        this.newProductName = '';
        this.newCategoryId = undefined;
      });
    }
  }

  updateProduct(productId: number, newName: string, newCategoryId: number): void {
    if (newName.trim() && newCategoryId) {
      this.productService.updateProduct(productId, newName, newCategoryId).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.loadProducts();
    });
  }
}
