import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { VideoInvitation } from '../video-invitation/video-invitation.model';
import { VideoInvitationService } from '../video-invitation/video-invitation.service';
import { LogService } from '../log/log.service';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class VideoInvitationGuard implements CanActivate {


    constructor(private videoInvitationService: VideoInvitationService,
                private router: Router,
                private log: LogService) {}

    async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean> {

        let vi = await this.videoInvitationService.getVideoInvitation(next.params.sms_phone)

        /**
        This needs to change.  From now on, the video invitation will still be present
        So as the logic is now, the else block will get called and we end up going to
        the video chat screen.

        We probably need a MissionAccomplishedGuard
        **/
        if(!vi || !vi[0]) {
            console.log("next.data.videoNode = ", next.data.videoNode);
            return false;
        }
        else {
            let vi3 = await vi[0].payload.ref.once('value');
            console.log('canActivate: vi3.val() = ', vi3.val());
            let videoInvitation = new VideoInvitation(vi3.val());
            next.data = {...next.data, /*guarded data*/videoInvitation: videoInvitation};

            // why are we using a guard if we always return true

            return true;
        }



    }


    d(msg:string) {
        let dt = moment().format('M/D/Y HH:mm:ss');
        this.log.d(dt+' MissAccompGrd : '+msg);
    }

}
