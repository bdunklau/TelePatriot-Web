import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { VideoNode } from '../video-node/video-node.model';

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

  watchVideoNode(video_node_key: string) {
    return this.db.object('video/list/'+video_node_key).valueChanges();
  }
}
