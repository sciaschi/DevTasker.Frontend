import { Routes } from '@angular/router';
import {Projects} from './pages/projects/projects';
import {Home} from './pages/home/home';

export const routes: Routes = [
  {
    title: 'Dashboard',
    path: 'dashboard',
    component: Home,
    children: []
  },
  {
    title: 'Projects',
    path: 'projects',
    component: Projects,
    children: []
  },
];
