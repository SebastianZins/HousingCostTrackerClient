import { TransactionCreator } from '../../components/transaction-creator/transaction-creator';
import { CategoryService } from '../../common/services/categories.service';
import { PersonService } from '../../common/services/persons.service';
import { Transaction } from '../../common/models/transaction.model';
import { PlaceService } from '../../common/services/place.service';
import { IPerson } from '../../common/interfaces/person.interface';
import { Category } from '../../common/models/category.models';
import { Place } from '../../common/models/place.model';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  imports: [CardModule, TransactionCreator],
  providers: [PersonService, CategoryService, PlaceService],
  selector: 'app-landing-page',
  styleUrl: './landing-page.scss',
  templateUrl: './landing-page.html',
})
export class LandingPage implements OnInit {
  public categories: Category[] = [];
  public places: Place[] = [];
  public persons: IPerson[] = [];

  constructor(
    private readonly _categoryService: CategoryService,
    private readonly _personService: PersonService,
    private readonly _placeService: PlaceService,
  ) {}

  public ngOnInit(): void {
    this._getCategories();
    this._getPersons();
    this._getPlaces();
  }

  private _getCategories(): void {
    this.categories = this._categoryService.getCategories();
    this.categories.sort((c1, c2) => c1.name.localeCompare(c2.name));
  }

  private _getPersons(): void {
    this.persons = this._personService.getPersons();
    this.persons.sort((c1, c2) => c1.shortName.localeCompare(c2.shortName));
  }

  private _getPlaces(): void {
    this.places = this._placeService.getPlaces();
    this.places.sort((c1, c2) => c1.name.localeCompare(c2.name));
  }

  public updateData(data: {
    category?: Category;
    place?: Place;
    person?: IPerson;
    transaction?: Transaction;
  }): void {
    if (!!data.category) {
      const index = this.categories.findIndex((c) => c.id === data.category!.id);
      if (index >= 0) {
        this.categories[index] = data.category;
      } else {
        this.categories.push(data.category);
      }
      this.categories.sort((c1, c2) => c1.name.localeCompare(c2.name));
    }
    if (!!data.place) {
      const index = this.places.findIndex((c) => c.id === data.place!.id);
      if (index >= 0) {
        this.places[index] = data.place;
      } else {
        this.places.push(data.place);
      }
      this.places.sort((c1, c2) => c1.name.localeCompare(c2.name));
    }
    if (!!data.person) {
      const index = this.persons.findIndex((c) => c.id === data.person!.id);
      if (index >= 0) {
        this.persons[index] = data.person;
      } else {
        this.persons.push(data.person);
      }
      this.persons.sort((c1, c2) => c1.shortName.localeCompare(c2.shortName));
    }
  }
}
