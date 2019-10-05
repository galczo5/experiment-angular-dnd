import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {DndEvent} from '../types/DndEvents';
import {filter} from 'rxjs/operators';

@Injectable()
export class DndEventsService {

  private readonly events$: Subject<DndEvent> = new Subject<DndEvent>();

  constructor() { }

  startDrag(): void {
    this.events$.next(DndEvent.DRAG_STARTED);
  }

  endDrag(): void {
    this.events$.next(DndEvent.DRAG_ENDED);
  }

  itemsDropped(): void {
    this.events$.next(DndEvent.ITEMS_DROPPED);
  }

  events(): Observable<DndEvent> {
    return this.events$.asObservable();
  }

  filteredEvents(event: DndEvent): Observable<DndEvent> {
    return this.events$.pipe(filter(e => e === event));
  }
}
