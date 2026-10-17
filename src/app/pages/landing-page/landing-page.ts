import {
  ReactiveFormsModule,
  FormControl,
  FormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteAddEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { FormsComponent } from '../../common/abstract-component/formsComponent.component';
import { TransactionService } from '../../common/services/transaction.service';
import { ETransactionType } from '../../common/enums/transaction-type.enum';
import { CategoryService } from '../../common/services/categories.service';
import { PersonService } from '../../common/services/persons.service';
import { Transaction } from '../../common/models/transaction.model';
import { PlaceService } from '../../common/services/place.service';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IPerson } from '../../common/models/person.interface';
import { Category } from '../../common/models/category.models';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { Place } from '../../common/models/place.model';
import { DatePickerModule } from 'primeng/datepicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

@Component({
  imports: [
    TableModule,
    CardModule,
    ButtonModule,
    InputNumberModule,
    MessageModule,
    ReactiveFormsModule,
    FormsModule,
    DatePickerModule,
    SelectButtonModule,
    SelectModule,
    TextareaModule,
    AutoCompleteModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  providers: [PersonService, CategoryService, PlaceService, TransactionService],
  selector: 'app-landing-page',
  styleUrl: './landing-page.scss',
  templateUrl: './landing-page.html',
})
export class LandingPage extends FormsComponent implements OnInit {
  private _categories: Category[] = [];
  private _places: Place[] = [];

  public persons: IPerson[] = [];
  public categorySuggestions: Category[] = [];
  public placesSuggestions: Place[] = [];

  private _newCategory?: Category;
  private _newPlace?: Place;

  public categoryQueryTyped: boolean = false;
  public placeQueryTyped: boolean = false;

  public selectedCategoryName?: string;
  public selectedPlaceName?: string;

  public readonly TRANSACTION_TYPES = ETransactionType;
  public readonly transactionTypeOptions: { label: string; value: ETransactionType }[] = [];

  public datePreSelectionOptions: { label: string; value: Date }[] = [];

  @ViewChild('placeSelection') public placeSelectionComponent!: any;
  @ViewChild('categorySelection') public categorySelectionComponent!: any;

  constructor(
    private readonly _transactionService: TransactionService,
    private readonly _categoryService: CategoryService,
    private readonly _personService: PersonService,
    private readonly _placeService: PlaceService,
  ) {
    super();
    this._initForm();

    this.transactionTypeOptions = [
      { label: 'Einnahme', value: ETransactionType.INCOME },
      { label: 'Ausgabe', value: ETransactionType.EXPENSE },
      { label: 'Übertrag', value: ETransactionType.TRANSFER },
    ];
  }

  public ngOnInit(): void {
    this._getCategories();
    this._getPersons();
    this._getPlaces();
    this._setDatePreSelectionOptions();
  }

  private _setDatePreSelectionOptions(): void {
    const day = 24 * 60 * 60 * 1000;
    const today = new Date();
    const yesterday = new Date(today.getTime() - day);
    const lastWeek = new Date(today.getTime() - 7 * day);
    const lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
    this.datePreSelectionOptions = [
      { label: 'Heute', value: today },
      { label: 'Gestern', value: yesterday },
      {
        label: 'Letzte Woche',
        value: lastWeek,
      },
      {
        label: 'Letzter Monat',
        value: lastMonth,
      },
    ];
  }

  private _getCategories(): void {
    this._categories = this._categoryService.getCategories();
    this.categorySuggestions = [...this._categories];
    if (this.getValue('transactionType') !== ETransactionType.TRANSFER) {
      const category = this._categories.find((c) => c.name === 'Lebensmittel');
      this.setValue('category', category?.id);
      this.selectedCategoryName = category?.name;
    }
  }

  private _getPersons(): void {
    this.persons = this._personService.getPersons();
  }

  private _getPlaces(): void {
    this._places = this._placeService.getPlaces();
    this.placesSuggestions = [...this._places];
  }

  private _initForm(): void {
    this.inputForm = new FormGroup({
      date: new FormControl(new Date(), [Validators.required]),
      amount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
      payedBy: new FormControl(null, [Validators.required]),
      transactionType: new FormControl(ETransactionType.EXPENSE, [Validators.required]),
    });
    this.onTypeChange(ETransactionType.EXPENSE);
  }

  public onManualTypeChange(type: ETransactionType): void {
    this.inputForm.get('transactionType')?.setValue(type);
    this.onTypeChange(type);
  }

  public onTypeChange(type: ETransactionType): void {
    if (type === ETransactionType.TRANSFER) {
      this.inputForm.addControl('payedTo', new FormControl(null, [Validators.required]));

      this.inputForm.removeControl('description');
      this.inputForm.removeControl('category');
      this.inputForm.removeControl('place');
    } else {
      this.inputForm.addControl(
        'description',
        new FormControl('Lebensmittel', [Validators.required]),
      );

      const category = this._categories.find((c) => c.name === 'Lebensmittel');
      this.selectedCategoryName = category?.name;
      this.inputForm.addControl('category', new FormControl(category?.id, [Validators.required]));
      this.inputForm.addControl('place', new FormControl(null, [Validators.required]));

      this.inputForm.removeControl('payedTo');
    }
  }

  public getTransactionTypeName(transactionType: ETransactionType): string {
    switch (transactionType) {
      case ETransactionType.INCOME:
        return 'Einnahme';
      case ETransactionType.EXPENSE:
        return 'Ausgabe';
      case ETransactionType.TRANSFER:
        return 'Übertrag';
      default:
        return '?';
    }
  }

  public searchCategories(search: AutoCompleteCompleteEvent): void {
    this.categoryQueryTyped = true;
    this.inputForm.get('category')?.reset();
    this.inputForm.get('category')?.markAsDirty();
    const normalizedQuery = this._normalizeQuery(search.query);
    if (!normalizedQuery) {
      this.categorySuggestions = this._categories;
      return;
    }

    const matcher = new RegExp(normalizedQuery, 'iu');
    this.categorySuggestions = this._categories.filter((category) =>
      matcher.test(category.name.normalize('NFC').replace(/[^\p{L}\p{N}]/gu, '')),
    );
  }

  public searchPlace(search: AutoCompleteCompleteEvent): void {
    this.placeQueryTyped = true;
    this.inputForm.get('place')?.reset();
    this.inputForm.get('place')?.markAsDirty();
    const normalizedQuery = this._normalizeQuery(search.query);
    if (!normalizedQuery) {
      this.placesSuggestions = this._places;
      return;
    }

    const matcher = new RegExp(normalizedQuery, 'iu');
    this.placesSuggestions = this._places.filter((place) =>
      matcher.test(place.name.normalize('NFC').replace(/[^\p{L}\p{N}]/gu, '')),
    );
  }

  private _normalizeQuery(query: string): string {
    const normalizedQuery = query.normalize('NFC').replace(/[^\p{L}\p{N}]/gu, '');
    return normalizedQuery;
  }

  public onSelectCategory(event: AutoCompleteAddEvent): void {
    this.categoryQueryTyped = false;
    this.inputForm.patchValue({ category: (event.value as Category).id });
    this.inputForm.get('category')?.markAsDirty();
  }

  public onSelectPlace(event: AutoCompleteAddEvent): void {
    this.placeQueryTyped = false;
    this.inputForm.patchValue({ place: (event.value as Place).id });
    this.inputForm.get('place')?.markAsDirty();
  }

  public addCategory(value: string): void {
    this._newCategory = new Category(value);
    this.inputForm.patchValue({ category: this._newCategory.id });
    this.inputForm.get('category')?.markAsDirty();
    this._categories.push(this._newCategory);
    this.categorySuggestions = [...this._categories];
  }

  public addPlace(value: string): void {
    this._newPlace = new Place(value);
    this.inputForm.patchValue({ place: this._newPlace.id });
    this.inputForm.get('place')?.markAsDirty();
    this._places.push(this._newPlace);
    this.placesSuggestions = [...this._places];
  }

  private _resetData(): void {
    this._newCategory = undefined;
    this.selectedCategoryName = undefined;
    this.categorySuggestions = [...this._categories];
    this.categoryQueryTyped = false;
    this.categorySelectionComponent.clear();

    this._newPlace = undefined;
    this.selectedPlaceName = undefined;
    this.placesSuggestions = [...this._places];
    this.placeQueryTyped = false;
    this.placeSelectionComponent.clear();

    this._initForm();
  }

  public submit(): void {
    let value = this.inputForm.getRawValue() as Transaction;
    value.id = crypto.randomUUID();
    value.date = this.getValue('date').setHours(0, 0, 0, 0);
    this._transactionService.upsertTransaction(value);
    if (this._newCategory) {
      this._categoryService.upsertCategory(this._newCategory);
    }
    if (this._newPlace) {
      this._placeService.upsertPlace(this._newPlace);
    }

    this._resetData();
  }
}
