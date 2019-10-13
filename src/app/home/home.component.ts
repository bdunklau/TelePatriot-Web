import { Component, ViewChild, OnInit } from '@angular/core';
import { Room, LocalTrack, LocalVideoTrack, LocalAudioTrack, RemoteParticipant } from 'twilio-video';
import { RoomsComponent } from '../rooms/rooms.component';
import { CameraComponent } from '../camera/camera.component';
import { SettingsComponent } from '../settings/settings.component';
import { ParticipantsComponent } from '../participants/participants.component';
import { VideoChatService } from '../video-chat/video-chat.service';
import { VideoEvent } from '../video-event/video-event.model';
import { ActivatedRoute } from '@angular/router';
import { /*Subject, Observable,*/ Subscription } from 'rxjs';

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
    @ViewChild('rooms', {static: true}) rooms: RoomsComponent;
    @ViewChild('camera', {static: true}) camera: CameraComponent;
    @ViewChild('settings', {static: true}) settings: SettingsComponent;
    @ViewChild('participants', {static: true}) participants: ParticipantsComponent;

    activeRoom: Room;
    private routeSubscription: Subscription;


    constructor(
        private readonly videoChatService: VideoChatService,
        private route: ActivatedRoute,) { }

    async ngOnInit() {
        // how do we get the path parameters?

        this.routeSubscription = this.route.data.subscribe(routeData => {
            // see video-node.resolver.ts and video-invitation.resolver.ts
            let videoNode = routeData['videoNode'];
            let videoInvitation = routeData['videoInvitation'];
            console.log('HomeComponent: videoNode = ', videoNode);
            console.log('HomeComponent: videoInvitation = ', videoInvitation);

            // Accept the VideoInvitation
            this.videoChatService.acceptInvitation(videoInvitation);

            // Is this where we construct the "connect request" video event ?
            this.videoChatService.connectRequest(videoNode);
        })



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


        // this.routeSubscription = this.route.data.subscribe(routeData => {
        //     let video_node_key = routeData['video_node_key'];
        //     let sms_phone = routeData['sms_phone'];
        //     // first, validate that the phone matches the video_node_key
        // })
    }

    async onSettingsChanged(deviceInfo: MediaDeviceInfo) {
        await this.camera.initializePreview(deviceInfo);
    }

    async onLeaveRoom(_: boolean) {
        if (this.activeRoom) {
            this.activeRoom.disconnect();
            this.activeRoom = null;
        }

        this.camera.finalizePreview();
        const videoDevice = this.settings.hidePreviewCamera();
        this.camera.initializePreview(videoDevice);

        this.participants.clear();
    }


// maybe...
    // async onRoomChanged(roomName: string) {
    //     if (roomName) {
    //         if (this.activeRoom) {
    //             this.activeRoom.disconnect();
    //         }
    //
    //         this.camera.finalizePreview();
    //         const tracks = await this.settings.showPreviewCamera();
    //
    //         this.activeRoom =
    //             await this.videoChatService
    //                       .joinOrCreateRoom(roomName, tracks);
    //
    //         this.participants.initialize(this.activeRoom.participants);
    //         this.registerRoomEvents();
    //
    //         // this.notificationHub.send('RoomsUpdated', true); // LOOK
    //     }
    // }

    onParticipantsChanged(_: boolean) {
        this.videoChatService.nudge();
    }

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
