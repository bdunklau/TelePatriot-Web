import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoInvitationComponent } from './video-invitation/video-invitation.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'video/invitation/:video_node_key/:sms_phone', component: VideoInvitationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    VideoInvitationComponent
  ]
})
export class AppRoutingModule { }
