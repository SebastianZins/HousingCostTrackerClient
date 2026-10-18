import { TransactionService } from '../../common/services/transaction.service';
import { ETransactionType } from '../../common/enums/transaction-type.enum';
import { CategoryService } from '../../common/services/categories.service';
import { PersonService } from '../../common/services/persons.service';
import { PlaceService } from '../../common/services/place.service';
import { IPerson } from '../../common/models/person.interface';
import { Category } from '../../common/models/category.models';
import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Place } from '../../common/models/place.model';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  imports: [
    TableModule,
    DatePipe,
    CurrencyPipe,
    TagModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    SelectModule,
    DatePicker,
    InputNumberModule,
  ],
  selector: 'app-overview',
  styleUrl: './overview.scss',
  templateUrl: './overview.html',
  providers: [TransactionService, PersonService, CategoryService, PlaceService],
})
export class OverviewPage implements OnInit {
  public selectedTransactions?: any;
  public transactionsLoading: boolean = false;
  public transactions = signal<any[]>([]);
  private _clonedTransactions: Map<string, any> = new Map();

  public personMap: Map<string, IPerson> = new Map();
  public personData: IPerson[] = [];
  public personDataLoading: boolean = false;

  public categoryMap: Map<string, Category> = new Map();
  public categoryData: Category[] = [];
  public categoryDataLoading: boolean = false;

  public placeMap: Map<string, Place> = new Map();
  public placeData: Place[] = [];
  public placeDataLoading: boolean = false;

  public readonly TRANSACTION_TYPES = ETransactionType;

  public readonly transactionsTypeList: { name: string; value: ETransactionType }[] = [];

  constructor(
    public readonly transactionService: TransactionService,
    private readonly _personService: PersonService,
    private readonly _categoryService: CategoryService,
    private readonly _placeService: PlaceService,
    private readonly _messageService: MessageService,
  ) {
    this.transactionsTypeList = this.transactionService.getTransactionTypeNames();
  }

  public ngOnInit(): void {
    this._getAutofillData();
    this._getTransactions();
  }

  private _getTransactions(): void {
    this.transactionsLoading = true;
    this.transactions.set(
      this.transactionService.getTransactions().map((t) => {
        const newT: any = { ...t };
        newT.date = new Date(t.date);
        return newT;
      }),
    );
    this.transactionsLoading = false;
  }

  private _getAutofillData(): void {
    this._getPersons();
    this._getCategories();
    this._getPlaces();
  }

  private _getPersons(): void {
    this.personDataLoading = true;
    this.personData = this._personService.getPersons();
    this.personData.forEach((p) => this.personMap.set(p.id, p));
    this.personDataLoading = false;
  }

  private _getCategories(): void {
    this.categoryDataLoading = true;
    this.categoryData = this._categoryService.getCategories();
    this.categoryData.forEach((c) => this.categoryMap.set(c.id, c));
    this.categoryDataLoading = false;
  }

  private _getPlaces(): void {
    this.placeDataLoading = true;
    this.placeData = this._placeService.getPlaces();
    this.placeData.forEach((p) => this.placeMap.set(p.id, p));
    this.placeDataLoading = false;
  }

  public onRowEditInit(transaction: any) {
    this._clonedTransactions.set(transaction.id, { ...transaction });
  }

  public onRowEditSave(transaction: any) {
    let error = undefined;
    if (!transaction.date) {
      // throw error
      return;
    } else if (!transaction.amount || transaction.amount === 0) {
      // throw error
      return;
    } else if (!transaction.payedBy) {
      // throw error
      return;
    } else if (transaction.transactionType === ETransactionType.TRANSFER) {
      if (!transaction.payedTo) {
        // throw error
        return;
      }
    } else {
      if (!transaction.place) {
        // throw error
        return;
      } else if (!transaction.category) {
        // throw error
        return;
      } else if (!transaction.description) {
        // throw error
        return;
      }
    }

    if (!error) {
      this._clonedTransactions.delete(transaction.id);
    } else {
      this._messageService.add({ severity: 'error', summary: 'Error', detail: error });
    }
  }

  public onRowEditCancel(transaction: any) {
    const index = this.transactions().findIndex((t) => t.id === transaction.id);
    const tmpTransactions = [...this.transactions()];
    tmpTransactions[index] = this._clonedTransactions.get(transaction.id)!;
    this.transactions.set(tmpTransactions);
    this._clonedTransactions.delete(transaction.id);
  }
}
