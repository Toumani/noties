import { Route, Router, Commands, Context } from '@vaadin/router';
import { uiStore } from './stores/ui-store';
import './views/main-layout';
import './views/home/home-view';
import './views/note/note-view';
import './views/categories/categories-view';
import './views/profile/profile-view';
import './views/login/login-view';
import { autorun } from "mobx";

export type ViewRoute = Route & {
  title?: string;
  icon?: string;
  children?: ViewRoute[];
};

const authGuard = async (context: Context, commands: Commands) => {
  if (!uiStore.loggedIn && sessionStorage.getItem('logged-in') === 'false') {
    // Save requested path
    sessionStorage.setItem('login-redirect-path', context.pathname);
    return commands.redirect('/login');
  }
  return undefined;
}
autorun(() => {
  if (uiStore.loggedIn || sessionStorage.getItem('logged-in') === 'true') {
    Router.go(sessionStorage.getItem('login-redirect-path') || '/notes');
  } else {
    if (location.pathname !== '/login') {
      sessionStorage.setItem('login-redirect-path', location.pathname);
      Router.go('login')
    }
  }
})
export const views: ViewRoute[] = [
  // place routes below (more info https://vaadin.com/docs/latest/fusion/routing/overview)
  {
    path: '',
    component: 'home-view',
    icon: '',
    title: '',
  },
  {
    path: 'notes',
    component: 'home-view',
    icon: 'lumo:unordered-list',
    title: 'Notes',
  },
  {
    path: 'notes/categories=:categories',
    component: 'home-view',
  },
  {
    path: 'note/:id',
    component: 'note-view',
  },
  {
    path: 'categories',
    component: 'categories-view',
    icon: 'vaadin:mailbox',
    title: 'Catégories',
  },
  {
    path: 'profile',
    component: 'profile-view',
    icon: 'lumo:user',
    title: 'Profil',
  },
];
export const routes: ViewRoute[] = [
  { path: 'login', component: 'login-view' },
  {
    path: 'logout',
    action: (_: Context, commands: Commands) => {
      uiStore.logout();
      return commands.redirect('/login')
    }
  },
  {
    path: '/',
    component: 'main-layout',
    children: [...views],
    action: authGuard,
  },
];
