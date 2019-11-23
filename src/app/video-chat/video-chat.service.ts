
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
import * as moment from 'moment';
import { LogService } from '../log/log.service';

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
    // $roomsUpdated: Observable<boolean>;

    // private roomBroadcast = new ReplaySubject<boolean>();

    constructor(private readonly http: HttpClient,
                private log: LogService,
                private db: AngularFireDatabase,) {  // AngularFireDatabase:  https://github.com/angular/angularfire2/blob/master/src/database/database.ts
        // this.$roomsUpdated = this.roomBroadcast.asObservable();
    }

    acceptInvitation(videoInvitation: VideoInvitation) {
        // video/list/[video_node_key]/video_participants/[guest uid]/[key] = [value]
        // and also
        // video/list/[video_node_key]/room_id = [room_id]
        const now = moment();
        const start_date = now.format('ddd MMM D, h:mm:ss a Z Y');
        const start_date_ms = now.valueOf();
        var nodes = {}
        let video_node_key = videoInvitation.val.video_node_key;
        let guest_id = videoInvitation.val.guest_id;
        nodes['video/list/'+video_node_key+'/video_participants/'+guest_id+'/name'] = videoInvitation.val.guest_name;
        nodes['video/list/'+video_node_key+'/video_participants/'+guest_id+'/present'] = true
        nodes['video/list/'+video_node_key+'/video_participants/'+guest_id+'/start_date'] = start_date; // 'ddd MMM D, h:mm:ss a Z Y'   Sat Oct 12, 12:26:34 PM CDT 2019
        nodes['video/list/'+video_node_key+'/video_participants/'+guest_id+'/start_date_ms'] = start_date_ms;
        // nodes['video/list/'+video_node_key+'/video_participants/'+guest_id+'/twilio_token'] = twilio_token; // HOW IS THIS SET?
        nodes['video/list/'+video_node_key+'/video_participants/'+guest_id+'/uid'] = guest_id;
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


    // getAllRooms() {
    //     return this.http
    //                .get<Rooms>('api/video/rooms')
    //                .toPromise();
    // }

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


    // called by   HomeComponent.onRoomChanged()
    async joinOrCreateRoom(name: string, tracks: LocalTrack[], auth_token: string) {
        this.d('joinOrCreateRoom: tracks = '+ tracks);
        let room: Room = null;
        try {
            const token = auth_token; //await this.getAuthToken();
            room =
                await connect(
                    token, {
                        logLevel: 'debug',
                        name,
                        tracks,
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
        this.d('returning room = '+room+' for name='+name);
        return room;
    }


// not sure what this is for - but you can search for usages
    nudge() {
        // this.roomBroadcast.next(true);
    }


    d(msg:string) {
        this.log.d('VideoChatService: '+msg);
    }
}
