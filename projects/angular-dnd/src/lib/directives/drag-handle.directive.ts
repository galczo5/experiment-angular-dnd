import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {DragDirective} from './drag.directive';

@Directive({
  selector: '[dndDragHandle]'
})
export class DragHandleDirective implements OnInit {

  private readonly nativeElement: HTMLElement;

  constructor(el: ElementRef,
              private dragDirective: DragDirective) {
    this.nativeElement = el.nativeElement;
  }

  ngOnInit(): void {
    if (this.dragDirective) {
      this.dragDirective.setDragHandle(this.nativeElement);
    }
  }

}
