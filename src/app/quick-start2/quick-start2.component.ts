import { Component, ViewChild, OnInit, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
// import { VideoChatService } from '../video-chat/video-chat.service';
import { VideoTokenService } from '../video-token/video-token.service';
import { ActivatedRoute/*, Router*/ } from '@angular/router';
import { /*Subject, Observable,*/ Subscription } from 'rxjs';
import * as moment from 'moment';
import { LogService } from '../log/log.service';

// should go in a service
import { connect,
          Participant,
          RemoteTrack,
          RemoteAudioTrack,
          RemoteVideoTrack,
          RemoteParticipant,
          RemoteTrackPublication,
          ConnectOptions,
          LocalTrack,
          LocalVideoTrack,
          Room,
          createLocalTracks } from 'twilio-video';



@Component({
  selector: 'app-quick-start2',
  templateUrl: './quick-start2.component.html',
  styleUrls: ['./quick-start2.component.css']
})
export class QuickStart2Component implements OnInit {

    name: string;
    tokenDate: number;
    vtSub: Subscription;
    date_ms: number;
    @ViewChild('preview', {static: false}) previewElement: ElementRef;
    @ViewChild('list', {static: false}) listRef: ElementRef;
    videoTrack: LocalVideoTrack;
    localTracks: LocalTrack[] = [];
    isInitializing: boolean = true;
    activeRoom: Room;
    participants: Map<Participant.SID, RemoteParticipant>;

    // form fields
    roomValue = "-Ls9al1BYJr4IVBuytD0";//: string;
    tokenValue: any;


    constructor(/*private vc: VideoChatService,*/
                private route: ActivatedRoute,
                private vt: VideoTokenService,
                private log: LogService,
                private readonly renderer: Renderer2) {
        this.name = route.snapshot.params.name;
        // console.log('this.name = ', this.name);
    }

    async ngOnInit() {
        // get token and put in a text field
        // this.name = this.route.snapshot.params['name'];
        // console.log('ngOnInit(): this.name = ', this.name);
        this.date_ms = moment().valueOf();
        console.log('ngOnInit(): date_ms = ', this.date_ms);
        await this.vt.requestTwilioToken(this.name, this.roomValue, this.date_ms);
        this.vtSub = this.vt.getVideoToken(this.date_ms).subscribe(res => {
            console.log('ngOnInit(): res = ', res);
            if(res.length > 0) {
                this.tokenValue = res[0].payload.val()['token'];
                this.tokenDate = res[0].payload.val()['date_ms'];
            }
        });
    }

    async ngAfterViewInit() {
        this.d('ngAfterViewInit(): this.previewElement && this.previewElement.nativeElement = '+(this.previewElement && this.previewElement.nativeElement));
        if (this.previewElement && this.previewElement.nativeElement) {
            await this.initializeDevice();
        }
    }


    private async initializeDevice(kind?: MediaDeviceKind, deviceId?: string) {
        this.d('initializeDevice(): kind='+kind+', deviceId='+deviceId);
        try {
            this.isInitializing = true;

            this.finalizePreview();

            this.localTracks = kind && deviceId
                ? await this.initializeTracks(kind, deviceId)
                : await this.initializeTracks();

            this.d('initializeDevice(): this.localTracks='+this.localTracks);

            this.videoTrack = this.localTracks.find(t => t.kind === 'video') as LocalVideoTrack;
            this.d('initializeDevice(): this.videoTrack='+this.videoTrack);
            const videoElement = this.videoTrack.attach();
            // console.log('videoElement = ', videoElement);
            // this.d('initializeDevice(): videoElement='+videoElement);
            // this.renderer.setStyle(videoElement, 'mute', 'true');
            this.renderer.setStyle(videoElement, 'height', '100%');
            this.renderer.setStyle(videoElement, 'width', '100%');
            this.d('initializeDevice(): this.renderer.appendChild(...) SEEN TWICE?');
            this.renderer.appendChild(this.previewElement.nativeElement, videoElement);
        } finally {
            this.isInitializing = false;
        }
    }

    // join the room
    async onSubmit() {
        // let tracks = createLocalTracks({ audio: true, video: true });
        let room: Room = null;
        let roomValue = this.roomValue;
        try {
            const token = this.tokenValue;
            room =
                await connect(
                    token, {
                        logLevel: 'debug',
                        roomValue,
                        //tracks,
                        // dominantSpeaker: true,
                        // automaticSubscription: true
                    } as ConnectOptions);
        } catch (error) {
            this.d(`ERROR: Unable to connect to Room: ${error.message}`);
        } finally {
            // if (room) {
            //     this.roomBroadcast.next(true);
            // }
        }
        this.d('returning room = '+room+' for room name='+this.roomValue);
        this.activeRoom = room;

        this.initialize(this.activeRoom.participants);
        this.registerRoomEvents();
    }

    private registerRoomEvents() {
        this.activeRoom
            .on('disconnected',
                (room: Room) => room.localParticipant.tracks.forEach(publication => this.detachLocalTrack(publication.track)))
            .on('participantConnected',
                (participant: RemoteParticipant) => /*this.participants.add*/this.addParticipant(participant))
            .on('participantDisconnected',
                (participant: RemoteParticipant) => /*this.participants.remove*/this.removeParticipant(participant))
            .on('trackSubscribed', (track:RemoteTrack, publication:RemoteTrackPublication, participant:RemoteParticipant) => {
                this.d('registerRoomEvents(): track = '+ track);
                this.d('registerRoomEvents(): publication = '+ publication);
                this.d('registerRoomEvents(): participant = '+ participant);
            })
            // .on('dominantSpeakerChanged',
            //     (dominantSpeaker: RemoteParticipant) => this.participants.loudest(dominantSpeaker));
    }

    addParticipant(participant: RemoteParticipant) {
        this.d('add RemoteParticipant: '+participant.identity); // GOOD - we see this
        if (this.participants && participant) {
            this.participants.set(participant.sid, participant);
            this.registerParticipantEvents(participant);
        }
    }

    removeParticipant(participant: RemoteParticipant) {
        if (this.participants && this.participants.has(participant.sid)) {
            this.participants.delete(participant.sid);
        }
    }


    private detachLocalTrack(track: LocalTrack) {
        if (this.isDetachable(track)) {
            track.detach().forEach(el => el.remove());
        }
    }


    initialize(participants: Map<Participant.SID, RemoteParticipant>) {
        this.participants = participants;
        if (this.participants) {
            this.participants.forEach(participant => this.registerParticipantEvents(participant));
        }
    }


    private registerParticipantEvents(participant: RemoteParticipant) {
       this.d('registerParticipantEvents(): participant='+participant);
        if (participant) {
            this.d('registerParticipantEvents(): participant.tracks='+participant.tracks); // GOOD - we see this
            participant.tracks.forEach(publication => {
                this.d('registerParticipantEvents(): participant='+participant+':  this.subscribe(publication)'); // GOOD - we see this
                this.subscribe(publication);
            });
            participant.on('trackPublished', publication => {
                this.d('trackPublished for RemoteParticipant.identity='+participant.identity); // BAD - we do not see this
                this.subscribe(publication)
              }
            );
            participant.on('trackUnpublished',
                publication => {
                    if (publication && publication.track) {
                        this.d('trackUnpublished for RemoteParticipant.identity='+participant.identity);
                        this.detachRemoteTrack(publication.track);
                    }
                });
        }
    }


    private subscribe(publication: RemoteTrackPublication | any) {
        this.d('subscribe(): publication.isSubscribed='+publication.isSubscribed); // GOOD - we see this but always false
        this.d('subscribe(): publication.isTrackEnabled='+publication.isTrackEnabled);
        if (publication && publication.on) {
            publication.on('subscribed', track => {
                this.d('subscribed: RemoteTrackPublication (YOU DON\'T SEE THIS ON SAFARI)'); // BAD - we do not see this
                this.attachRemoteTrack(track)
              }
            );
            publication.on('unsubscribed', track => {
                this.d('unsubscribed: RemoteTrackPublication (YOU DON\'T SEE THIS ON SAFARI)');
                this.detachRemoteTrack(track)
              }
            );
        }
    }


    private attachRemoteTrack(track: RemoteTrack) {
        this.d('attachRemoteTrack: track='+track+'  (YOU DON\'T SEE THIS ON SAFARI)')
        this.d('attachRemoteTrack: RemoteTrack.isAttachable(track)='+this.isAttachable(track));
        if (this.isAttachable(track)) {
            // this method called twice for a participant
            // the first time, element is an <audio> element, type unknown
            // the second time, element is a <video> element, type unknown
            const element = track.attach();
            console.log('element is a -> ', element);
            this.renderer.data.id = track.sid;
            this.renderer.setStyle(element, 'width', '30vw');
            // this.renderer.setStyle(element, 'height', '28vh');
            this.renderer.setStyle(element, 'margin-left', '0%');
            this.renderer.appendChild(this.listRef.nativeElement, element);
            // this.participantsChanged.emit(true); // TODO keep this or what?
        }
    }

    private detachRemoteTrack(track: RemoteTrack) {
        if (this.isDetachable(track)) {
            track.detach().forEach(el => el.remove());
            // this.participantsChanged.emit(true);  // TODO keep this or what?
        }
    }


    leaveRoom() {
        if(this.activeRoom) {
            this.activeRoom.disconnect();
            this.d("disconnected from activeRoom="+this.activeRoom);
        }
    }


    private initializeTracks(kind?: MediaDeviceKind, deviceId?: string) {
        this.d('initializeTracks(): kind='+kind+', deviceId='+deviceId);
        if (kind) {
            switch (kind) {
                case 'audioinput':
                    this.d('initializeTracks(): createLocalTracks({ audio: { deviceId }, video: true });');
                    return createLocalTracks({ audio: { deviceId }, video: true });
                case 'videoinput':
                    this.d('initializeTracks(): createLocalTracks({ audio: true, video: { deviceId } });');
                    return createLocalTracks({ audio: true, video: { deviceId } });
            }
        }

        this.d('initializeTracks(): createLocalTracks({ audio: true, video: true });');
        return createLocalTracks({ audio: true, video: true });
    }


    private isAttachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
        return !!track &&
            ((track as RemoteAudioTrack).attach !== undefined ||
            (track as RemoteVideoTrack).attach !== undefined);
    }

    private isDetachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
        return !!track &&
            ((track as RemoteAudioTrack).detach !== undefined ||
            (track as RemoteVideoTrack).detach !== undefined);
    }


    finalizePreview() {
        this.d('finalizePreview(): this.videoTrack='+this.videoTrack);
        try {
            if (this.videoTrack) {
                this.d('finalizePreview(): this.videoTrack.detach()');
                this.videoTrack.detach().forEach(element => {
                    this.d('finalizePreview(): element.remove()')
                    element.remove()
                  }
                );
            }
        } catch (e) {
            console.error(e);
            this.d('finalizePreview(): ERROR: '+e);
        }
    }


    // some other resource about loading external js files
    // ref:    https://github.com/angular/angular/issues/4903


    d(msg:string) {
        this.log.d('QuickStart2Component: name:'+this.name+' : '+msg);
    }

}
