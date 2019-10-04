import {Directive, ElementRef, EventEmitter, NgZone, OnInit, Output, Renderer2} from '@angular/core';
import {DndEventsService} from '../services/dnd-events.service';
import {DndStoreService} from '../services/dnd-store.service';
import {DndEvent} from '../types/DndEvents';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DndStylesService} from '../services/dnd-styles.service';
import {DndCss} from '../types/DndCss';

@Directive({
  selector: '[dndDrop]'
})
export class DropDirective implements OnInit {

  @Output()
  dropped: EventEmitter<any> = new EventEmitter<any>();

  private drag$: Subject<void> = new Subject<void>();
  private readonly nativeElement: HTMLElement;

  constructor(private readonly renderer: Renderer2,
              private readonly zone: NgZone,
              private readonly eventsService: DndEventsService,
              private readonly storeService: DndStoreService,
              private readonly stylesService: DndStylesService,
              el: ElementRef) {
    this.nativeElement = el.nativeElement;
  }

  ngOnInit(): void {
    this.eventsService.events()
      .subscribe((event: DndEvent) => {
        if (event === DndEvent.DRAG_STARTED) {
          this.dragStart();
        } else if (event === DndEvent.DRAG_ENDED) {
          this.dragEnd();
        }
      });
  }

  private dragEnd(): void {
    this.stylesService.removeClass(this.nativeElement, DndCss.DROP);
    this.stylesService.removeClass(this.nativeElement, DndCss.DROP_ACTIVE);
    this.drag$.next();
  }

  private dragStart(): void {
    this.stylesService.addClass(this.nativeElement, DndCss.DROP);
    this.registerDragListeners();
  }

  private registerDragListeners() {
    fromEvent(this.nativeElement, 'mouseup')
      .pipe(takeUntil(this.drag$))
      .subscribe((event: MouseEvent) => {
        event.stopPropagation();
        this.eventsService.itemsDropped();
        this.dropped.emit(this.storeService.get().payload);
      });

    fromEvent(this.nativeElement, 'mouseenter')
      .pipe(takeUntil(this.drag$))
      .subscribe(() => this.stylesService.addClass(this.nativeElement, DndCss.DROP_ACTIVE));

    fromEvent(this.nativeElement, 'mouseleave')
      .pipe(takeUntil(this.drag$))
      .subscribe(() => this.stylesService.removeClass(this.nativeElement, DndCss.DROP_ACTIVE));
  }
}
