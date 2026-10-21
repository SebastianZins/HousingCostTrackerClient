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
  public get dataLoading(): boolean {
    return this._categoriesLoading || this._placesLoading || this._personsLoading;
  }
  private _categoriesLoading: boolean = false;
  private _placesLoading: boolean = false;
  private _personsLoading: boolean = false;

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
    this._categoriesLoading = true;
    this._categoryService.getCategories().subscribe((data) => {
      this.categories = data;
      this.categories.sort((c1, c2) => c1.name.localeCompare(c2.name));
      this._categoriesLoading = false;
    });
  }

  private _getPersons(): void {
    this._personsLoading = true;
    this._personService.getPersons().subscribe((data) => {
      this.persons = data;
      this.persons.sort((c1, c2) => c1.shortName.localeCompare(c2.shortName));
      this._personsLoading = false;
    });
  }

  private _getPlaces(): void {
    this._placesLoading = true;
    this._placeService.getPlaces().subscribe((data) => {
      this.places = data;
      this.places.sort((c1, c2) => c1.name.localeCompare(c2.name));
      this._placesLoading = false;
    });
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
