// Framework imports
import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// External imports
import { delay, Observable, of } from 'rxjs';

// Internal imports 
import { IPeriodicElement } from '../model/IPeriodicElement.model';

/**
 * Dummy data acces to be replaced with REST API calls
 */
@Injectable({
  providedIn: 'root',
})
export class PeriodicElementsDataAcces {
  // protected readonly http = inject(HttpClient);

  protected readonly fakePertiodicElemDataBase: IPeriodicElement[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ];

  public getElementListing(filterQuery = ''): Observable<IPeriodicElement[]> {
    if (!filterQuery)
      return of(this.fakePertiodicElemDataBase.slice()).pipe(delay(600));

    const filteredList = this.fakePertiodicElemDataBase.filter((e) => {
      return Object.values(e).some((v) => {
        if (typeof v !== 'string' && typeof v !== 'number') return false;

        return v.toString().toLowerCase().includes(filterQuery.toLowerCase());
      });
    });

    return of(filteredList).pipe(delay(600));
  }

  public updateElement(
    updatedElemm: IPeriodicElement
  ): Observable<IPeriodicElement[]> {
    const updateElementIndex = this.fakePertiodicElemDataBase.findIndex(
      (e) => e.position === updatedElemm.position
    );
  
    if (updateElementIndex >= 0) {
      this.fakePertiodicElemDataBase[updateElementIndex] = updatedElemm;
    }

    return this.getElementListing();
  }
}
