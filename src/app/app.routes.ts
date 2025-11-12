import { Routes } from '@angular/router';
import { CatalogoCoctelesComponent } from './pages/catalogo-cocteles/catalogo-cocteles.component';
import { LoginComponent } from './pages/login/login.component';
import { DetalleCoctelComponent } from './pages/detalle-coctel/detalle-coctel.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { DashboardEstadisticasComponent } from './pages/estadisticas/dashboard-estadisticas.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/cocteles', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'cocteles', 
    component: CatalogoCoctelesComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'cocteles/:id', 
    component: DetalleCoctelComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'inventario',
    component: InventarioComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMINISTRADOR'] }
  },
  {
    path: 'estadisticas',
    component: DashboardEstadisticasComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/cocteles' }
];