import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';

// External imports
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { debounceTime, pipe, skip, switchMap, tap } from 'rxjs';

// Internal imports
import { LoadingState } from '@common/model/common.model';
import { IPeriodicElement } from '../model/IPeriodicElement.model';
import { PeriodicElementsDataAcces } from '../data-acces/periodic-elements-data-acces.service';

export interface IPeriodicElementListState {
  items: IPeriodicElement[];
  state: LoadingState;
  filter: string;
}

export const INITIAL_STATE = Object.freeze<IPeriodicElementListState>({
  items: [],
  state: 'iddle',
  filter: '',
});

// Thank you @ngrx for reinventing NestingHell
// with simple Service it would be much more readable
export const PeriodicElementListState = signalStore(
  { providedIn: 'root' },
  withState(INITIAL_STATE),
  withMethods(
    (store, periodicElemDataAcces = inject(PeriodicElementsDataAcces)) => {
      const methods = {
        refreshList: rxMethod<string | undefined>(
          pipe(
            tap(() => patchState(store, { state: 'loading' })),
            switchMap((filter) => {
              return periodicElemDataAcces.getElementListing(filter).pipe(
                tapResponse({
                  next: (updatedList) => {
                    patchState(store, () => ({
                      items: updatedList,
                      // It looks like either TS is stupid or NGRX has some typing issues
                      state: 'success' as LoadingState,
                    }));
                  },
                  // This function will never be called since there is no exception that can be thrown
                  error: (error: unknown) => {
                    console.error(error);
                    patchState(store, () => ({
                      state: 'error' as LoadingState,
                    }));
                  },
                })
              );
            })
          )
        ),
        setFilter: (v: string) => {
          patchState(store, () => ({ filter: v }));
        },
        updateElement: rxMethod<IPeriodicElement>(
          pipe(
            tap(() => patchState(store, { state: 'loading' })),
            switchMap((updatedElement) => {
              return periodicElemDataAcces.updateElement(updatedElement).pipe(
                tapResponse({
                  next: () => {
                    methods.refreshList(store.filter());
                  },
                  // This function will never be called since there is no exception that can be thrown
                  error: (error: unknown) => {
                    console.error(error);
                    patchState(store, () => ({
                      state: 'error' as LoadingState,
                    }));
                  },
                })
              );
            })
          )
        ),
      };

      return methods;
    }
  ),
  // withComputed won't do the job here
  withHooks({
    onInit: (store) => {
      store.refreshList('');
      toObservable(store.filter)
        // 2000ms of debunce is too long for good UX
        .pipe(takeUntilDestroyed(), skip(1), debounceTime(500))
        .subscribe((filter) => {
          store.refreshList(filter);
        });
    },
  })
);
