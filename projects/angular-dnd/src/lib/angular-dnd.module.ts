import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {DndStoreService} from './services/dnd-store.service';
import {DropDirective} from './directives/drop.directive';
import {DragHandleDirective} from './directives/drag-handle.directive';
import {DragDirective} from './directives/drag.directive';
import {DndEventsService} from './services/dnd-events.service';

@NgModule({
  declarations: [DragDirective, DropDirective, DragHandleDirective],
  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [
    DndStoreService,
    DndEventsService
  ],
  exports: [
    DragDirective,
    DropDirective,
    DragHandleDirective
  ]
})
export class AngularDndModule {
}
