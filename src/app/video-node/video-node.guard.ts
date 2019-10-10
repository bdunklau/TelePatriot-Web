import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { VideoChatService } from '../video-chat/video-chat.service';

@Injectable({
  providedIn: 'root'
})
export class VideoNodeGuard implements CanActivate {

  constructor(private videoChatService: VideoChatService,
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

      let actualMobile = await this.videoChatService.getSmsPhone(next.params.video_node_key);
      console.log('sms_phone = ',actualMobile );


      if(!actualMobile || actualMobile+"" !== expectedMobile) {
          this.router.navigate(['/notfound']);
          return false;
      }

      return true;
  }

}
