import { IPerson } from '../../common/models/person.interface';
import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-overview',
  styleUrl: './overview.scss',
  templateUrl: './overview.html',
})
export class Overview {
  public persons: IPerson[] = [];

  public getPersonName(name: string): string {
    const person = this.persons.find((p) => p.id === name);
    return person ? person.firstName : '?';
  }
}
