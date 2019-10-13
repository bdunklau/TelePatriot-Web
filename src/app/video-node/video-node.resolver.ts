import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
// import { VideoNodeService } from '../video-node/video-node.service';
import { VideoNode } from '../video-node/video-node.model';

@Injectable()
export class VideoNodeResolver implements Resolve<VideoNode> {

  constructor(/*public videoNodeService: VideoNodeService*/) { }

  // TODO use guards instead
  async resolve(route: ActivatedRouteSnapshot) : Promise<VideoNode> {

    // see   app-routing.module.ts  for parm names

    // see   video-node.guard.ts - that's where we actually resolved the VideoNode object
    return route.data.videoNode

    // now go look at home.component.ts
  }

}
