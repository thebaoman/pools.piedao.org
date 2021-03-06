import { writable } from 'svelte/store';

import pools from '../config/pools.json';

import NotFound from '../pages/NotFound.svelte';
import Pool from '../pages/Pool.svelte';
import Main from '../pages/landings/Main.svelte';
import Tokensswap from '../pages/Tokensswap.svelte';
import Migration from '../pages/Migrations.svelte';
import Dough from '../pages/Dough.svelte';
import Dashboard from '../pages/Dashboard.svelte';
import LPStaking from '../pages/LPStaking.svelte';
import PieLanding from '../pages/PieIndexLanding.svelte';
import Markets from '../pages/Markets.svelte';
import DefiPie from '../pages/landings/defiPie.svelte';
import About from '../pages/landings/about.svelte';
import Oven from '../pages/landings/oven.svelte';
import Experipie from '../pages/ExperiPie.svelte';
import PiePageSwitch from '../pages/PiePageSwitch.svelte';
import Learn from '../pages/Learn.svelte';


export const defaultRouteObj = {
  page: Main,
  params: {
    address: pools.default,
  },
};

const deriveRoute = () => {
  try {
    if(window.location.hash == '') {
      const normal = window.location.pathname.split('/');
      let path = normal.filter((part) => part && part.length > 0);
      if(path.length > 0)
        return path;
    }
    
    const core = window.location.href.split('#')[1];

    if (!core) {
      return [];
    }

    const parts = core.split('/').filter((part) => part && part.length > 0);
    

    return parts;
  } catch (e) {
    return [];
  }
};

function changeUrl(routes) {
  if ("undefined" !== typeof history.pushState) {
    let url = '/';
    routes.forEach( part => {
      url += `${part}/`;
    })
    window.history.pushState({}, '', url);
  } else {
    window.location.assign(url);
  }
}


const formatRoute = (route) => {
  let address;
  let poolAction;
  let referral;
  let method;
  const notFound = { page: NotFound, params: { path: `/${route.join('/')}` } };

  //changeUrl(route);

  switch (route[0] || 'root') {
    case 'about':
      return { page: About };
    case 'dxp-defi-index':
      return { page: DefiPie };
    case 'markets':
      return { page: Markets };
    case 'pies':
      return { page: Dashboard };
    case 'exp':
      address = (route[1] || '0x992e9f1d29e2fdb57a9e09a78e122fafe3720cc5').toLowerCase();
      return { page: Experipie, params: { address }  };
    case 'pie':
      address = (route[1] || '').toLowerCase();
      return { page: PiePageSwitch, params: { address } };
    case 'dough':
      return { page: Dough };
    case 'learn':
      return { page: Learn };
    case 'swap':
      return { page: Tokensswap };
    case 'migrate':
      return { page: Migration, params: { address } };
    case 'oven':
      return { page: Oven };
    case 'stake':
      referral = route[1] || null;

      if (referral) {
        window.localStorage.setItem('referral', referral);
      }
      return { page: LPStaking, params: { referral } };
    case 'pools':
      address = (route[1] || '').toLowerCase();
      poolAction = (route[2] || 'add').toLowerCase();
      method = (route[3] || 'single').toLowerCase();

      if (pools.available.includes(address)) {
        return { page: Pool, params: { address, poolAction, method } };
      }
      break;

    case 'oven':
      address = (route[1] || '').toLowerCase();
      poolAction = (route[2] || 'add').toLowerCase();
      method = (route[3] || 'single').toLowerCase();

      if (pools.available.includes(address)) {
        return { page: Oven, params: { address, poolAction, method } };
      }

      break;
    case 'root':
      return defaultRouteObj;
    default:
      return notFound;
  }

  return notFound;
};

const route = deriveRoute();

export const currentRoute = writable({ ...formatRoute(route) });

window.addEventListener('hashchange', () => {
  const newRoute = deriveRoute();
  const trackPath = '/' + newRoute.join('/');

  if(window.location.origin !== 'http://localhost:8080') {
    window.gtag('event', 'page_view', {
      page_path: trackPath
    })
  } else {
      console.log('Analytics DEV', {
        page_path: trackPath
      })
  }
  
  currentRoute.set({ ...formatRoute(newRoute) });
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
});
