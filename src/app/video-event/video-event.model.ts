import { VideoNode } from '../video-node/video-node.model';

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


  constructor(videoNode: VideoNode, request_type: string) {
    const start = videoNode.val.video_invitation_key.indexOf("guest") + "guest".length;
    this.uid = videoNode.val.video_invitation_key.substring(start);
    this.name = videoNode.val.video_invitation_extended_to;
    this.video_node_key = videoNode.val.video_node_key;
    this.room_id = videoNode.val.room_id;
    this.request_type = request_type;
    this.RoomSid = videoNode.val.RoomSid
    this.MediaUri = videoNode.val.MediaUri
  }

  toObj(): any {
    var ret = {};
    ret['uid'] = this.uid;
    ret['name'] = this.name;
    ret['video_node_key'] = this.video_node_key;
    ret['room_id'] = this.room_id;
    ret['request_type'] = this.request_type;
    if(this.RoomSid) ret['RoomSid'] = this.RoomSid;
    if(this.MediaUri) ret['MediaUri'] = this.MediaUri;
    return ret;
  }
}
