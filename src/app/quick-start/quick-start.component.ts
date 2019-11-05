import { Component, ViewChild, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RoomsComponent } from '../rooms/rooms.component';
import { CameraComponent } from '../camera/camera.component';
// import { SettingsComponent } from '../settings/settings.component';
import { ParticipantsComponent } from '../participants/participants.component';
import { VideoChatService } from '../video-chat/video-chat.service';
import { VideoNodeService } from '../video-node/video-node.service';
import { VideoNode } from '../video-node/video-node.model';
import { VideoEvent } from '../video-event/video-event.model';
import { ActivatedRoute, Router } from '@angular/router';
import { /*Subject, Observable,*/ Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import { connect, ConnectOptions, LocalTrack, Room, LocalVideoTrack, LocalAudioTrack, RemoteParticipant, grant } from 'twilio-video';
import * as js from './therealcode.js';


@Component({
  selector: 'app-quick-start',
  templateUrl: './quick-start.component.html',
  styleUrls: ['./quick-start.component.css']
})
export class QuickStartComponent implements OnInit, OnDestroy {


    constructor(private route: ActivatedRoute,) { }

    async ngOnInit() {
        console.log('this.route.snapshot.params[name] = ', this.route.snapshot.params['name']);
        console.log('this.route.snapshot.params[token] = ', this.route.snapshot.params['token']);

        js.init(this.route.snapshot.params['name'], this.route.snapshot.params['token']);
    }

    @HostListener('window:beforeunload')
    async ngOnDestroy() {
    }


}
