import {Directive, ElementRef, EventEmitter, Inject, Input, NgZone, Output} from '@angular/core';
import {DndEventsService} from '../services/dnd-events.service';
import {DndStoreService} from '../services/dnd-store.service';
import {fromEvent, Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {filter, takeUntil} from 'rxjs/operators';
import {Position} from '../types/Position';

import {DndStylesService} from '../services/dnd-styles.service';
import {DndCss} from '../types/DndCss';
import {DragData} from '../types/DragData';
import {DndCloneService} from '../services/dnd-clone.service';
import {DndHandle} from '../types/DndHandle';
import {DragGroup} from '../types/DragGroup';
import {InputUtil} from '../util/input-util';

@Directive({
  selector: '[dndDrag]'
})
export class DragDirective {

  @Input('dndDrag')
  enabled: boolean | string = true;

  @Input('dndDrag')
  data: DragData = null;

  @Input('dndGroup')
  group: DragGroup;

  @Output()
  dragStarted: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  dragEnded: EventEmitter<void> = new EventEmitter<void>();

  private readonly handles: Array<DndHandle> = [];

  private readonly nativeElement: HTMLElement;
  private readonly drag$: Subject<void> = new Subject<void>();

  constructor(private readonly zone: NgZone,
              private readonly eventsService: DndEventsService,
              private readonly storeService: DndStoreService,
              private readonly stylesService: DndStylesService,
              private readonly cloneService: DndCloneService,
              @Inject(DOCUMENT) private readonly document: any,
              el: ElementRef) {
    this.nativeElement = el.nativeElement;
  }

  setDragHandle(handle: HTMLElement): void {
    this.zone.runOutsideAngular(() => {
      const dragHandle = this.createDragHandle(handle);
      this.handles.push(dragHandle);
    });
  }

  private createDragHandle(handle: HTMLElement): DndHandle {
      const listener = fromEvent(handle, 'mousedown')
        .pipe(
          filter(() => InputUtil.isEnabled(this.enabled))
        )
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

    this.eventsService.dropped()
      .pipe(
        filter(g => g === this.group),
        takeUntil(this.drag$)
      )
      .subscribe(() => this.endDrag());
  }

  private startDrag(position: Position): void {
    this.storeService.set(this.data);
    this.cloneService.createClone(this.nativeElement, position, this.group);
    this.setDragStyles();
    this.registerDragListeners();
    this.eventsService.startDrag(this.group);
  }

  private drag(position: Position): void {
    this.cloneService.setPosition(position);
  }

  private endDrag(): void {
    this.cloneService.destroyClone();
    this.removeDragStyles();
    this.unregisterDragListener();
    this.eventsService.endDrag(this.group);
  }

  private unregisterDragListener(): void {
    this.drag$.next();
  }

  private getGroupClassName(): string {
    return DndCss.DRAG + '-' + this.group;
  }

  private setDragStyles(): void {
    this.stylesService.addClass(this.nativeElement, DndCss.DRAG);
    this.stylesService.addClass(this.nativeElement, this.getGroupClassName());
  }

  private removeDragStyles(): void {
    this.stylesService.removeClass(this.nativeElement, DndCss.DRAG);
    this.stylesService.removeClass(this.nativeElement, this.getGroupClassName());
  }
}
