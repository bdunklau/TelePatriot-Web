import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { VideoNodeService } from '../video-node/video-node.service';
import { take } from 'rxjs/operators';
import { VideoNode } from '../video-node/video-node.model';
import { ActivatedRoute, Router } from '@angular/router';
import { /*Subject, Observable,*/ Subscription } from 'rxjs';

@Component({
  selector: 'app-mission-accomplished',
  templateUrl: './mission-accomplished.component.html',
  styleUrls: ['./mission-accomplished.component.css']
})
export class MissionAccomplishedComponent implements OnInit {


    // from Swift...

    //descriptionLabel = Description
    //video_mission_description
    //edit_video_mission_description_button = Edit
    //legislatorLabel = Legislator
    //edit_legislator_button = Choose
    //legislatorName =
    //state =
    //chamber =
    //district =
    //facebookButton =
    //editFacebookButton =
    //twitterButton =
    //editTwitterButton =
    //fbLabel =
    //fbHandle =
    //fbId : String? // legislator's FB ID
    //twLabel = "TW:"
    //twHandle =
    //videoTitleHeader =
    //edit_video_title_button = "Edit"
    //video_title =
    //youtubeVideoDescriptionHeader = "YouTube Video Description"
    //edit_youtube_video_description_button = "Edit"
    //youtube_video_description =
    //what_do_you_want_to_do_with_your_video ="What do you want to do with your video?"
    //email_to_legislator_label = "Email to Legislator"
    //email_to_legislator =
    //post_to_facebook_label =
    //post_to_facebook =
    //post_to_twitter_label ="Post to Twitter"
    //post_to_twitter =
    //video_status ="Video Status"
    //youtube_status =
    //posted_to_youtube ="Posted to YouTube"
    //facebook_status =
    //posted_to_facebook =
    //twitter_status =
    //posted_to_twitter ="Posted to Twitter"
    //emailed_to_legislator_status =
    //emailed_to_legislator ="Emailed to Legislator"
    //emailed_to_participant_status =
    //emailed_to_participant ="You've got Mail!"
    //

    // private legislator_title = "";
    // private legislator_state = "";
    // private legislator_chamber = "";

    vnode: VideoNode;
    youtube_video_description = "";
    videoNodeSubscription: Subscription;
    posts = []


    constructor(private readonly videoNodeService: VideoNodeService,
                private route: ActivatedRoute,
                private router: Router) { }

    async ngOnInit() {

        console.log('this.route.data has toPromise()??  ', this.route.data);
        let obj = await this.route.data.pipe(take(1)).toPromise();
        const vn = obj.videoNode;
        console.log('vn = ', vn);


        this.videoNodeSubscription = this.videoNodeService.watchVideoNode(vn.val.video_node_key).subscribe(res => {
            this.vnode = new VideoNode(res);

            // const chamber = vnode.val['legislator_chamber'];
            // if(chamber) {
            //     if(chamber === "lower") this.legislator_title = "Rep";
            //     if(chamber === "upper") this.legislator_title = "Sen";
            // }
            //
            // const state_abbrev = vnode.val['legislator_state_abbrev'];
            // if(state_abbrev) this.legislator_state = state_abbrev.toUpperCase();
            //
            // const chamber = vnode.val['legislator_chamber'];
            // if(chamber) this.legislator_chamber = chamber==="lower" ? "HD" : "SD";

            // replace \r\n with <P>'s'
            this.youtube_video_description = this.vnode.val['youtube_video_description'];

            var re = /\r\n/gi;
            var str = this.vnode.val['youtube_video_description'];
            this.youtube_video_description = str.replace(re, "&nbsp;<br/>");

            this.posts = [{you_posted: "You posted this video to YouTube",
                            link: this.vnode.val['video_url']}]

            if(this.vnode.val['facebook_post_id']) {
                var p = {you_posted: "You posted this video to Facebook",
                          link: "https://www.facebook.com/"+this.vnode.val['facebook_post_id']};
                this.posts.push(p);
            }

            if(this.vnode.val['twitter_post_id']) {
                var p = {you_posted: "You posted this video to Twitter",
                          link: "https://www.twitter.com/realTelePatriot/status/"+this.vnode.val['twitter_post_id']};
                this.posts.push(p);
            }
        });
    }


    @HostListener('window:beforeunload')
    async ngOnDestroy() {
        if(this.videoNodeSubscription) this.videoNodeSubscription.unsubscribe();
    }

}
