import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoInvitationComponent } from './video-invitation/video-invitation.component';
import { CameraComponent } from './camera/camera.component';
import { HomeComponent } from './home/home.component';
import { ParticipantsComponent } from './participants/participants.component';
import { RoomsComponent } from './rooms/rooms.component';
import { SettingsComponent } from './settings/settings.component';
import { DeviceSelectComponent } from './settings/device-select/device-select.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
// from   https://www.positronx.io/how-to-connect-firebase-realtime-nosql-cloud-database-with-angular-app-from-scratch/
// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { NotFoundComponent } from './not-found/not-found.component';
import { LocalParticipantComponent } from './local-participant/local-participant.component';
import { RemoteParticipantComponent } from './remote-participant/remote-participant.component';
import { VideoChatComponent } from './video-chat/video-chat.component';
import { MissionAccomplishedComponent } from './mission-accomplished/mission-accomplished.component';
import { QuickStartComponent } from './quick-start/quick-start.component';
import { LogComponent } from './log/log.component';
import { QuickStart2Component } from './quick-start2/quick-start2.component';
import { VideoCreatorsComponent } from './video-creators/video-creators.component';
import { MenuComponent } from './menu/menu.component';
import { LegislatorsComponent } from './legislators/legislators.component';
import { VideoInstructionsComponent } from './video-instructions/video-instructions.component';
import { LegislatorChooserComponent } from './legislator-chooser/legislator-chooser.component';
import { StateChooserComponent } from './state-chooser/state-chooser.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChamberChooserComponent } from './chamber-chooser/chamber-chooser.component';
import { DistrictChooserComponent } from './district-chooser/district-chooser.component';
import { LegislatorComponent } from './legislator/legislator.component';
import { LegislatorOfficeComponent } from './legislator-office/legislator-office.component';
import { SocialMediaDisplayComponent } from './social-media-display/social-media-display.component';
import { TempComponent } from './temp/temp.component';
import { WatchComponent } from './watch/watch.component'; // https://ng-bootstrap.github.io/#/getting-started


@NgModule({
  declarations: [
    AppComponent,
    VideoInvitationComponent,
    CameraComponent,
    HomeComponent,
    ParticipantsComponent,
    RoomsComponent,
    SettingsComponent,
    DeviceSelectComponent,
    NotFoundComponent,
    LocalParticipantComponent,
    RemoteParticipantComponent,
    VideoChatComponent,
    MissionAccomplishedComponent,
    QuickStartComponent,
    LogComponent,
    QuickStart2Component,
    VideoCreatorsComponent,
    MenuComponent,
    LegislatorsComponent,
    VideoInstructionsComponent,
    LegislatorChooserComponent,
    StateChooserComponent,
    ChamberChooserComponent,
    DistrictChooserComponent,
    LegislatorComponent,
    LegislatorOfficeComponent,
    SocialMediaDisplayComponent,
    TempComponent,
    WatchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'TelePatriot'), // Required for everything
    AngularFireDatabaseModule,
    NgbModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
