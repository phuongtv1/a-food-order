import { sample_foods } from './../shared/store/data';
import { Food } from './../shared/models/Food';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor() { }

  getAll():Food[] {
      return sample_foods;
  }
}
