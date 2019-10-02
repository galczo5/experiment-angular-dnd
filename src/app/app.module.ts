import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AngularDndModule } from '../../projects/angular-dnd/src/lib/angular-dnd.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularDndModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
