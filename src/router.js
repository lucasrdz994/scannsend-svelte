// Pages
import Home from './pages/Home.svelte';
import MeliQrs from './pages/MeliQrs.svelte';
import Sent from './pages/Sent.svelte';
import Report from './pages/Report.svelte';
import Dashboard from './pages/Dashboard.svelte';
import Settings from './pages/Settings.svelte';

import { wrap } from 'svelte-spa-router/wrap';
import { push } from 'svelte-spa-router';

import { auth } from './firebase';

const routes = {
  '/': Home,
  '/Dashboard': wrap({
    component: Dashboard,
    conditions: [
      _ => {
        if (auth.currentUser) {
          return true
        } else {
          push('/')
          return false;
        }
      }
    ]
  }),
  '/meliqrs': wrap({
    component: MeliQrs,
    conditions: [
      _ => {
        if (auth.currentUser) {
          return true
        } else {
          push('/')
          return false;
        }
      }
    ]
  }),
  '/sent': wrap({
    component: Sent,
    conditions: [
      _ => {
        if (auth.currentUser) {
          return true
        } else {
          push('/')
          return false;
        }
      }
    ]
  }),
  '/report': wrap({
    component: Report,
    conditions: [
      _ => {
        if (auth.currentUser) {
          return true
        } else {
          push('/')
          return false;
        }
      }
    ]
  }),
  '/settings': wrap({
    component: Settings,
    conditions: [
      _ => {
        if (auth.currentUser) {
          return true
        } else {
          push('/')
          return false;
        }
      }
    ]
  }),
};

export default routes;