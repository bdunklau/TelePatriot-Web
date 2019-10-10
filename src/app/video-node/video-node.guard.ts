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

      if(!next.params.video_node_key || !next.params.sms_phone) {
          this.router.navigate(['/notfound']);
          return false;
      }

      var expectedPhone = this.videoChatService.getSmsPhone(next.params.video_node_key);
      console.log('expectedPhone = ', expectedPhone);

      // if(next.params.sms_phone !== videoChatService.getSmsPhone(next.params.video_node_key)) {
      //     this.router.navigate(['/notfound']);
      //     return false;
      // }



      // rule:  the sms_phone must be under the video_node_key
      // We're checking to make sure no one is hacking the url
      // if(actualPhone !== expectedPhone) {
      //     this.router.navigate(['/notfound']);
      //     return false;
      //   }

      return true;
  }

}
