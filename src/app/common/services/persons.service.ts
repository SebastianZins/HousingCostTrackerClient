import { IPerson } from '../interfaces/person.interface';
import { Injectable } from '@angular/core';

@Injectable()
export class PersonService {
  private readonly STORAGE_KEY = 'persons';

  public getPersons(): IPerson[] {
    return this._getFromLocalStorage();
  }

  public upsertPerson(person: IPerson): IPerson[] {
    let persons = this._getFromLocalStorage();
    const foundPerson = persons.find((t) => t.id === person.id);
    if (foundPerson) {
      const index = persons.indexOf(foundPerson);
      persons[index] = person;
    } else {
      persons.push(person);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(persons));
    return persons;
  }

  public deletePersons(personIds: string[]): IPerson[] {
    let persons = this._getFromLocalStorage();
    personIds.forEach((id) => {
      persons = persons.filter((t) => t.id !== id);
    });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(persons));
    return persons;
  }

  private _getFromLocalStorage(): IPerson[] {
    const personsJson = localStorage.getItem(this.STORAGE_KEY);
    if (personsJson) {
      return JSON.parse(personsJson) as IPerson[];
    }
    return [];
  }
}
