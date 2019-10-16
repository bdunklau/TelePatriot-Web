import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Room, LocalTrack, LocalVideoTrack, LocalAudioTrack, RemoteParticipant } from 'twilio-video';
import { RoomsComponent } from '../rooms/rooms.component';
import { CameraComponent } from '../camera/camera.component';
import { SettingsComponent } from '../settings/settings.component';
import { ParticipantsComponent } from '../participants/participants.component';
import { VideoChatService } from '../video-chat/video-chat.service';
import { VideoNodeService } from '../video-node/video-node.service';
import { VideoNode } from '../video-node/video-node.model';
import { VideoEvent } from '../video-event/video-event.model';
import { ActivatedRoute } from '@angular/router';
import { /*Subject, Observable,*/ Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';

// FIXME what do we do about this ASP stuff?
// import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';

@Component({
    selector: 'app-home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

    // https://stackoverflow.com/a/56752507
    // query results available in ngOnInit
    @ViewChild('rooms', {static: false}) rooms: RoomsComponent;
    @ViewChild('camera', {static: false}) camera: CameraComponent;
    @ViewChild('settings', {static: false}) settings: SettingsComponent;
    @ViewChild('participants', {static: false}) participants: ParticipantsComponent;

    activeRoom: Room;
    private routeSubscription: Subscription;
    private videoNodeSubscription: Subscription;
    private currentRoomId: string;

    constructor(
        private readonly videoChatService: VideoChatService,
        private readonly videoNodeService: VideoNodeService,
        private route: ActivatedRoute,) { }

    async ngOnInit() {

        console.log('this.route.data has toPromise()??  ', this.route.data);
        let obj = await this.route.data.pipe(take(1)).toPromise();
        const vi = obj.videoInvitation;
        const vn = obj.videoNode
        console.log('vi = ', vi);
        console.log('vn = ', vn);

        this.videoChatService.acceptInvitation(vi);
        this.videoChatService.connectRequest(vn);





        // const token = vn.video_participants[vi.guest_id].twilio_token;
        //
        // // connect right off the bat - because that's why you're here
        // this.connect(vn.room_id, token);

        this.videoNodeSubscription = this.videoNodeService.watchVideoNode(vn.val.video_node_key).subscribe(res => {
            const vnode = new VideoNode(res);
            console.log('vnode = ', vnode);

            console.log("vi[\'guest_id\'] = ", vi.val['guest_id']);

            var doIHaveToken = false;
            // Should we be connected?
            const me = vnode.getParticipant(vi.val['guest_id']);
            console.log("me = ", me);
            const iAmParticipant = me != null;
            var token;
            if(iAmParticipant) {
                if (vnode.val['room_id'] !=null && vnode.val['room_id'].startsWith("record"))
                    token = me.val['twilio_token_record']
                else
                    token = me.val['twilio_token']

                doIHaveToken = token != null;
            }
            console.log("token = ", token);

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

            if(iAmAboutToConnect) {
                console.log("connecting...");
                this.doConnect(vnode.val['room_id'], token);
                this.currentRoomId = vnode.val['room_id'];
            }
            else if(iAmAboutToDisconnect) {
                console.log("disconnecting...");
                this.doDisconnect(vnode.val['room_id']);
                this.currentRoomId = vnode.val['room_id'];
            }
            else if(iAmAboutToSwitchRooms) {
                console.log("disconnecting...");
                this.doDisconnect(vnode.val['room_id']);
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
                console.log('this.activeRoom = ', this.activeRoom);
                if(this.activeRoom != null) console.log('this.activeRoom.state = ', this.activeRoom.state);
            }
        });




        // const builder =
        //     new HubConnectionBuilder()
        //         .configureLogging(LogLevel.Information)
        //         .withUrl(`${location.origin}/notificationHub`);
        //
        // this.notificationHub = builder.build();
        // this.notificationHub.on('RoomsUpdated', async updated => {
        //     if (updated) {
        //         await this.rooms.updateRooms(); // LOOK
        //     }
        // });
        // await this.notificationHub.start();
    }

    ngOnDestroy() {
        if(this.routeSubscription) this.routeSubscription.unsubscribe();
        if(this.videoNodeSubscription) this.videoNodeSubscription.unsubscribe();
        this.doDisconnect(true);
    }

    // figureOutConnectivity(vnode: VideoNode, guest_id: string) {
    //
    //     var doIHaveToken = false;
    //     const me = vnode.val.video_participants[guest_id];
    //     var iAmParticipant = me != null;
    //     if(iAmParticipant) {
    //         if (currentVideoNode.room_id.startsWith("record"))
    //             doIHaveToken = me.twilio_token_record != null;
    //         else
    //             doIHaveToken = me.twilio_token != null;
    //     }
    //
    //     // Are we connected?
    //     // const connected = room && (room.getState() == RoomState.CONNECTED || room.getState() == RoomState.CONNECTING);
    //
    //     const iAmAbleToConect = doIHaveToken;
    //     const doINeedToConnect = !connected && shouldBeConnected;
    //
    //     const iAmAboutToConnect = iAmAbleToConect && doINeedToConnect;
    //     const iAmAboutToDisconnect = doINeedToDisconnect;
    //     const iAmAboutToSwitchRooms = iAmAbleToConect && doINeedToSwitchRooms;
    //
    //     if(iAmAboutToConnect) {
    //         console.log("connecting...");
    //         doConnect();
    //     }
    //     else if(iAmAboutToDisconnect) {
    //         console.log("disconnecting...");
    //         doDisconnect();
    //     }
    //     else if(iAmAboutToSwitchRooms) {
    //         console.log("disconnecting...");
    //         doDisconnect();
    //         console.log("connecting...");
    //         doConnect();
    //     }
    // }

    async onSettingsChanged(deviceInfo: MediaDeviceInfo) {
        await this.camera.initializePreview(deviceInfo);
    }

    async onLeaveRoom(_: boolean) {
        this.doDisconnect(true);
    }

    async doDisconnect(b: boolean) {
        if (this.activeRoom) {
            this.activeRoom.disconnect();
            this.activeRoom = null;
        }

        this.camera.finalizePreview();
        const videoDevice = this.settings.hidePreviewCamera();
        this.camera.initializePreview(videoDevice);

        this.participants.clear();
    }


    // called by  RoomsComponent.roomChanged
    // async onRoomChanged(roomName: string) {
    //     this.doConnect(roomName, "twilio token not available here - woops");
    // }

    async doConnect(roomName: string, auth_token: string) {
        if (roomName) {
            if (this.activeRoom) {
                this.activeRoom.disconnect();
            }

            this.camera.finalizePreview();
            const tracks = await this.settings.showPreviewCamera();

            this.activeRoom =
                await this.videoChatService
                          .joinOrCreateRoom(roomName, tracks, auth_token);

            console.log('this.activeRoom.participants = ', this.activeRoom.participants)
            this.participants.initialize(this.activeRoom.participants);
            this.registerRoomEvents();

            // this.notificationHub.send('RoomsUpdated', true); // LOOK
        }
    }


    onParticipantsChanged(b: boolean) {
        this.videoChatService.nudge();
    }

    // called by   onRoomChanged()
    private registerRoomEvents() {
        this.activeRoom
            .on('disconnected',
                (room: Room) => room.localParticipant.tracks.forEach(publication => this.detachLocalTrack(publication.track)))
            .on('participantConnected',
                (participant: RemoteParticipant) => this.participants.add(participant))
            .on('participantDisconnected',
                (participant: RemoteParticipant) => this.participants.remove(participant))
            .on('dominantSpeakerChanged',
                (dominantSpeaker: RemoteParticipant) => this.participants.loudest(dominantSpeaker));
    }

    private detachLocalTrack(track: LocalTrack) {
        if (this.isDetachable(track)) {
            track.detach().forEach(el => el.remove());
        }
    }

    private isDetachable(track: LocalTrack): track is LocalAudioTrack | LocalVideoTrack {
        return !!track
            && ((track as LocalAudioTrack).detach !== undefined
            || (track as LocalVideoTrack).detach !== undefined);
    }
}
