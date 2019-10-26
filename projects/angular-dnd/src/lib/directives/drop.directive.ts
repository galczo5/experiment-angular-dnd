import {Directive, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, Renderer2} from '@angular/core';
import {DndEventsService} from '../services/dnd-events.service';
import {DndStoreService} from '../services/dnd-store.service';
import {fromEvent, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {DndStylesService} from '../services/dnd-styles.service';
import {DndCss} from '../types/DndCss';
import {DndDropCoverFactoryService} from '../services/dnd-drop-cover-factory.service';
import {DragGroup} from '../types/DragGroup';

@Directive({
  selector: '[dndDrop]'
})
export class DropDirective implements OnInit {

  @Input('dndDrop')
  enabled: boolean | string = true;

  @Input('dndGroup')
  group: DragGroup;

  @Input('dndCover')
  cover: boolean | string;

  @Output()
  dropped: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  dragEnter: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  dragOver: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  dragLeave: EventEmitter<any> = new EventEmitter<any>();

  private drag$: Subject<void> = new Subject<void>();
  private coverElement: HTMLElement;

  constructor(private readonly renderer: Renderer2,
              private readonly zone: NgZone,
              private readonly eventsService: DndEventsService,
              private readonly storeService: DndStoreService,
              private readonly stylesService: DndStylesService,
              private readonly coverFactoryService: DndDropCoverFactoryService,
              private readonly el: ElementRef) {
    this.coverElement = el.nativeElement;
  }

  ngOnInit(): void {
    this.eventsService.dragStarted()
      .pipe(filter(g => this.dropEnabled() && g === this.group))
      .subscribe(() => this.dragStart());

    this.eventsService.dragEnded()
      .pipe(filter(g => this.dropEnabled() && g === this.group))
      .subscribe(() => this.dragEnd());
  }

  private dragStart(): void {
    if (this.coverEnabled()) {
      this.createCover();
    }

    this.addClass(DndCss.DROP);
    this.addClass(this.getGroupClassName());
    this.registerListeners();
  }

  private dragEnd(): void {
    if (this.coverEnabled()) {
      this.destroyCover();
    }

    this.removeClass(DndCss.DROP);
    this.removeClass(DndCss.DROP_ACTIVE);
    this.removeClass(this.getGroupClassName());
    this.unregisterListeners();
  }

  private drop(): void {
    const payload = this.storeService.get();
    this.eventsService.drop(this.group);
    this.dropped.emit(payload);
  }

  private unregisterListeners(): void {
    this.drag$.next();
  }

  private registerListeners(): void {
    fromEvent(this.coverElement, 'mouseup')
      .pipe(takeUntil(this.drag$))
      .subscribe((event: MouseEvent) => {
        event.stopPropagation();
        this.drop();
      });

    fromEvent(this.coverElement, 'mouseenter')
      .pipe(takeUntil(this.drag$))
      .subscribe(() => this.addClass(DndCss.DROP_ACTIVE));

    fromEvent(this.coverElement, 'mouseleave')
      .pipe(takeUntil(this.drag$))
      .subscribe(() => this.removeClass(DndCss.DROP_ACTIVE));
  }

  private getGroupClassName(): string {
    return DndCss.DROP + '-' + this.group;
  }

  private dropEnabled(): boolean {
    return !!this.enabled || this.enabled === '';
  }

  private coverEnabled(): boolean {
    return !!this.cover || this.cover === '';
  }

  private createCover(): void {
    this.coverElement = this.coverFactoryService.createCover(this.el.nativeElement);
  }

  private destroyCover(): void {
    this.coverFactoryService.destroyCover(this.coverElement);
  }

  private addClass(css: DndCss | string): void {
    this.stylesService.addClass(this.coverElement, css);
  }

  private removeClass(css: DndCss | string): void {
    this.stylesService.removeClass(this.coverElement, css);
  }
}
