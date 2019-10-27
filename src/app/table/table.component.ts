import { Component, OnInit } from '@angular/core';
import {CardStatus} from '../card/card';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

  CardStatus = CardStatus;

}
