export enum CardStatus {
  TODO = 'TO DO',
  IN_PROGRESS = 'IN PROGRESS',
  DONE = 'DONE'
}

export interface Card {
  id: number;
  title: string;
  description: string;
  tags: Array<string>;
  status: CardStatus;
  stared: boolean;
}
