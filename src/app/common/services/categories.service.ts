import { Category } from '../models/category.models';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoryService {
  private readonly STORAGE_KEY = 'categories';

  public getCategories(): Category[] {
    return this._getFromLocalStorage();
  }

  public upsertCategory(category: Category): Category[] {
    let categories = this._getFromLocalStorage();
    const foundCategory = categories.find((t) => t.id === category.id);
    if (foundCategory) {
      const index = categories.indexOf(foundCategory);
      categories[index] = category;
    } else {
      categories.push(category);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
    return categories;
  }

  public deleteCategories(categoryIds: string[]): Category[] {
    let categories = this._getFromLocalStorage();
    categoryIds.forEach((id) => {
      categories = categories.filter((t) => t.id !== id);
    });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
    return categories;
  }

  private _getFromLocalStorage(): Category[] {
    const categoriesJson = localStorage.getItem(this.STORAGE_KEY);
    if (categoriesJson) {
      return JSON.parse(categoriesJson) as Category[];
    }
    return [];
  }
}
