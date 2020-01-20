import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { CheckinSequenceComponent } from './checkin-sequence/checkin-sequence.component';
import { ActionsComponent } from './actions/actions.component';
import { QueueComponent } from './queue/queue.component';

const routes: Routes = [
    { path: '', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)},
    { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
    { path: 'signup', loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule) },
    {path: 'checkin', component: CheckinSequenceComponent},
    {path:'actions',component:ActionsComponent},
    {path:'queue',component:QueueComponent},
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
