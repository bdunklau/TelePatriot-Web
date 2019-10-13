import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
// import { VideoChatService } from '../video-chat/video-chat.service';
import { VideoNodeService } from '../video-node/video-node.service';

@Injectable({
  providedIn: 'root'
})
export class VideoNodeGuard implements CanActivate {

  constructor(//private videoChatService: VideoChatService,
              private videoNodeService: VideoNodeService,
              private router: Router,) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {


      // rule:  the sms_phone must be under the video_node_key
      // We're checking to make sure no one is hacking the url


      let expectedMobile = next.params.sms_phone;
      if(!next.params.video_node_key || !expectedMobile) {
          this.router.navigate(['/notfound']);
          return false;
      }

      // let actualMobile = await this.videoChatService.getSmsPhone(next.params.video_node_key);
      let videoNode = await this.videoNodeService.getVideoNode(next.params.video_node_key);
      let actualMobile = videoNode.val.sms_phone;
      console.log('sms_phone = ',actualMobile );


      if(!actualMobile || actualMobile+"" !== expectedMobile) {
          this.router.navigate(['/notfound']);
          return false;
      }


      // This is how we pass data from the guard to the resolver so we don't have to resolve
      // thing twice.  NOTE: next.data is immutable BUT we CAN create a new next.data
      // using the spread operator to keep the previously resolved data
      next.data = {...next.data, /*guarded data*/videoNode: videoNode};

      // now go look at video-node.resolver.ts

      return true;
  }

}
