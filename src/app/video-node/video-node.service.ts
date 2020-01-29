import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { VideoNode } from '../video-node/video-node.model';
import { VideoEvent } from '../video-event/video-event.model';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class VideoNodeService {

  constructor(private db: AngularFireDatabase,) { }

  async getVideoNode(video_node_key: string) {

    let dataSnapshot = await this.db.object('video/list/'+video_node_key).query.ref.once('value')
    if(!dataSnapshot.val()) {
      return null;
    }

    var vn = new VideoNode(dataSnapshot.val());
    vn.val.video_node_key = video_node_key;
    console.log('video_node_key = ', video_node_key);
    console.log('vn.val.video_node_key = ', vn.val.video_node_key);
    return vn;
  }

  async getNodeByCompositionSid(compositionSid: string) {
    let results = await this.db.list('video/list', ref => ref.orderByChild('composition_MediaUri').equalTo('/v1/Compositions/'+compositionSid+'/Media'))
        .snapshotChanges().pipe(take(1))
        .toPromise();
    let videoNodes = _.map(results, result => {
        return new VideoNode(result.payload.val());
    })
    console.log('videoNodes = ', videoNodes);
    if(videoNodes && videoNodes.length > 0) {
      return videoNodes[0];
    }
    else return null;
  }

  requestAccessibleVideoUrl(videoNode: VideoNode) {
    let ve: VideoEvent = new VideoEvent(videoNode, "accessible_video_url_request");
    // ve.save();
    console.log('ve = ', ve);
    console.log('ve.toObj() = ', ve.toObj());
    this.db.list("video/video_events").push(ve.toObj());
  }

  watchVideoNode(video_node_key: string) {
    return this.db.object('video/list/'+video_node_key).valueChanges();
  }
}
