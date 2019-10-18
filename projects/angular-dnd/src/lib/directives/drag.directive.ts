import {Directive, ElementRef, EventEmitter, Inject, Input, NgZone, OnInit, Output} from '@angular/core';
import {DndEventsService} from '../services/dnd-events.service';
import {DndStoreService} from '../services/dnd-store.service';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {takeUntil} from 'rxjs/operators';
import {Position} from '../types/Position';

import {DndEvent} from '../types/DndEvents';
import {DndStylesService} from '../services/dnd-styles.service';
import {DndCss} from '../types/DndCss';
import {DragData} from '../types/DragData';
import {DndCloneService} from '../services/dnd-clone.service';

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

  private dragHandle: HTMLElement;
  private dragStartListener: Subscription;
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
    this.setDragHandle(this.nativeElement);
  }

  setDragHandle(handle: HTMLElement): void {
    if (this.dragStartListener) {
      this.stylesService.resetHandleStyles(this.dragHandle);
      this.stylesService.removeClass(this.dragHandle, DndCss.DRAG_HANDLE);
      this.dragStartListener.unsubscribe();
    }

    this.dragHandle = handle;
    this.registerDragStartListener();
    this.stylesService.setHandleStyles(this.dragHandle);
    this.stylesService.addClass(this.dragHandle, DndCss.DRAG_HANDLE);
  }

  private subscribeDroppedEvent() {
    this.eventsService.filteredEvents(DndEvent.ITEMS_DROPPED)
      .pipe(takeUntil(this.drag$))
      .subscribe(() => this.endDrag());
  }

  private registerDragStartListener(): void {
    this.zone.runOutsideAngular(() => {
      this.dragStartListener = fromEvent(this.dragHandle, 'mousedown')
        .subscribe(() => this.startDrag());
    });
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

  private startDrag(): void {
    this.storeService.set(this.data);
    this.cloneService.createClone(this.nativeElement);

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

    this.unregisterDragListener();
    this.eventsService.endDrag();
  }
}
