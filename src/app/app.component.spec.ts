import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {AngularDndModule} from '../../projects/angular-dnd/src/lib/angular-dnd.module';
import {AppModule} from './app.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularDndModule,
        AppModule
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
