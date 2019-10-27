import {Directive, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, Renderer2} from '@angular/core';
import {DndEventsService} from '../services/dnd-events.service';
import {DndStoreService} from '../services/dnd-store.service';
import {fromEvent, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {DndStylesService} from '../services/dnd-styles.service';
import {DndCss} from '../types/DndCss';
import {DndDropCoverFactoryService} from '../services/dnd-drop-cover-factory.service';
import {DragGroup} from '../types/DragGroup';
import {InputUtil} from '../util/input-util';
import {DragData} from '../types/DragData';

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
  dropped: EventEmitter<DragData> = new EventEmitter<DragData>();

  @Output()
  dragEntered: EventEmitter<DragData> = new EventEmitter<DragData>();

  @Output()
  draggedOver: EventEmitter<DragData> = new EventEmitter<DragData>();

  @Output()
  dragLeft: EventEmitter<DragData> = new EventEmitter<DragData>();

  private dragData: DragData;
  private drag$: Subject<void> = new Subject<void>();
  private coverElement: HTMLElement;
  private readonly nativeElement: HTMLElement;

  constructor(private readonly renderer: Renderer2,
              private readonly zone: NgZone,
              private readonly eventsService: DndEventsService,
              private readonly storeService: DndStoreService,
              private readonly stylesService: DndStylesService,
              private readonly coverFactoryService: DndDropCoverFactoryService,
              private el: ElementRef) {
    this.nativeElement = el.nativeElement;
  }

  ngOnInit(): void {
    this.eventsService.dragStarted()
      .pipe(filter(g => InputUtil.isEnabled(this.enabled) && g === this.group))
      .subscribe(() => this.dragStart());

    this.eventsService.dragEnded()
      .pipe(filter(g => InputUtil.isEnabled(this.enabled) && g === this.group))
      .subscribe(() => this.dragEnd());

    this.storeService.values()
      .subscribe(data => this.dragData = data);
  }

  private dragStart(): void {
    this.createCover();
    this.setDropStyles();
    this.registerListeners();
  }

  private dragEnd(): void {
    this.destroyCover();
    this.removeDropStyles();
    this.unregisterListeners();
  }

  private drop(): void {
    this.eventsService.drop(this.group);
    this.dropped.emit(this.dragData);
  }

  private dragEnter(): void {
    this.addClass(DndCss.DROP_ACTIVE);
    this.dragEntered.emit(this.dragData);
  }

  private dragLeave(): void {
    this.removeClass(DndCss.DROP_ACTIVE);
    this.dragLeft.emit(this.dragData);
  }

  private mouseOver(): void {
    this.draggedOver.emit(this.dragData);
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
      .subscribe(() => this.dragEnter());

    fromEvent(this.coverElement, 'mouseover')
      .pipe(takeUntil(this.drag$))
      .subscribe(() => this.mouseOver());

    fromEvent(this.coverElement, 'mouseleave')
      .pipe(takeUntil(this.drag$))
      .subscribe(() => this.dragLeave());
  }

  private unregisterListeners(): void {
    this.drag$.next();
  }

  private getGroupClassName(): string {
    return DndCss.DROP + '-' + this.group;
  }

  private createCover(): void {
    if (InputUtil.isEnabled(this.cover)) {
      this.coverElement = this.coverFactoryService.createCover(this.el.nativeElement);
    } else {
      this.coverElement = this.el.nativeElement;
    }
  }

  private destroyCover(): void {
    if (!InputUtil.isEnabled(this.cover)) {
      return;
    }

    this.coverFactoryService.destroyCover(this.coverElement);
  }

  private setDropStyles() {
    this.addClass(DndCss.DROP);
    this.addClass(this.getGroupClassName());
  }

  private removeDropStyles() {
    this.removeClass(DndCss.DROP);
    this.removeClass(DndCss.DROP_ACTIVE);
    this.removeClass(this.getGroupClassName());
  }

  private addClass(css: DndCss | string): void {
    this.stylesService.addClass(this.coverElement, css);
  }

  private removeClass(css: DndCss | string): void {
    this.stylesService.removeClass(this.coverElement, css);
  }
}
