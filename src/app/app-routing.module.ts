import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VideoInvitationComponent } from './video-invitation/video-invitation.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { VideoNodeGuard } from './video-node/video-node.guard';
import { VideoNodeResolver } from './video-node/video-node.resolver';
import { VideoInvitationResolver } from './video-invitation/video-invitation.resolver';
import { VideoInvitationGuard } from './video-invitation/video-invitation.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'notfound', component: NotFoundComponent },
  { path: 'video/invitation/:video_node_key/:sms_phone',
        component: HomeComponent,
        canActivate: [VideoNodeGuard, VideoInvitationGuard],
        resolve: {videoNode: VideoNodeResolver, videoInvitation: VideoInvitationResolver} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    VideoInvitationComponent,
    VideoInvitationResolver,
    VideoNodeResolver,
  ]
})
export class AppRoutingModule { }
