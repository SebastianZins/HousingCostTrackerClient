import { Place } from '../models/place.model';
import { Injectable } from '@angular/core';

@Injectable()
export class PlaceService {
  private readonly STORAGE_KEY = 'places';

  public getPlaces(): Place[] {
    return this._getFromLocalStorage();
  }

  public upsertPlace(place: Place): Place[] {
    let places = this._getFromLocalStorage();
    const foundPlace = places.find((t) => t.id === place.id);
    if (foundPlace) {
      const index = places.indexOf(foundPlace);
      places[index] = place;
    } else {
      places.push(place);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(places));
    return places;
  }

  public deletePlaces(placeIds: string[]): Place[] {
    let places = this._getFromLocalStorage();
    placeIds.forEach((id) => {
      places = places.filter((t) => t.id !== id);
    });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(places));
    return places;
  }

  private _getFromLocalStorage(): Place[] {
    const placesJson = localStorage.getItem(this.STORAGE_KEY);
    if (placesJson) {
      return JSON.parse(placesJson) as Place[];
    }
    return [];
  }
}
