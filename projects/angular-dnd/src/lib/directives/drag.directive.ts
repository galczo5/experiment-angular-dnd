import {Directive, ElementRef, EventEmitter, Inject, Input, NgZone, OnInit, Output} from '@angular/core';
import {DndEventsService} from '../services/dnd-events.service';
import {DndStoreService} from '../services/dnd-store.service';
import {fromEvent, Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {takeUntil} from 'rxjs/operators';
import {Position} from '../types/Position';

import {DndEvent} from '../types/DndEvents';
import {DndStylesService} from '../services/dnd-styles.service';
import {DndCss} from '../types/DndCss';
import {DragData} from '../types/DragData';
import {DndCloneService} from '../services/dnd-clone.service';
import {DndHandle} from '../types/DndHandle';

@Directive({
  selector: '[dndDrag]'
})
export class DragDirective implements OnInit {

  @Input('dndDrag')
  data: DragData;

  @Output()
  dragStarted: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  dragEnded: EventEmitter<void> = new EventEmitter<void>();

  private containerHandle: DndHandle;
  private handles: Array<DndHandle> = [];

  private readonly nativeElement: HTMLElement;
  private readonly drag$: Subject<void> = new Subject<void>();

  constructor(private readonly zone: NgZone,
              private readonly eventsService: DndEventsService,
              private readonly storeService: DndStoreService,
              private readonly stylesService: DndStylesService,
              private readonly cloneService: DndCloneService,
              @Inject(DOCUMENT) private readonly document: Document,
              el: ElementRef) {
    this.nativeElement = el.nativeElement;
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.containerHandle = this.createDragHandle(this.nativeElement);
    });
  }

  setDragHandle(handle: HTMLElement): void {
    if (this.containerHandle) {
      this.removeDragHandle(this.containerHandle);
      this.containerHandle = null;
    }

    this.zone.runOutsideAngular(() => {
      const dragHandle = this.createDragHandle(handle);
      this.handles.push(dragHandle);
    });
  }

  private removeDragHandle(handle: DndHandle): void {
    const el = handle.getElement();
    const listener = handle.getListener();

    this.stylesService.resetHandleStyles(el);
    this.stylesService.removeClass(el, DndCss.DRAG_HANDLE);
    listener.unsubscribe();
  }

  private subscribeDroppedEvent() {
    this.eventsService.filteredEvents(DndEvent.ITEMS_DROPPED)
      .pipe(takeUntil(this.drag$))
      .subscribe(() => this.endDrag());
  }

  private createDragHandle(handle: HTMLElement): DndHandle {
      const listener = fromEvent(handle, 'mousedown')
        .subscribe((event: MouseEvent) => this.startDrag(event));

      this.stylesService.setHandleStyles(handle);
      this.stylesService.addClass(handle, DndCss.DRAG_HANDLE);

      return new DndHandle(handle, listener);
  }

  private registerDragListeners(): void {
    this.zone.runOutsideAngular(() => {
      fromEvent(this.document, 'mousemove')
        .pipe(takeUntil(this.drag$))
        .subscribe((event: MouseEvent) => this.drag(event));

      fromEvent(this.document, 'mouseup')
        .pipe(takeUntil(this.drag$))
        .subscribe(() => this.endDrag());
    });
  }

  private unregisterDragListener(): void {
    this.drag$.next();
  }

  private startDrag(position: Position): void {
    this.storeService.set(this.data);
    this.cloneService.createClone(this.nativeElement, position);
    this.stylesService.addClass(this.nativeElement, DndCss.DRAG);

    this.registerDragListeners();
    this.eventsService.startDrag();
    this.subscribeDroppedEvent();
  }

  private drag(position: Position): void {
    this.cloneService.setPosition(position);
  }

  private endDrag(): void {
    this.storeService.clear();
    this.cloneService.destroyClone();
    this.stylesService.removeClass(this.nativeElement, DndCss.DRAG);

    this.unregisterDragListener();
    this.eventsService.endDrag();
  }
}
