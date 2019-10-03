import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {DragDirective} from './drag.directive';

@Directive({
  selector: '[dndDragHandle]'
})
export class DragHandleDirective implements OnInit {

  constructor(private readonly el: ElementRef,
              private dragDirective: DragDirective) {

  }

  ngOnInit(): void {
    if (this.dragDirective) {
      this.dragDirective.setDragHandle(this.el.nativeElement);
    }
  }

}
