import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { VideoInvitation } from '../video-invitation/video-invitation.model';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class VideoInvitationService {

    constructor(private db: AngularFireDatabase,) { }

    async getVideoInvitation(sms_phone: string) {
        console.log('getVideoInvitation()  zzzz');
        let observable = await this.db
            .list("video/invitations", ref => ref.orderByChild('guest_id')
            .equalTo('mobile_phone_'+sms_phone))
            .snapshotChanges().pipe(take(1))
            .toPromise();
        console.log('observable = ', observable);
        return observable;

        // if(!dataSnapshot.val()) {
        //   return null;
        // }
        //
        // var vi = new VideoInvitation(dataSnapshot.val());
        // console.log('VideoInvitation = ', vi);
        // return vi;
    }
}
