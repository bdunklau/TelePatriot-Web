import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VideoInvitationComponent } from './video-invitation/video-invitation.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { VideoNodeGuard } from './video-node/video-node.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'notfound', component: NotFoundComponent },
  { path: 'video/invitation/:video_node_key/:sms_phone', component: HomeComponent, canActivate: [VideoNodeGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    VideoInvitationComponent
  ]
})
export class AppRoutingModule { }
