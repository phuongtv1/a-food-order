import { FoodService } from './../../../services/food.service';
import { Food } from './../../../shared/models/Food';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  foods:Food[] = [];
  constructor(private foodService: FoodService) { }

  ngOnInit(): void {
    this.foods = this.foodService.getAll();
  }

}
