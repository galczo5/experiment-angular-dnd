import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {DragGroup} from '../types/DragGroup';

@Injectable()
export class DndEventsService {

  private readonly dragStart$: Subject<DragGroup> = new Subject<DragGroup>();
  private readonly dragEnd$: Subject<DragGroup> = new Subject<DragGroup>();
  private readonly drop$: Subject<DragGroup> = new Subject<DragGroup>();

  startDrag(group: DragGroup): void {
    this.dragStart$.next(group);
  }

  endDrag(group: DragGroup): void {
    this.dragEnd$.next(group);
  }

  drop(group: DragGroup): void {
    this.drop$.next(group);
  }

  dragStarted(): Observable<DragGroup> {
    return this.dragStart$.asObservable();
  }

  dragEnded(): Observable<DragGroup> {
    return this.dragEnd$.asObservable();
  }

  dropped(): Observable<DragGroup> {
    return this.drop$.asObservable();
  }
}
