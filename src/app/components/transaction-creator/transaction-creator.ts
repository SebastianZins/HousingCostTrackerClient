import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormControl,
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
import { IPerson } from '../../common/interfaces/person.interface';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Category } from '../../common/models/category.models';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { Place } from '../../common/models/place.model';
import { DatePickerModule } from 'primeng/datepicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { NgClass } from '@angular/common';

@Component({
  imports: [
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
    NgClass,
  ],
  providers: [PersonService, CategoryService, PlaceService, TransactionService],
  selector: 'app-transaction-creator',
  styleUrl: './transaction-creator.scss',
  templateUrl: './transaction-creator.html',
})
export class TransactionCreator extends FormsComponent implements OnInit {
  @Output() public updateData = new EventEmitter<{
    category?: Category;
    place?: Place;
    person?: IPerson;
    transaction?: Transaction;
  }>();

  @Input() public size?: 'small';

  @Input() public categories: Category[] = [];
  @Input() public places: Place[] = [];
  @Input() public persons: IPerson[] = [];

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
    private readonly _placeService: PlaceService,
  ) {
    super();

    this.transactionTypeOptions = [
      { label: 'Einnahme', value: ETransactionType.INCOME },
      { label: 'Ausgabe', value: ETransactionType.EXPENSE },
      { label: 'Übertrag', value: ETransactionType.TRANSFER },
    ];
  }

  public ngOnInit(): void {
    this._initForm();
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

      const category = this.categories.find((c) => c.name === 'Lebensmittel');
      this.selectedCategoryName = category?.name;
      this.inputForm.addControl('category', new FormControl(category?.id, [Validators.required]));
      this.inputForm.addControl('place', new FormControl(null, [Validators.required]));

      this.inputForm.removeControl('payedTo');
    }
  }

  public searchCategories(search: AutoCompleteCompleteEvent): void {
    this.categoryQueryTyped = true;
    this.inputForm.get('category')?.reset();
    this.inputForm.get('category')?.markAsDirty();
    const normalizedQuery = this._normalizeQuery(search.query);
    if (!normalizedQuery) {
      this.categorySuggestions = this.categories;
      return;
    }

    const matcher = new RegExp(normalizedQuery, 'iu');
    this.categorySuggestions = this.categories.filter((category) =>
      matcher.test(category.name.normalize('NFC').replace(/[^\p{L}\p{N}]/gu, '')),
    );
  }

  public searchPlace(search: AutoCompleteCompleteEvent): void {
    this.placeQueryTyped = true;
    this.inputForm.get('place')?.reset();
    this.inputForm.get('place')?.markAsDirty();
    const normalizedQuery = this._normalizeQuery(search.query);
    if (!normalizedQuery) {
      this.placesSuggestions = this.places;
      return;
    }

    const matcher = new RegExp(normalizedQuery, 'iu');
    this.placesSuggestions = this.places.filter((place) =>
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
    this.categories.push(this._newCategory);
    this.categorySuggestions = [...this.categories];
  }

  public addPlace(value: string): void {
    this._newPlace = new Place(value);
    this.inputForm.patchValue({ place: this._newPlace.id });
    this.inputForm.get('place')?.markAsDirty();
    this.places.push(this._newPlace);
    this.placesSuggestions = [...this.places];
  }

  private _resetData(): void {
    this._newCategory = undefined;
    this.selectedCategoryName = undefined;
    this.categorySuggestions = [...this.categories];
    this.categoryQueryTyped = false;
    this.categorySelectionComponent.clear();

    this._newPlace = undefined;
    this.selectedPlaceName = undefined;
    this.placesSuggestions = [...this.places];
    this.placeQueryTyped = false;
    this.placeSelectionComponent.clear();

    this._initForm();
  }

  public submit(): void {
    let value = this.inputForm.getRawValue() as Transaction;
    value.id = crypto.randomUUID();
    value.date = this.getValue('date').setHours(0, 0, 0, 0);
    this._transactionService.upsertTransaction(value).subscribe((ok) => {
      if (ok) {
        if (this._newCategory) {
          this._categoryService.upsertCategory(this._newCategory);
        }
        if (this._newPlace) {
          this._placeService.upsertPlace(this._newPlace);
        }

        this.updateData.emit({
          category: this._newCategory,
          place: this._newPlace,
          transaction: value,
        });

        this._resetData();
      }
    });
  }
}
