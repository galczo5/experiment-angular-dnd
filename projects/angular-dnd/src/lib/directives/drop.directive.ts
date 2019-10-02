import {Directive, ElementRef, EventEmitter, NgZone, OnInit, Output, Renderer2} from '@angular/core';
import {DndEventsService} from '../services/dnd-events.service';
import {DndStoreService} from '../services/dnd-store.service';
import {DndEvent} from '../types/DndEvents';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Directive({
  selector: '[dndDrop]'
})
export class DropDirective implements OnInit {

  @Output()
  dropped: EventEmitter<any> = new EventEmitter<any>();

  private drag$: Subject<void> = new Subject<void>();
  private nativeElement: HTMLElement;

  constructor(private readonly renderer: Renderer2,
              private readonly zone: NgZone,
              private readonly eventsService: DndEventsService,
              private readonly storeService: DndStoreService,
              el: ElementRef) {
    this.nativeElement = el.nativeElement;
  }

  ngOnInit(): void {
    this.eventsService.events()
      .subscribe((event: DndEvent) => {
        if (event === DndEvent.DRAG_STARTED) {
          this.dragStart();
        } else if (event === DndEvent.DRAG_ENDED) {
          this.drag$.next();
        }
      });
  }

  private dragStart(): void {
    fromEvent(this.nativeElement, 'mouseup')
      .pipe(takeUntil(this.drag$))
      .subscribe((event: MouseEvent) => {
        event.stopPropagation();

        const dragData = this.storeService.get();
        this.eventsService.itemsDropped();
        this.dropped.emit(dragData.payload);
      });
  }

}
