import {Directive, ElementRef, Inject, Input, NgZone, OnInit} from '@angular/core';
import {DndEventsService} from '../services/dnd-events.service';
import {DndStoreService} from '../services/dnd-store.service';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {takeUntil} from 'rxjs/operators';
import {Position} from '../types/Position';

import {DndEvent} from '../types/DndEvents';
import {DndStylesService} from '../services/dnd-styles.service';
import {DndCss} from '../types/DndCss';

@Directive({
  selector: '[dndDrag]'
})
export class DragDirective implements OnInit {

  @Input('dndDrag')
  data: any;

  private dragHandle: HTMLElement;
  private dragStartListener: Subscription;
  private readonly nativeElement: HTMLElement;
  private readonly drag$: Subject<void> = new Subject<void>();

  constructor(private readonly zone: NgZone,
              private readonly eventsService: DndEventsService,
              private readonly storeService: DndStoreService,
              private readonly stylesService: DndStylesService,
              @Inject(DOCUMENT) private readonly document: Document,
              el: ElementRef) {
    this.nativeElement = el.nativeElement;
  }

  ngOnInit(): void {
    this.setDragHandle(this.nativeElement);
    this.eventsService.filteredEvents(DndEvent.ITEMS_DROPPED)
      .subscribe(() => {
        this.unregisterDragListener();
        this.stylesService.removeClass(this.nativeElement, DndCss.DRAG_ACTIVE);
        this.eventsService.endDrag();
      });

    this.eventsService.filteredEvents(DndEvent.DRAG_STARTED)
      .subscribe(() => this.stylesService.addClass(this.nativeElement, DndCss.DRAG));

    this.eventsService.filteredEvents(DndEvent.DRAG_ENDED)
      .subscribe(() => this.stylesService.removeClass(this.nativeElement, DndCss.DRAG));
  }

  setDragHandle(el: HTMLElement): void {
    if (this.dragStartListener) {
      this.stylesService.resetHandleStyles(this.dragHandle);
      this.dragStartListener.unsubscribe();
    }

    this.dragHandle = el;
    this.registerDragStartListener();
    this.stylesService.setHandleStyles(this.dragHandle);
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
    this.storeService.set({
      el: this.dragHandle,
      payload: this.data
    });

    this.eventsService.startDrag();
    this.registerDragListeners();
    this.stylesService.addClass(this.nativeElement, DndCss.DRAG_ACTIVE);
  }

  private drag(position: Position): void {
    this.stylesService.setPosition(this.nativeElement, position);
  }

  private endDrag(): void {
    this.storeService.clear();
    this.eventsService.endDrag();
    this.stylesService.resetPosition(this.nativeElement);
    this.unregisterDragListener();
  }
}
