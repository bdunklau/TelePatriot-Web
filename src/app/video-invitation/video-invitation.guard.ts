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


        let videoInvitation = await this.videoInvitationService.getVideoInvitation(next.params.sms_phone);


        // This is how we pass data from the guard to the resolver so we don't have to resolve
        // thing twice.  NOTE: next.data is immutable BUT we CAN create a new next.data
        // using the spread operator to keep the previously resolved data
        next.data = {...next.data, /*guarded data*/videoInvitation: videoInvitation};

        // now go look at video-invitation.resolver.ts

        return true;
    }

}
