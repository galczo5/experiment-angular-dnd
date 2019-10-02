import {Directive, ElementRef, Inject, Input, NgZone, OnInit, Renderer2} from '@angular/core';
import {DndEventsService} from '../services/dnd-events.service';
import {DndStoreService} from '../services/dnd-store.service';
import {fromEvent, Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {filter, takeUntil} from 'rxjs/operators';
import {Position} from '../types/Position';

import '../styles.css';
import {DndEvent} from '../types/DndEvents';

@Directive({
  selector: '[dndDrag]'
})
export class DragDirective implements OnInit {

  @Input('dndDrag')
  data: any;

  private readonly nativeElement: HTMLElement;
  private readonly drag$: Subject<void> = new Subject<void>();

  constructor(private readonly renderer: Renderer2,
              private readonly zone: NgZone,
              private readonly eventsService: DndEventsService,
              private readonly storeService: DndStoreService,
              @Inject(DOCUMENT) private readonly document: Document,
              el: ElementRef) {
    this.nativeElement = el.nativeElement;
  }

  ngOnInit(): void {
    this.registerDragStartListener();
    this.renderer.setStyle(this.nativeElement, 'cursor', 'move');
    this.renderer.setStyle(this.nativeElement, 'user-select', 'none');

    this.eventsService.events()
      .pipe(filter(e => e === DndEvent.ITEMS_DROPPED))
      .subscribe(() => {
        this.drag$.next();
        this.eventsService.endDrag();
      });
  }

  private registerDragStartListener(): void {
    this.zone.runOutsideAngular(() => {
      fromEvent(this.nativeElement, 'mousedown')
        .subscribe(() => {
          this.startDrag();
          this.registerDragOverListener();
          this.registerDragEndListener();
        });
    });
  }

  private registerDragOverListener(): void {
    this.zone.runOutsideAngular(() => {
      fromEvent(this.document, 'mousemove')
        .pipe(takeUntil(this.drag$))
        .subscribe((event: MouseEvent) => {
          const position: Position = event;
          this.drag(position);
        });
    });
  }

  private registerDragEndListener(): void {
    this.zone.runOutsideAngular(() => {
      fromEvent(this.document, 'mouseup')
        .pipe(takeUntil(this.drag$))
        .subscribe(() => {
          this.endDrag();
          this.drag$.next();
        });
    });
  }

  private startDrag(): void {
    this.storeService.set({
      el: this.nativeElement,
      payload: this.data
    });

    this.eventsService.startDrag();
  }

  private drag(position: Position): void {
    this.renderer.setStyle(this.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(this.nativeElement, 'top', `${position.y}px`);
    this.renderer.setStyle(this.nativeElement, 'left', `${position.x}px`);
  }

  private endDrag(): void {
    this.storeService.set(null);
    this.eventsService.endDrag();

    this.renderer.removeStyle(this.nativeElement, 'position');
    this.renderer.removeStyle(this.nativeElement, 'top');
    this.renderer.removeStyle(this.nativeElement, 'left');
  }

}
