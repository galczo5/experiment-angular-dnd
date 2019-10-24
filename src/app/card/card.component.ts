import {Component, Input, OnInit} from '@angular/core';
import {Card} from './card';
import {CardsService} from '../cards.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input()
  card: Card;

  constructor(private cardsService: CardsService) {}

  toggle(): void {
    this.cardsService.toggle(this.card.id);
  }
}
