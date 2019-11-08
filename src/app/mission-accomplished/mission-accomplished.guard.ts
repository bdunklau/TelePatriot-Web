import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LogService } from '../log/log.service';
import * as moment from 'moment';
import { VideoNodeService } from '../video-node/video-node.service';


@Injectable({
  providedIn: 'root'
})
/**
If the mission IS accomplished, this guard returns false and redirects us to /mission-accomplished
Seems a little backward - true means the mission hasn't been accomplished yet
**/
export class MissionAccomplishedGuard implements CanActivate {


      constructor(private router: Router,
                  private log: LogService,
                  private videoNodeService: VideoNodeService,) {}

      async canActivate(
          next: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Promise<boolean> {


          // GUARDS DON'T FIRE IN ANY GUARANTEED ORDER, SO IF WE NEED THE VIDEO NODE OBJECT HERE,
          // WE HAVE TO QUERY FOR IT, EVEN THOUGH VideoNodeGuard ALSO QUERIES FOR IT

          let expectedMobile = next.params.sms_phone;
          let video_node_key = next.params.video_node_key;
          if(!video_node_key || !expectedMobile) {
              this.router.navigate(['/notfound']);
              return false;
          }


          let videoNode = await this.videoNodeService.getVideoNode(video_node_key);

          var missionAccomplished = !!videoNode && videoNode.val['email_to_participant_send_date'] != null
          if(missionAccomplished) {
              this.router.navigate(['/mission-accomplished', video_node_key, expectedMobile ]);
              return false;
          }

          return true;


      }


      d(msg:string) {
          let dt = moment().format('M/D/Y HH:mm:ss');
          this.log.d(dt+' MissAccompGrd : '+msg);
      }

}
