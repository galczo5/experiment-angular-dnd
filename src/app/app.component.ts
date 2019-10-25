import {Component} from '@angular/core';
import {Card, CardStatus} from './card/card';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  CardStatus = CardStatus;

}
