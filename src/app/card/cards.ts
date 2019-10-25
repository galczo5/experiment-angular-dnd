/* tslint:disable:max-line-length */
import {Card, CardStatus} from './card';

export const data: Array<Card> = [
  {
    id: 1,
    title: 'Card one',
    description: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies.',
    tags: ['card', 'project', 'one'],
    status: CardStatus.TODO,
    stared: false
  },
  {
    id: 2,
    title: 'Next example',
    description: 'Curabitur et ligula. Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac.',
    tags: ['example'],
    status: CardStatus.TODO,
    stared: false
  },
  {
    id: 3,
    title: 'Thing in progress',
    description: 'Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis velit.',
    tags: ['stuff', 'awesome', 'in time'],
    status: CardStatus.IN_PROGRESS,
    stared: true
  },
  {
    id: 4,
    title: 'Done and ready',
    description: 'Quisque lorem tortor fringilla sed, vestibulum id, eleifend justo vel bibendum sapien massa ac turpis faucibus orci luctus non.',
    tags: ['ready'],
    status: CardStatus.DONE,
    stared: true
  },
  {
    id: 5,
    title: 'First version of PoC',
    description: 'Nulla ipsum dolor lacus, suscipit adipiscing.',
    tags: ['PoC', '1.0'],
    status: CardStatus.DONE,
    stared: false
  },
  {
    id: 6,
    title: 'MVP of Drag and Drop',
    description: 'Cum sociis natoque penatibus et ultrices volutpat. Nullam wisi ultricies a, gravida vitae, dapibus risus ante sodales lectus blandit eu, tempor diam pede cursus vitae, ultricies eu, faucibus quis, porttitor eros.',
    tags: ['DnD', 'Drag', 'Drop', 'MVP', '1.0'],
    status: CardStatus.DONE,
    stared: false
  }
];
