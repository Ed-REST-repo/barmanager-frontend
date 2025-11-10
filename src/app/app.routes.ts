import { Routes } from '@angular/router';
import { CatalogoCoctelesComponent } from './pages/catalogo-cocteles/catalogo-cocteles.component';
import { LoginComponent } from './pages/login/login.component';
import { DetalleCoctelComponent } from './pages/detalle-coctel/detalle-coctel.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: CatalogoCoctelesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cocteles/:id', component: DetalleCoctelComponent },
  {
    path: 'inventario',
    component: InventarioComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMINISTRADOR'] }
  },
  { path: '**', redirectTo: '' }
];
