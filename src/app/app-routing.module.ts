import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VideoInvitationComponent } from './video-invitation/video-invitation.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { VideoNodeGuard } from './video-node/video-node.guard';
import { VideoNodeResolver } from './video-node/video-node.resolver';
import { VideoInvitationResolver } from './video-invitation/video-invitation.resolver';
import { VideoInvitationGuard } from './video-invitation/video-invitation.guard';
import { MissionAccomplishedComponent } from './mission-accomplished/mission-accomplished.component';
import { QuickStartComponent } from './quick-start/quick-start.component';
import { QuickStart2Component } from './quick-start2/quick-start2.component';
import { LogComponent } from './log/log.component';
import { MissionAccomplishedGuard } from './mission-accomplished/mission-accomplished.guard';
import { VideoCreatorsComponent } from './video-creators/video-creators.component';
import { LegislatorsComponent } from './legislators/legislators.component';
import { TempComponent } from './temp/temp.component';
import { VideoInstructionsComponent } from './video-instructions/video-instructions.component';
import { WatchComponent } from './watch/watch.component';


const routes: Routes = [
  { path: '', redirectTo: 'video/instructions', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'legislators', component: LegislatorsComponent },
  { path: 'log', component: LogComponent },
  { path: 'mission-accomplished/:video_node_key/:sms_phone', component: MissionAccomplishedComponent,
        canActivate: [VideoNodeGuard],
        resolve: {videoNode: VideoNodeResolver}  },

  { path: 'notfound', component: NotFoundComponent },
  { path: 'quick-start/:name/:token', component: QuickStartComponent },
  { path: 'quick-start2/:name', component: QuickStart2Component },
  { path: 'video/creators', component: VideoCreatorsComponent },
  { path: 'temp', component: TempComponent },
  { path: 'video/invitation/:video_node_key/:sms_phone',
        component: VideoInvitationComponent,
        canActivate: [VideoNodeGuard, VideoInvitationGuard, MissionAccomplishedGuard],
        resolve: {videoNode: VideoNodeResolver, videoInvitation: VideoInvitationResolver} },

  { path: 'video/instructions', component: VideoInstructionsComponent },
  { path: 'watch/:CompositionSid', component: WatchComponent },
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
