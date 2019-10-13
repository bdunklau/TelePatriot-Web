
// from    https://www.twilio.com/blog/video-chat-app-asp-net-core-angular-twilio

import { connect, ConnectOptions, LocalTrack, Room } from 'twilio-video';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject , Observable } from 'rxjs';
// import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';
import { VideoNode } from '../video-node/video-node.model';
import { VideoEvent } from '../video-event/video-event.model';
import { VideoInvitation } from '../video-invitation/video-invitation.model';
import * as _ from 'lodash';


interface AuthToken {
    token: string;
}

export interface NamedRoom {
    id: string;
    name: string;
    maxParticipants?: number;
    participantCount: number;
}

export type Rooms = NamedRoom[];

@Injectable({
    providedIn: 'root'
})
export class VideoChatService {
    $roomsUpdated: Observable<boolean>;

    private roomBroadcast = new ReplaySubject<boolean>();

    constructor(private readonly http: HttpClient,
                private db: AngularFireDatabase,) {  // AngularFireDatabase:  https://github.com/angular/angularfire2/blob/master/src/database/database.ts
        this.$roomsUpdated = this.roomBroadcast.asObservable();
    }

    acceptInvitation(videoInvitation: VideoInvitation) {
        // video/list/[video_node_key]/video_participants/[guest uid]/[key] = [value]
        // and also
        // video/list/[video_node_key]/room_id = [room_id]
        var nodes = {}
        let video_node_key = videoInvitation.val.video_node_key;
        let guest_id = videoInvitation.val.guest_id;
        _.each(Object.keys(videoInvitation.val), key => {
            nodes['video/list/'+video_node_key+'/video_participants/'+guest_id+'/'+key] = videoInvitation.val[key];
        })
        nodes['video/list/'+video_node_key+'/room_id'] = videoInvitation.val.room_id
        console.log('updating these nodes = ', nodes);
        this.db.object('/').update(nodes);
    }

    connectRequest(videoNode: VideoNode) {
        let ve: VideoEvent = new VideoEvent(videoNode, "connect request");
        // ve.save();
        console.log('ve = ', ve);
        console.log('ve.toObj() = ', ve.toObj());
        this.db.list("video/video_events").push(ve.toObj());

      // let ve = VideoEvent(uid: TPUser.sharedInstance.getUid(),
                            // name: TPUser.sharedInstance.getName(),
                            // video_node_key: vn.getKey(),
                            // room_id: room_id,
                            // request_type: request_type,
                            // RoomSid: vn.room_sid,
                            // MediaUri: vn.composition_MediaUri) /*keeps the server from trying to create a room that already exists - prevents js exception   see switchboard.js:connect() */
      //   ve.save()
    }


// maybe...
    // private async getAuthToken() {
    //     const auth =
    //         await this.http
    //                   .get<AuthToken>(`api/video/token`)
    //                   .toPromise();
    //
    //     return auth.token;
    // }


    getAllRooms() {
        return this.http
                   .get<Rooms>('api/video/rooms')
                   .toPromise();
    }

    // returns the sms_phone number under the video_node_key, used for validating the /video/invitation url
    async getSmsPhone(video_node_key: string): Promise<string> {
        /**
        this.db.object(path) returns AngularFireObject
        AngularFireObject:   https://github.com/angular/angularfire2/blob/master/src/database/interfaces.ts
        **/

        let dataSnapshot = await this.db.object('video/list/'+video_node_key).query.ref.once('value')
        if(!dataSnapshot.val()) {
          return null;
        }
        return dataSnapshot.val().sms_phone;
    }


// maybe
    // async joinOrCreateRoom(name: string, tracks: LocalTrack[]) {
    //     let room: Room = null;
    //     try {
    //         const token = await this.getAuthToken();
    //         room =
    //             await connect(
    //                 token, {
    //                     name,
    //                     tracks,
    //                     dominantSpeaker: true
    //                 } as ConnectOptions);
    //     } catch (error) {
    //         console.error(`Unable to connect to Room: ${error.message}`);
    //     } finally {
    //         if (room) {
    //             this.roomBroadcast.next(true);
    //         }
    //     }
    //
    //     return room;
    // }

    nudge() {
        this.roomBroadcast.next(true);
    }
}
