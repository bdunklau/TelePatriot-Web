import { Component, ViewChild, OnInit, OnDestroy, HostListener, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
// import { VideoChatService } from '../video-chat/video-chat.service';
import { VideoTokenService } from '../video-token/video-token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { /*Subject, Observable,*/ Subscription } from 'rxjs';
import * as moment from 'moment';
import { LogService } from '../log/log.service';
import * as huh from "webrtc-adapter";
import { take } from 'rxjs/operators';
import { VideoNode } from '../video-node/video-node.model';
import { VideoInvitation } from '../video-invitation/video-invitation.model';
import { VideoNodeService } from '../video-node/video-node.service';
import { VideoChatService } from '../video-chat/video-chat.service';


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
  selector: 'app-video-invitation',
  templateUrl: './video-invitation.component.html',
  styleUrls: ['./video-invitation.component.css']
})
export class VideoInvitationComponent implements OnInit, OnDestroy {

    name: string;
    // tokenDate: number;
    // vtSub: Subscription;
    date_ms: number;
    @ViewChild('preview', {static: false}) previewElement: ElementRef;
    @ViewChild('list', {static: false}) listRef: ElementRef;
    videoTrack: LocalVideoTrack;
    localTracks: LocalTrack[] = [];
    isInitializing: boolean = true;
    activeRoom: Room;
    participants: Map<Participant.SID, RemoteParticipant>;
    private currentRoomId: string;
    private videoNodeSubscription: Subscription;
    private phone: string;

    // // form fields
    // roomValue = "-Ls9al1BYJr4IVBuytD0";//: string;
    // tokenValue: any;


    constructor(
        private readonly videoChatService: VideoChatService,
        private readonly videoNodeService: VideoNodeService,
        // private vt: VideoTokenService,   // don't think I need this
        private route: ActivatedRoute,
        private router: Router,
        private readonly renderer: Renderer2,
        private log: LogService) {
          this.name = route.snapshot.params.name;
          this.phone = route.snapshot.params.sms_phone;
    }


    async ngOnInit() {

        console.log('this.route.data has toPromise()??  ', this.route.data);
        let obj = await this.route.data.pipe(take(1)).toPromise();
        const vi = obj.videoInvitation;
        const vn = obj.videoNode
        console.log('vi = ', vi);
        console.log('vn = ', vn);

        if(vi) {
            this.videoChatService.acceptInvitation(vi); // TODO should be videoInvitationService
        }
        this.videoChatService.connectRequest(vn);

        this.figureOutConnectivity(vn, vi);
    }

    @HostListener('window:beforeunload')
    async ngOnDestroy() {
        this.doDisconnect();
        if(this.videoNodeSubscription) this.videoNodeSubscription.unsubscribe();
        console.log('doDisconnect()');
    }

    async ngAfterViewInit() {
        this.d('ngAfterViewInit(): this.previewElement && this.previewElement.nativeElement = '+(this.previewElement && this.previewElement.nativeElement));
        if (this.previewElement && this.previewElement.nativeElement) {
            await this.initializeDevice();
        }
    }


    figureOutConnectivity(vn:VideoNode, vi:VideoInvitation) {
        this.d('figureOutConnectivity()')
        // const token = vn.video_participants[vi.guest_id].twilio_token;
        //
        // // connect right off the bat - because that's why you're here
        // this.connect(vn.room_id, token);

        this.videoNodeSubscription = this.videoNodeService.watchVideoNode(vn.val.video_node_key).subscribe(res => {
            console.log('figureOutConnectivity(): watchVideoNode line1')
            const vnode = new VideoNode(res);
            console.log('vnode = ', vnode);

            console.log("vi[\'guest_id\'] = ", vi.val['guest_id']);

            var missionAccomplished = vnode.val['email_to_participant_send_date'] != null
            if(missionAccomplished) {
                if(this.activeRoom) this.activeRoom.disconnect();
                this.router.navigate(['/mission-accomplished', vnode.val['room_id'], vnode.val['sms_phone'] ]);
                return;
            }


            // ABOVE: is all the "should we even be on this page" stuff
            // BELOW: is all the "figure out connectivity stuff"


            // the big else
            else {
                this.setContent(vnode);

                var doIHaveToken = false;
                // Should we be connected?
                const me = vnode.getParticipant(vi.val['guest_id']);
                this.d("watchVideoNode(): me = "+ me);
                const iAmParticipant = me != null;
                var token;
                if(iAmParticipant) {
                    this.d('room_id = '+vnode.val['room_id'])
                    if (vnode.val['room_id'] !=null && vnode.val['room_id'].startsWith("record")) {
                        token = me.val['twilio_token_record'];
                        this.d('twilio_token_record = '+token);
                    }
                    else {
                        token = me.val['twilio_token'];
                        this.d('twilio_token = '+token);
                    }

                    doIHaveToken = token != null;
                }
                // console.log("token = ", token);

                const connected = this.activeRoom != null && (this.activeRoom.state == "connected" || this.activeRoom.state == "reconnecting" || this.activeRoom.state == "reconnected");
                const shouldBeConnected = me != null && me.isConnected();
                const iAmAbleToConect = doIHaveToken;
                const doINeedToConnect = !connected && shouldBeConnected;
                const iAmAboutToConnect = iAmAbleToConect && doINeedToConnect;

                const shouldBeDisconnected = !shouldBeConnected;
                const doINeedToDisconnect = connected && shouldBeDisconnected;
                const iAmAboutToDisconnect = doINeedToDisconnect;

                const connectedToTheWrongRoom = connected && vnode.val['room_id'] != this.currentRoomId;
                const doINeedToSwitchRooms = shouldBeConnected && connectedToTheWrongRoom;
                const iAmAboutToSwitchRooms = iAmAbleToConect && doINeedToSwitchRooms;

                if(this.activeRoom)  this.d("watchVideoNode(): this.activeRoom.state = "+this.activeRoom.state);
                else this.d('watchVideoNode(): this.activeRoom='+this.activeRoom);

                if(iAmAboutToConnect) {
                    this.d("connecting because...");
                    this.d("doIHaveToken="+doIHaveToken);
                    if(this.activeRoom) {
                        this.d("and this.activeRoom.state="+this.activeRoom.state);
                    }
                    else this.d('and this.activeRoom='+this.activeRoom);

                    if(me!=null) this.d('and me.isConnected()='+me.isConnected());
                    else this.d('and me='+me);

                    this.doConnect(vnode.val['room_id'], token);
                    this.currentRoomId = vnode.val['room_id'];
                }
                else if(iAmAboutToDisconnect) {
                    this.d("disconnecting...");
                    this.doDisconnect();
                    this.currentRoomId = vnode.val['room_id'];
                }
                else if(iAmAboutToSwitchRooms) {
                    console.log("switching rooms - disconnecting...");
                    this.doDisconnect();
                    this.initializeDevice();
                    console.log("connecting...");
                    this.doConnect(vnode.val['room_id'], token);
                    this.currentRoomId = vnode.val['room_id'];
                }
                else {
                    console.log("not connecting - because iAmAboutToConnect = ", iAmAboutToConnect);
                    console.log('iAmAbleToConect && doINeedToConnect = ', iAmAbleToConect, ' && ', doINeedToConnect, ' = ', (iAmAbleToConect && doINeedToConnect));
                    console.log('doINeedToConnect = !connected && shouldBeConnected = ', (!connected), ' && ', shouldBeConnected, ' = ', doINeedToConnect);
                    console.log('iAmAbleToConect = doIHaveToken = ', doIHaveToken);
                    console.log('shouldBeConnected = me != null && me.isConnected() = ', (me!=null), ' && ', me.isConnected(), ' = ', shouldBeConnected);
                    console.log('connected = this.activeRoom... && this.activeRoom.state...');
                    // console.log('this.activeRoom = ', this.activeRoom);
                    // if(this.activeRoom != null) console.log('this.activeRoom.state = ', this.activeRoom.state);
                }
            } // end "the big else"

        });

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
    async doConnect(roomName: string, auth_token: string) {
        // let tracks = createLocalTracks({ audio: true, video: true });
        let room: Room = null;
        let roomValue = roomName;
        let tracks = this.localTracks;
        this.d('doConnect(): this.localTracks = '+this.localTracks);
        try {
            const token = auth_token;
            room =
                await connect(
                    token, {
                        logLevel: 'debug',
                        name: roomValue,
                        preferredAudioCodecs: ['isac'],
                        preferredVideoCodecs: ['H264'],
                        tracks: tracks,
                        // dominantSpeaker: true,
                        // automaticSubscription: true
                    } as ConnectOptions);
            this.d(`OK: =======================================================`);
            this.d(`OK: roomName = ${roomName}`);
            this.d(`OK: token = ${auth_token}`);
            this.d(`OK: this.activeRoom = ${this.activeRoom}`);
            this.d('returning room = '+room+' for room name='+roomValue);
            this.activeRoom = room;

            this.initialize(this.activeRoom.participants);
            this.registerRoomEvents();

        } catch (error) {
            this.d(`ERROR: ======================================================`);
            this.d(`ERROR: Unable to connect to Room: ${error.message}`);
            this.d(`ERROR: roomName = ${roomName}`);
            this.d(`ERROR: token = ${auth_token}`);
            if(this.activeRoom) {
                this.d(`ERROR: this.activeRoom.participants = ${this.activeRoom.participants}`);
                this.d(`ERROR: this.activeRoom.localParticipant = ${this.activeRoom.localParticipant}`);
            }
        } finally {
            // if (room) {
            //     this.roomBroadcast.next(true);
            // }
        }
    }


    doDisconnect() {
        if(this.activeRoom) {
            this.activeRoom.disconnect();
            this.d("disconnected from activeRoom="+this.activeRoom);
            this.initializeDevice();
        }
    }

    private registerRoomEvents() {
        this.activeRoom
            .on('disconnected',
                (room: Room) => { /*room.localParticipant.tracks.forEach(publication => this.detachLocalTrack(publication.track))*/ }
              )
            .on('participantConnected',
                (participant: RemoteParticipant) => /*this.participants.add*/this.addParticipant(participant))
            .on('participantDisconnected',
                (participant: RemoteParticipant) => /*this.participants.remove*/this.removeParticipant(participant))
            // .on('trackSubscribed', (track:RemoteTrack, publication:RemoteTrackPublication, participant:RemoteParticipant) => {
            //     this.d('registerRoomEvents(): track = '+ track);
            //     this.d('registerRoomEvents(): publication = '+ publication);
            //     this.d('registerRoomEvents(): participant = '+ participant);
            // })
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
        this.d('detachLocalTrack: see this on iphones prematurely?')
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






    // from Swift VideoChatVC...
    descriptionLabel = "Description";
    //video_mission_description
    //edit_video_mission_description_button = Edit
    legislatorLabel = "Legislator"
    //edit_legislator_button = Choose
    //legislatorName =
    state: string;
    chamber: string;
    //district =
    //facebookButton =
    //editFacebookButton =
    //twitterButton =
    //editTwitterButton =
    //fbLabel =
    fbHandle = "";
    fbLink = "";
    //fbId : String? // legislator's FB ID
    //twLabel = "TW:"
    twHandle = "";
    twLink = "";
    videoTitleHeader = "YouTube Video Title"
    //edit_video_title_button = "Edit"
    // video_title: string;
    youtubeVideoDescriptionHeader = "YouTube Video Description"
    //edit_youtube_video_description_button = "Edit"
    //youtube_video_description =
    what_do_you_want_to_do_with_your_video = "What do you want to do with your video?"
    email_to_legislator_label = "Email to Legislator"
    //email_to_legislator =
    post_to_facebook_label = "Post to Facebook"
    //post_to_facebook =
    post_to_twitter_label = "Post to Twitter"
    //post_to_twitter =
    video_status = "Video Status"
    //youtube_status =
    //posted_to_youtube ="Posted to YouTube"
    //facebook_status =
    //posted_to_facebook =
    //twitter_status =
    //posted_to_twitter ="Posted to Twitter"
    //emailed_to_legislator_status =
    //emailed_to_legislator ="Emailed to Legislator"
    //emailed_to_participant_status =
    //emailed_to_participant ="You've got Mail!"

    vnode: VideoNode;

    // put this suff way down here because most of the time, I don't want to see it
    private setContent(vnode: VideoNode) {
        console.log('vnode = ', vnode);
        this.vnode = vnode;
        this.state = vnode.val['legislator_state_abbrev'] ? vnode.val['legislator_state_abbrev'].toUpperCase() : "";
        this.chamber = vnode.val['legislator_chamber'] ? (vnode.val['legislator_chamber'] === "lower" ? "HD" : "SD") : "";
        if(vnode.val['legislator_facebook'] && vnode.val['legislator_facebook'] != "") {
          this.fbHandle = "@"+vnode.val['legislator_facebook'];
          this.fbLink = "https://www.facebook.com/"+vnode.val['legislator_facebook'];
        }
        if(vnode.val['legislator_twitter'] && vnode.val['legislator_twitter'] != "") {
          this.twHandle = "@"+vnode.val['legislator_twitter'];
          this.twLink = "https://www.twitter.com/"+vnode.val['legislator_twitter'];
        }
        // from Swift VideoChatVC...
        // video_mission_description = vnode.val['video_mission_description']
        //edit_video_mission_description_button = Edit
        //legislatorLabel = Legislator
        //edit_legislator_button = Choose
        //legislatorName =
        //state =
        //chamber =
        //district =
        //facebookButton =
        //editFacebookButton =
        //twitterButton =
        //editTwitterButton =
        //fbLabel =
        //fbHandle =
        //fbId : String? // legislator's FB ID
        //twLabel = "TW:"
        //twHandle =
        //videoTitleHeader =
        //edit_video_title_button = "Edit"
        //video_title =
        //youtubeVideoDescriptionHeader = "YouTube Video Description"
        //edit_youtube_video_description_button = "Edit"
        //youtube_video_description =
        //what_do_you_want_to_do_with_your_video ="What do you want to do with your video?"
        //email_to_legislator_label = "Email to Legislator"
        //email_to_legislator =
        //post_to_facebook_label =
        //post_to_facebook =
        //post_to_twitter_label ="Post to Twitter"
        //post_to_twitter =
        //video_status ="Video Status"
        //youtube_status =
        //posted_to_youtube ="Posted to YouTube"
        //facebook_status =
        //posted_to_facebook =
        //twitter_status =
        //posted_to_twitter ="Posted to Twitter"
        //emailed_to_legislator_status =
        //emailed_to_legislator ="Emailed to Legislator"
        //emailed_to_participant_status =
        //emailed_to_participant ="You've got Mail!"
    }



    d(msg:string) {
        let dt = moment().format('M/D/Y HH:mm:ss');
        this.log.d(dt+' VI Comp: phone:'+this.phone+' : '+msg);
    }
}
