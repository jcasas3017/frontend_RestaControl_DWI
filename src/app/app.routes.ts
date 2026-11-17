
import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Inicio } from './features/inicio/inicio';
import { CategoriaLista } from './features/categorias/pages/categoria-lista/categoria-lista';
import { MainLayout } from './shared/layouts/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';
import { PlatoLista } from './features/platos/pages/plato-lista/plato-lista';
import { ClienteLista } from './features/clientes/pages/cliente-lista/cliente-lista';
import { MesaLista } from './features/mesas/pages/mesa-lista/mesa-lista';
import { UsuarioLista } from './features/usuarios/pages/usuario-lista/usuario-lista';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        component: Inicio
      },
      {
        path: 'categorias',
        component: CategoriaLista
      },
      {
        path: 'platos',
        component: PlatoLista
      },
      {
        path: 'clientes',
        component: ClienteLista
      },
      { path: 'mesas', component: MesaLista },
      {
        path: 'usuarios',
        component: UsuarioLista
      },
      {
        path: 'control-mesas',
        loadComponent: () =>
          import('./features/control-mesas/pages/control-mesas/control-mesas')
            .then(m => m.ControlMesasComponent),
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];
