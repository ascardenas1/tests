import { Route } from '@angular/router';
import { SsoGuard } from 'src/@security/sso/_guard/sso.guard';
import { InitialDataResolver } from 'src/app/app.resolvers';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'src/app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'src/app/layout/layout.component';

import { RoleEnum } from './enums/role.enum';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [
  // Redirect empty path to '/example'
  { path: '', pathMatch: 'full', redirectTo: 'dashboards/analytics' },

  // Redirect signed in user to the '/example'
  //
  // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
  // path. Below is another redirection for that path to redirect the user to the desired
  // location. This is a small convenience to keep all main routes together here on this file.
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboards/analytics' },

  // Auth routes for guests
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'confirmation-required',
        loadChildren: () =>
          import('src/app/modules/auth/confirmation-required/confirmation-required.module').then(
            (m) => m.AuthConfirmationRequiredModule,
          ),
      },
      {
        path: 'sso',
        loadChildren: () =>
          import('src/@security/sso/sso.module').then((m) => m.SsoModule),
      },
      /*
      {
        path: 'sign-in',
        loadChildren: () => import('src/app/modules/auth/sign-in/sign-in.module').then((m) => m.AuthSignInModule),
      },*/
      {
        path: 'sign-up',
        loadChildren: () => import('src/app/modules/auth/sign-up/sign-up.module').then((m) => m.AuthSignUpModule),
      },
    ],
  },

  // Auth routes for authenticated usuarios
  {
    path: '',
    //canActivate: [AuthGuard],
    //canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'sign-out',
        loadChildren: () => import('src/app/modules/auth/sign-out/sign-out.module').then((m) => m.AuthSignOutModule),
      }
    ],
  },

  // Landing routes
  {
    path: '',
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'home',
        loadChildren: () => import('src/app/modules/landing/home/home.module').then((m) => m.LandingHomeModule),
      },
    ],
  },

  // Admin routes
  {
    path: '',
    //canActivate: [AuthGuard],
    canActivateChild: [SsoGuard],
    component: LayoutComponent,
    resolve: {
      initialData: InitialDataResolver,
    },
    children: [
      {
        path: 'dashboards',
        children: [
          {
            path: 'analytics',
            loadChildren: () =>
              import('./modules/admin/dashboard/analytics/analytics.module').then((m) => m.AnalyticsModule),
          },
        ],
      },
      {
        path: 'apps',
        children: [
          {
            path: 'portal-manager',
              data: {
                  role: [`${RoleEnum.SuperAdmin}`, `${RoleEnum.Admin}`],
              },
            loadChildren: () =>
              import('./modules/admin/apps/portal-manager/portal-manager.module').then((m) => m.PortalManagerModule),
          },
          {
            path: 'organizaciones',
            data: {
              role: [`${RoleEnum.SuperAdmin}`],
            },
            loadChildren: () =>
              import('./modules/admin/apps/organizaciones/organizacion.module').then((m) => m.OrganizacionModule),
          },
          {
            path: 'usuarios',
            loadChildren: () => import('./modules/admin/apps/usuarios/users.module').then((m) => m.UsersModule),
          },
          {
            path: 'file-manager',
            data: {
              role: [`${RoleEnum.SuperAdmin}`, `${RoleEnum.Admin}`],
            },
            loadChildren: () =>
              import('./modules/admin/apps/file-manager/file-manager.module').then((m) => m.FileManagerModule),
          },
          {
            path: 'network-manager',
             data: {
               role: [`${RoleEnum.SuperAdmin}`],
             },
            loadChildren: () =>
              import('./modules/admin/apps/network-manager/network-manager.module').then((m) => m.NetworkManagerModule),
          },
          {
            path: 'network-viewer',
             data: {
               role: [`${RoleEnum.Admin}`],
             },
            loadChildren: () =>
              import('./modules/admin/apps/network-viewer/network-viewer.module').then((m) => m.NetworkViewerModule),
          },
        ],
      },
      {
        path: 'pages',
        children: [
          {
            path: 'settings',
            data: {
              role: [`${RoleEnum.SuperAdmin}`, `${RoleEnum.Admin}`],
            },
            loadChildren: () => import('./modules/admin/pages/settings/settings.module').then((m) => m.SettingsModule),
          },
          {
            path: 'coming-soon',
            loadChildren: () =>
              import('./modules/admin/pages/coming-soon/coming-soon.module').then((m) => m.ComingSoonModule),
          },

          // Error
          {
            path: 'error',
            children: [
              {
                path: '404',
                loadChildren: () =>
                  import('./modules/admin/pages/error/error-404/error-404.module').then((m) => m.Error404Module),
              },
              {
                path: '500',
                loadChildren: () =>
                  import('./modules/admin/pages/error/error-500/error-500.module').then((m) => m.Error500Module),
              },
            ],
          },
        ],
      },
    ],
  },
];
