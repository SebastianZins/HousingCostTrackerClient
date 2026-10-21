import { TransactionCreator } from '../../components/transaction-creator/transaction-creator';
import { Component, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { TransactionService } from '../../common/services/transaction.service';
import { ETransactionType } from '../../common/enums/transaction-type.enum';
import { CategoryService } from '../../common/services/categories.service';
import { PersonService } from '../../common/services/persons.service';
import { TopbarService } from '../../common/services/topbar.service';
import { Transaction } from '../../common/models/transaction.model';
import { PlaceService } from '../../common/services/place.service';
import { IPerson } from '../../common/interfaces/person.interface';
import { Category } from '../../common/models/category.models';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Place } from '../../common/models/place.model';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { forkJoin } from 'rxjs';

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
    CardModule,
    DialogModule,
    TransactionCreator,
  ],
  selector: 'app-overview',
  styleUrl: './overview.scss',
  templateUrl: './overview.html',
  providers: [TransactionService, PersonService, CategoryService, PlaceService],
})
export class OverviewPage implements OnInit {
  public selectedTransactions?: any[];
  private _transactionsLoading: boolean = false;
  public transactions = signal<any[]>([]);
  private _clonedTransactions: Map<string, any> = new Map();

  public personMap: Map<string, IPerson> = new Map();
  public personData: IPerson[] = [];
  private _personDataLoading: boolean = false;

  public categoryMap: Map<string, Category> = new Map();
  public categoryData: Category[] = [];
  private _categoryDataLoading: boolean = false;

  public placeMap: Map<string, Place> = new Map();
  public placeData: Place[] = [];
  private _placeDataLoading: boolean = false;

  public get dataLoading(): boolean {
    return (
      this._transactionsLoading ||
      this._personDataLoading ||
      this._categoryDataLoading ||
      this._placeDataLoading
    );
  }

  public readonly TRANSACTION_TYPES = ETransactionType;

  public readonly transactionsTypeList: { name: string; value: ETransactionType }[] = [];

  public transactionCreatorShown = signal<boolean>(false);
  @ViewChild('transactionTable') public transactionTable!: Table;
  @ViewChild('topBarElements')
  public set topBarElements(template: TemplateRef<unknown>) {
    this._topbarService.headerTemplate.set(template);
  }

  constructor(
    public readonly transactionService: TransactionService,
    private readonly _personService: PersonService,
    private readonly _categoryService: CategoryService,
    private readonly _placeService: PlaceService,
    private readonly _messageService: MessageService,
    private readonly _topbarService: TopbarService,
  ) {
    this.transactionsTypeList = this.transactionService.getTransactionTypeNames();
  }

  public ngOnInit(): void {
    this._getAutofillData();
    this._getTransactions();
  }

  private _getTransactions(): void {
    this._transactionsLoading = true;
    this.transactionService.getTransactions().subscribe((data) => {
      this.transactions.set(
        data.map((t) => {
          const newT: any = { ...t };
          newT.date = new Date(t.date);
          return newT;
        }),
      );
      this._transactionsLoading = false;
    });
  }

  private _getAutofillData(): void {
    this._getPersons();
    this._getCategories();
    this._getPlaces();
  }

  private _getPersons(): void {
    this._personDataLoading = true;
    this._personService.getPersons().subscribe((data) => {
      this.personData = data;
      this.personData.sort((c1, c2) => c1.shortName.localeCompare(c2.shortName));
      data.forEach((d) => {
        this.personMap.set(d.id, d);
      });
      this._personDataLoading = false;
    });
  }

  private _getCategories(): void {
    this._categoryDataLoading = true;
    this._categoryService.getCategories().subscribe((data) => {
      this.categoryData = data;
      this.categoryData.sort((c1, c2) => c1.name.localeCompare(c2.name));
      data.forEach((d) => {
        this.categoryMap.set(d.id, d);
      });
      this._categoryDataLoading = false;
    });
  }

  private _getPlaces(): void {
    this._placeDataLoading = true;
    this._placeService.getPlaces().subscribe((data) => {
      this.placeData = data;
      this.placeData.sort((c1, c2) => c1.name.localeCompare(c2.name));
      data.forEach((d) => {
        this.placeMap.set(d.id, d);
      });
      this._placeDataLoading = false;
    });
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

  public deleteSelected(): void {
    const obs = this.selectedTransactions!.map((transaction) =>
      this.transactionService.deleteTransaction(transaction.id),
    );
    forkJoin(obs).subscribe((oks) => {
      if (oks.every((ok) => ok)) {
        this.transactions.update((transactions) =>
          transactions.filter(
            (t) => this.selectedTransactions!.findIndex((selected) => selected === t) === -1,
          ),
        );
        this.selectedTransactions = undefined;
      }
    });
  }

  public updateData(data: {
    category?: Category;
    place?: Place;
    person?: IPerson;
    transaction?: Transaction;
  }): void {
    this.transactionCreatorShown.set(false);
    if (!!data.category) {
      const index = this.categoryData.findIndex((c) => c.id === data.category!.id);
      if (index >= 0) {
        this.categoryData[index] = data.category;
      } else {
        this.categoryData.push(data.category);
      }
      this.categoryMap.set(data.category.id, data.category);
      this.categoryData.sort((c1, c2) => c1.name.localeCompare(c2.name));
    }
    if (!!data.place) {
      const index = this.placeData.findIndex((c) => c.id === data.place!.id);
      if (index >= 0) {
        this.placeData[index] = data.place;
      } else {
        this.placeData.push(data.place);
      }
      this.placeMap.set(data.place.id, data.place);
      this.placeData.sort((c1, c2) => c1.name.localeCompare(c2.name));
    }
    if (!!data.person) {
      const index = this.personData.findIndex((c) => c.id === data.person!.id);
      if (index >= 0) {
        this.personData[index] = data.person;
      } else {
        this.personData.push(data.person);
      }
      this.personMap.set(data.person.id, data.person);
      this.personData.sort((c1, c2) => c1.shortName.localeCompare(c2.shortName));
    }
    if (!!data.transaction) {
      this.transactions.update((transactions) => {
        const index = this.transactions().findIndex((c) => c.id === data.transaction!.id);
        const updated = [...transactions];
        const newTransaction: any = data.transaction;
        newTransaction.date = new Date(newTransaction.date);
        if (index >= 0) {
          updated[index] = data.transaction;
        } else {
          updated.push(data.transaction);
        }
        return updated;
      });
    }
  }
}
