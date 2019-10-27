import { Injectable } from '@angular/core';
import {ListItem} from './list-item/list-item';
import {data} from './list-item/list-items';
import {Observable, ReplaySubject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListItemsService {

  private items: Array<ListItem> = data;
  private items$: ReplaySubject<Array<ListItem>> = new ReplaySubject<Array<ListItem>>();

  constructor() {
    this.items$.next(this.items);
  }

  sorted(): Observable<Array<ListItem>> {
    return this.items$
      .pipe(
        map(items => {
          items.sort((a, b) => a.position - b.position);
          return items;
        })
      );
  }

  move(id: number, position: number): void {
    const result = [];
    const draggedItem = this.items.find(i => i.id === id);

    if (!draggedItem) {
      return;
    }

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (i === position) {
        result.push(draggedItem);
      }
      if (item.id !== id) {
        result.push(item);
      }
    }

    result.forEach((item: ListItem, index: number) => item.position = index);
    this.items$.next(result);
  }
}
