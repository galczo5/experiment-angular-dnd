import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {DragData} from '../types/DragData';

@Injectable()
export class DndStoreService {

  private value$: Subject<DragData> = new Subject<DragData>();
  private value: any;

  constructor() { }

  set(data: DragData): void {
    this.value = data;
    this.value$.next(this.value);
  }

  get(): DragData {
    return this.value;
  }

  clear(): void {
    this.set(null);
  }

  values(): Observable<DragData> {
    return this.value$.asObservable();
  }
}
