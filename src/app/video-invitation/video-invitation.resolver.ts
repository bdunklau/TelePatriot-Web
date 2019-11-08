import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
// import { VideoNodeService } from '../video-node/video-node.service';
import { VideoInvitation } from '../video-invitation/video-invitation.model';
// import { VideoInvitationService } from '../video-invitation/video-invitation.service';
// import { VideoNode } from '../video-node/video-node.model';


@Injectable()
export class VideoInvitationResolver implements Resolve<VideoInvitation> {

    constructor(/*public videoInvitationService: VideoInvitationService*/) { }

    // TODO use guards instead
    async resolve(route: ActivatedRouteSnapshot) : Promise<VideoInvitation> {

      // see   app-routing.module.ts  for parm names

      return route.data.videoInvitation;

      // now go look at home.component.ts and video-invitation.component.ts
    }

}
