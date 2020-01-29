import { VideoNode } from '../video-node/video-node.model';
import * as moment from 'moment';


// Generate model classes with ng cli like this:
// ng generate class video-event/video-event --type=model
export class VideoEvent {
  // what are the fields?
  uid: string;   // the invited person, not the host
  name: string;  // the invited person, not the host
  video_node_key: string;
  room_id: string;
  request_type: string;
  RoomSid: string;
  MediaUri: string; /*keeps the server from trying to create a room that already exists - prevents js exception   see switchboard.js:connect() */
  date: string;
  date_ms: number;


  constructor(videoNode: VideoNode, request_type: string) {
    if(videoNode.val.video_invitation_key && videoNode.val.video_invitation_key.indexOf("guest") != -1) {
      const start = videoNode.val.video_invitation_key.indexOf("guest") + "guest".length;
      this.uid = videoNode.val.video_invitation_key.substring(start);
    }
    this.name = videoNode.val.video_invitation_extended_to;
    this.video_node_key = videoNode.val.video_node_key;
    this.room_id = videoNode.val.room_id;
    this.request_type = request_type;
    this.RoomSid = videoNode.val.room_sid;
    this.MediaUri = videoNode.val.composition_MediaUri; 
    this.date = moment().format('ddd MMM D, h:mm:ss a Z Y');
    this.date_ms = moment().valueOf();
  }

  toObj(): any {
    var ret = {};
    if(this.uid) ret['uid'] = this.uid;
    if(this.name) ret['name'] = this.name;
    if(this.video_node_key) ret['video_node_key'] = this.video_node_key;
    if(this.room_id) ret['room_id'] = this.room_id;
    if(this.request_type) ret['request_type'] = this.request_type;
    if(this.RoomSid) ret['RoomSid'] = this.RoomSid;
    if(this.MediaUri) ret['MediaUri'] = this.MediaUri;
    if(this.date) ret['date'] = this.date;
    if(this.date_ms) ret['date_ms'] = this.date_ms;
    return ret;
  }
}
