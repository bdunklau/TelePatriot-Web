import { Injectable } from '@angular/core';
import { /*AngularFireList,*/ AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VideoTokenService {

    constructor(private db: AngularFireDatabase,) { }



    async requestTwilioToken(name: string, room_name: string, date_ms: number) {
        // write to the database "request twilio token"
        // see:   switchboard.js:onTwilioTokenRequest()
        var evt = {}
        evt['request_type'] = 'twilio token request';
        evt['name'] = name;
        evt['room_name'] = room_name;
        evt['date_ms'] = date_ms;
        this.db.list("video/video_events").push(evt);
    }


    getVideoToken(date_ms: number)  {
        let observable = this.db.list('video/tokens', ref => ref.orderByChild('date_ms').equalTo(date_ms).limitToFirst(1))
                          .snapshotChanges();//.pipe(take(1)).toPromise();

        // console.log('observable = ', observable);
        return observable;//[0].payload.val();
    }

}
