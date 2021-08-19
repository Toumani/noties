import { Route } from '@vaadin/router';
import './views/main-layout';
import './views/home/home-view';

export type ViewRoute = Route & {
  title?: string;
  icon?: string;
  children?: ViewRoute[];
};

export const views: ViewRoute[] = [
  // place routes below (more info https://vaadin.com/docs/latest/fusion/routing/overview)
  {
    path: '',
    component: 'home-view',
    icon: '',
    title: '',
  },
  {
    path: 'home',
    component: 'home-view',
    icon: 'la la-list-alt',
    title: 'Todo',
  },
];
export const routes: ViewRoute[] = [
  {
    path: '',
    component: 'main-layout',
    children: [...views],
  },
];
