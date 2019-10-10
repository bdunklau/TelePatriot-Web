
// from    https://www.twilio.com/blog/video-chat-app-asp-net-core-angular-twilio

import { connect, ConnectOptions, LocalTrack, Room } from 'twilio-video';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject , Observable } from 'rxjs';
// import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';


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
                private db: AngularFireDatabase,) {
        this.$roomsUpdated = this.roomBroadcast.asObservable();
    }

    private async getAuthToken() {
        const auth =
            await this.http
                      .get<AuthToken>(`api/video/token`)
                      .toPromise();

        return auth.token;
    }

    getAllRooms() {
        return this.http
                   .get<Rooms>('api/video/rooms')
                   .toPromise();
    }

    // returns the sms_phone number under the video_node_key, used for validating the /video/invitation url
    async getSmsPhone(video_node_key: string) {
        // var ref = this.db.object('video/list/'+video_node_key).valueChanges().pipe(take(1))
        // ref.subscribe(data  => {
        //     console.log(video_node_key+':  data = ', data);
        // });
        return await this.db.object('video/list/'+video_node_key)
    }

    async joinOrCreateRoom(name: string, tracks: LocalTrack[]) {
        let room: Room = null;
        try {
            const token = await this.getAuthToken();
            room =
                await connect(
                    token, {
                        name,
                        tracks,
                        dominantSpeaker: true
                    } as ConnectOptions);
        } catch (error) {
            console.error(`Unable to connect to Room: ${error.message}`);
        } finally {
            if (room) {
                this.roomBroadcast.next(true);
            }
        }

        return room;
    }

    nudge() {
        this.roomBroadcast.next(true);
    }
}
