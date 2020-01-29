import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoNodeService } from '../video-node/video-node.service';


@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit {

  private compositionSid: string;

  constructor(
    private route: ActivatedRoute,
    private readonly videoNodeService: VideoNodeService,) { }

  /**
  Get the CompositionSid value from the path
  Query the /video/list nodes for the one with this CompositionSid

  Test:   https://telepatriot-dev.firebaseapp.com/watch/CJc63a7eb0033c5a6f40c648fa8de93470
  **/
  async ngOnInit() {

    this.compositionSid = this.route.snapshot.params['CompositionSid'];
    console.log('this.compositionSid = ', this.compositionSid);
    let videoNode = await this.videoNodeService.getNodeByCompositionSid(this.compositionSid);
    console.log('videoNode = ', videoNode);
    this.videoNodeService.requestAccessibleVideoUrl(videoNode);

    // the above request will trigger the creation of the "accessible" video url (one where no user/pass is required)
    // Trigger:  onAccessibleVideoUrlRequest() in switchboard.js in the TelePatriot-Android project
    // That trigger will do a GET on a url (from twilio)
  }

}
