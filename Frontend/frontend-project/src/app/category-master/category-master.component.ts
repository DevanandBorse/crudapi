// category-master.component.ts

import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { Category } from '../category.interface';

@Component({
  selector: 'app-category-master',
  templateUrl: './category-master.component.html',
  styleUrls: ['./category-master.component.css']
})
export class CategoryMasterComponent implements OnInit {
  categories: Category[] = [];
  newCategoryName = '';

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories()
      .subscribe((data: any[]) => {
        this.categories = data;
      });
  }

  addCategory(categoryName: string): void {
    if (categoryName.trim()) {
      this.categoryService.addCategory(categoryName).subscribe(() => {
        this.loadCategories();
        this.newCategoryName = '';
      });
    }
  }

  updateCategory(categoryId: number, newName: string): void {
    if (newName.trim()) {
      this.categoryService.updateCategory(categoryId, newName).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  deleteCategory(categoryId: number): void {
    this.categoryService.deleteCategory(categoryId).subscribe(() => {
      this.loadCategories();
    });
  }
}
