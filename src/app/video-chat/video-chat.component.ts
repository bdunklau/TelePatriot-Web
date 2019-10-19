import { Component, OnInit } from '@angular/core';
import { VideoChatService } from '../video-chat/video-chat.service';
import { VideoNodeService } from '../video-node/video-node.service';
import { VideoNode } from '../video-node/video-node.model';
import { VideoInvitation } from '../video-invitation/video-invitation.model';
// import { VideoEvent } from '../video-event/video-event.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent implements OnInit {

    // notice #localcamera in video-chat.component.html
    // @ViewChild('localcamera', {static: false}) localcamera: CameraComponent;
    // activeRoom: Room;
    // private currentRoomId: string;


    constructor(
        private readonly videoChatService: VideoChatService,
        private readonly videoNodeService: VideoNodeService,
        private route: ActivatedRoute,) { }

    ngOnInit() {

        // console.log('this.route.data has toPromise()??  ', this.route.data);
        // let obj = await this.route.data.pipe(take(1)).toPromise();
        // const vi = obj.videoInvitation;
        // const vn = obj.videoNode
        // console.log('vi = ', vi);
        // console.log('vn = ', vn);
        //
        // this.videoChatService.acceptInvitation(vi);
        // this.videoChatService.connectRequest(vn);
        //
        // this.videoNodeSubscription = this.videoNodeService.watchVideoNode(vn.val.video_node_key).subscribe(res => {
        //     const vnode = new VideoNode(res);
        //     console.log('vnode = ', vnode);
        //
        //     console.log("vi[\'guest_id\'] = ", vi.val['guest_id']);
        //
        //     var doIHaveToken = false;
        //     // Should we be connected?
        //     const me = vnode.getParticipant(vi.val['guest_id']);
        //     console.log("me = ", me);
        //     const iAmParticipant = me != null;
        //     var token;
        //     if(iAmParticipant) {
        //         if (vnode.val['room_id'] !=null && vnode.val['room_id'].startsWith("record"))
        //             token = me.val['twilio_token_record']
        //         else
        //             token = me.val['twilio_token']
        //
        //         doIHaveToken = token != null;
        //     }
        //     console.log("token = ", token);
        //
        //     const connected = this.activeRoom != null && (this.activeRoom.state == "connected" || this.activeRoom.state == "reconnecting" || this.activeRoom.state == "reconnected");
        //     const shouldBeConnected = me != null && me.isConnected();
        //     const iAmAbleToConect = doIHaveToken;
        //     const doINeedToConnect = !connected && shouldBeConnected;
        //     const iAmAboutToConnect = iAmAbleToConect && doINeedToConnect;
        //
        //     const shouldBeDisconnected = !shouldBeConnected;
        //     const doINeedToDisconnect = connected && shouldBeDisconnected;
        //     const iAmAboutToDisconnect = doINeedToDisconnect;
        //
        //     const connectedToTheWrongRoom = connected && vnode.val['room_id'] != this.currentRoomId;
        //     const doINeedToSwitchRooms = shouldBeConnected && connectedToTheWrongRoom;
        //     const iAmAboutToSwitchRooms = iAmAbleToConect && doINeedToSwitchRooms;
        //
        //     if(iAmAboutToConnect) {
        //         console.log("connecting...");
        //         this.doConnect(vnode.val['room_id'], token);
        //         this.currentRoomId = vnode.val['room_id'];
        //     }
        //     else if(iAmAboutToDisconnect) {
        //         console.log("disconnecting...");
        //         this.doDisconnect(vnode.val['room_id']);
        //         this.currentRoomId = vnode.val['room_id'];
        //     }
        //     else if(iAmAboutToSwitchRooms) {
        //         console.log("disconnecting...");
        //         this.doDisconnect(vnode.val['room_id']);
        //         console.log("connecting...");
        //         this.doConnect(vnode.val['room_id'], token);
        //         this.currentRoomId = vnode.val['room_id'];
        //     }
        //     else {
        //         console.log("not connecting - because iAmAboutToConnect = ", iAmAboutToConnect);
        //         console.log('iAmAbleToConect && doINeedToConnect = ', iAmAbleToConect, ' && ', doINeedToConnect, ' = ', (iAmAbleToConect && doINeedToConnect));
        //         console.log('doINeedToConnect = !connected && shouldBeConnected = ', (!connected), ' && ', shouldBeConnected, ' = ', doINeedToConnect);
        //         console.log('iAmAbleToConect = doIHaveToken = ', doIHaveToken);
        //         console.log('shouldBeConnected = me != null && me.isConnected() = ', (me!=null), ' && ', me.isConnected(), ' = ', shouldBeConnected);
        //         console.log('connected = this.activeRoom... && this.activeRoom.state...');
        //         console.log('this.activeRoom = ', this.activeRoom);
        //         if(this.activeRoom != null) console.log('this.activeRoom.state = ', this.activeRoom.state);
        //     }
        // });


    }

    // ngOnDestroy() {
    //     if(this.routeSubscription) this.routeSubscription.unsubscribe();
    //     if(this.videoNodeSubscription) this.videoNodeSubscription.unsubscribe();
    //     this.doDisconnect(true);
    // }
    //
    // async doDisconnect(b: boolean) {
    //     if (this.activeRoom) {
    //         this.activeRoom.disconnect();
    //         this.activeRoom = null;
    //     }
    //
    //     this.camera.finalizePreview();
    //     const videoDevice = this.settings.hidePreviewCamera();
    //     this.camera.initializePreview(videoDevice);
    //
    //     this.participants.clear();
    // }
    //
    //
    // async doConnect(roomName: string, auth_token: string) {
    //     if (roomName) {
    //         if (this.activeRoom) {
    //             this.activeRoom.disconnect();
    //         }
    //
    //         this.localcamera.finalizePreview();
    //         const tracks = await this.settings.showPreviewCamera();
    //
    //         this.activeRoom =
    //             await this.videoChatService
    //                       .joinOrCreateRoom(roomName, tracks, auth_token);
    //
    //         console.log('this.activeRoom.participants = ', this.activeRoom.participants)
    //         this.participants.initialize(this.activeRoom.participants);
    //         this.registerRoomEvents();
    //
    //         // this.notificationHub.send('RoomsUpdated', true); // LOOK
    //     }
    // }

}
