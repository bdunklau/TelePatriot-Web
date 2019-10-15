import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { VideoInvitation } from '../video-invitation/video-invitation.model';
import { VideoInvitationService } from '../video-invitation/video-invitation.service';

@Injectable({
  providedIn: 'root'
})
export class VideoInvitationGuard implements CanActivate {


    constructor(private videoInvitationService: VideoInvitationService,
                private router: Router,) {}

    async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean> {

        let vi = await this.videoInvitationService.getVideoInvitation(next.params.sms_phone)
        let vi3 = await vi[0].payload.ref.once('value');
        console.log('canActivate: vi3.val() = ', vi3.val());
        let videoInvitation = new VideoInvitation(vi3.val());
        next.data = {...next.data, /*guarded data*/videoInvitation: videoInvitation};

        // why are we using a guard if we always return true

        return true;

    }

}
