import { NgModule } from '@angular/core';
import { DragDirective } from './directives/drag.directive';
import { DropDirective } from './directives/drop.directive';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {DndStoreService} from './services/dnd-store.service';
import {DndEventsService} from './services/dnd-events.service';

@NgModule({
  declarations: [DragDirective, DropDirective],
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
    DropDirective
  ]
})
export class AngularDndModule {
}
