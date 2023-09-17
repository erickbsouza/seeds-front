import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RoutesRoutingModule } from './routes-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { Error403Component } from './sessions/403.component';
import { Error404Component } from './sessions/404.component';
import { Error500Component } from './sessions/500.component';
import { NovaAnaliseComponent } from './nova-analise/nova-analise.component';
import { AnaliseComponent } from './analise/analise.component';
import { AnaliseService } from './analise/analise.service';
import { VisualizarAnaliseComponent } from './analise/visualizar-analise/visualizar-analise.component';

const COMPONENTS: any[] = [
  DashboardComponent,
  LoginComponent,
  RegisterComponent,
  Error403Component,
  Error404Component,
  Error500Component,
  NovaAnaliseComponent,
  AnaliseComponent,
  VisualizarAnaliseComponent
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule, RoutesRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  providers:[AnaliseService]
})
export class RoutesModule {}
