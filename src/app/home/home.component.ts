import { Component, ViewChild, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RoomsComponent } from '../rooms/rooms.component';
import { CameraComponent } from '../camera/camera.component';
import { SettingsComponent } from '../settings/settings.component';
import { ParticipantsComponent } from '../participants/participants.component';
import { VideoChatService } from '../video-chat/video-chat.service';
import { VideoNodeService } from '../video-node/video-node.service';
import { VideoNode } from '../video-node/video-node.model';
import { VideoEvent } from '../video-event/video-event.model';
import { VideoInvitation } from '../video-invitation/video-invitation.model';
import { ActivatedRoute, Router } from '@angular/router';
import { /*Subject, Observable,*/ Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import { connect, ConnectOptions, LocalTrack, Room, LocalVideoTrack, LocalAudioTrack, RemoteParticipant } from 'twilio-video';
import { LogService } from '../log/log.service';


@Component({
    selector: 'app-home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {

    // https://stackoverflow.com/a/56752507
    // query results available in ngOnInit
    @ViewChild('rooms', {static: false}) rooms: RoomsComponent;

    // notice #camera in home.component.html
    @ViewChild('camera', {static: false}) camera: CameraComponent;

    @ViewChild('settings', {static: false}) settings: SettingsComponent;
    @ViewChild('participants', {static: false}) participants: ParticipantsComponent;


    activeRoom: Room;
    private routeSubscription: Subscription;
    private videoNodeSubscription: Subscription;
    private currentRoomId: string;
    private phone: string;
    error = "";
    deviceInfo: MediaDeviceInfo;

    constructor(
        private readonly videoChatService: VideoChatService,
        private readonly videoNodeService: VideoNodeService,
        private route: ActivatedRoute,
        private router: Router,
        private log: LogService) { }

    async ngOnInit() {

        console.log('this.route.data has toPromise()??  ', this.route.data);
        let obj = await this.route.data.pipe(take(1)).toPromise();
        const vi = obj.videoInvitation;
        const vn = obj.videoNode
        console.log('vi = ', vi);
        console.log('vn = ', vn);

        this.videoChatService.acceptInvitation(vi);
        // this.videoChatService.connectRequest(vn);

        console.log("this.route.params['video_node_key'] = ", this.route.params['video_node_key']);
        console.log("this.route.params['sms_phone'] = ", this.route.params['sms_phone']);
        this.phone = this.route.snapshot.params['sms_phone'];


        document.getElementById('button-deviceinfo').onclick = function() {
            this.deviceInfo = this.getDeviceInfo();
            window.alert('deviceInfo.kind = '+this.deviceInfo.kind+'\ndeviceInfo.deviceId = '+this.deviceInfo.deviceId);
        }.bind(this);

        document.getElementById('button-initializePreview').onclick = function() {
            this.camera.initializePreview(this.camera.deviceInfo);
        }.bind(this);

        document.getElementById('button-finalizePreview').onclick = function() {
            this.camera.finalizePreview();
        }.bind(this);

        document.getElementById('button-join').onclick = function() {
            var roomName = (<HTMLInputElement>document.getElementById('room-name')).value;
            var authtoken = (<HTMLInputElement>document.getElementById('authtoken')).value;
            // window.alert('roomName = '+roomName+'\nauthtoken = '+authtoken);
            this.doConnect(roomName, authtoken)
        }.bind(this);

        document.getElementById('button-leave').onclick = function() {
            this.doDisconnect(true)
        }.bind(this);


        // this.figureOutConnectivity(vn, vi);  // also uncomment above:   this.videoChatService.connectRequest(vn);
    }

    getDeviceInfo() {
        return this.settings.getDeviceInfo();
    }

    figureOutConnectivity(vn:VideoNode, vi:VideoInvitation) {
        this.d('figureOutConnectivity()')
        // const token = vn.video_participants[vi.guest_id].twilio_token;
        //
        // // connect right off the bat - because that's why you're here
        // this.connect(vn.room_id, token);

        this.videoNodeSubscription = this.videoNodeService.watchVideoNode(vn.val.video_node_key).subscribe(res => {
            const vnode = new VideoNode(res);
            console.log('vnode = ', vnode);

            console.log("vi[\'guest_id\'] = ", vi.val['guest_id']);

            var missionAccomplished = vnode.val['email_to_participant_send_date'] != null
            if(missionAccomplished) {
                this.router.navigate(['/mission-accomplished', this.route.params['video_node_key'], this.route.params['sms_phone'] ]);
                return;
            }


            // ABOVE: is all the "should we even be on this page" stuff
            // BELOW: is all the "figure out connectivity stuff"


            // the big else
            else {
                this.setContent(vnode);

                var doIHaveToken = false;
                // Should we be connected?
                const me = vnode.getParticipant(vi.val['guest_id']);
                this.d("watchVideoNode(): me = "+ me);
                const iAmParticipant = me != null;
                var token;
                if(iAmParticipant) {
                    if (vnode.val['room_id'] !=null && vnode.val['room_id'].startsWith("record"))
                        token = me.val['twilio_token_record']
                    else
                        token = me.val['twilio_token']

                    doIHaveToken = token != null;
                }
                // console.log("token = ", token);

                const connected = this.activeRoom != null && (this.activeRoom.state == "connected" || this.activeRoom.state == "reconnecting" || this.activeRoom.state == "reconnected");
                const shouldBeConnected = me != null && me.isConnected();
                const iAmAbleToConect = doIHaveToken;
                const doINeedToConnect = !connected && shouldBeConnected;
                const iAmAboutToConnect = iAmAbleToConect && doINeedToConnect;

                const shouldBeDisconnected = !shouldBeConnected;
                const doINeedToDisconnect = connected && shouldBeDisconnected;
                const iAmAboutToDisconnect = doINeedToDisconnect;

                const connectedToTheWrongRoom = connected && vnode.val['room_id'] != this.currentRoomId;
                const doINeedToSwitchRooms = shouldBeConnected && connectedToTheWrongRoom;
                const iAmAboutToSwitchRooms = iAmAbleToConect && doINeedToSwitchRooms;

                if(this.activeRoom)  this.d("watchVideoNode(): this.activeRoom.state = "+this.activeRoom.state);
                else this.d('watchVideoNode(): this.activeRoom='+this.activeRoom);

                if(iAmAboutToConnect) {
                    this.d("connecting because...");
                    this.d("doIHaveToken="+doIHaveToken);
                    if(this.activeRoom) {
                        this.d("and this.activeRoom.state="+this.activeRoom.state);
                    }
                    else this.d('and this.activeRoom='+this.activeRoom);

                    if(me!=null) this.d('and me.isConnected()='+me.isConnected());
                    else this.d('and me='+me);

                    this.doConnect(vnode.val['room_id'], token);
                    this.currentRoomId = vnode.val['room_id'];
                }
                else if(iAmAboutToDisconnect) {
                    this.d("disconnecting...");
                    this.doDisconnect(true /*vnode.val['room_id']*/);
                    this.currentRoomId = vnode.val['room_id'];
                }
                else if(iAmAboutToSwitchRooms) {
                    console.log("disconnecting...");
                    this.doDisconnect(true /*vnode.val['room_id']*/);
                    console.log("connecting...");
                    this.doConnect(vnode.val['room_id'], token);
                    this.currentRoomId = vnode.val['room_id'];
                }
                else {
                    console.log("not connecting - because iAmAboutToConnect = ", iAmAboutToConnect);
                    console.log('iAmAbleToConect && doINeedToConnect = ', iAmAbleToConect, ' && ', doINeedToConnect, ' = ', (iAmAbleToConect && doINeedToConnect));
                    console.log('doINeedToConnect = !connected && shouldBeConnected = ', (!connected), ' && ', shouldBeConnected, ' = ', doINeedToConnect);
                    console.log('iAmAbleToConect = doIHaveToken = ', doIHaveToken);
                    console.log('shouldBeConnected = me != null && me.isConnected() = ', (me!=null), ' && ', me.isConnected(), ' = ', shouldBeConnected);
                    console.log('connected = this.activeRoom... && this.activeRoom.state...');
                    // console.log('this.activeRoom = ', this.activeRoom);
                    // if(this.activeRoom != null) console.log('this.activeRoom.state = ', this.activeRoom.state);
                }
            } // end "the big else"

        });

    }

    @HostListener('window:beforeunload')
    async ngOnDestroy() {
        this.doDisconnect(true);
        if(this.videoNodeSubscription) this.videoNodeSubscription.unsubscribe();
        console.log('doDisconnect()');
    }

    async onSettingsChanged(deviceInfo: MediaDeviceInfo) {
        await this.camera.initializePreview(deviceInfo);
        this.camera.deviceInfo = deviceInfo;
    }

    async onLeaveRoom(_: boolean) {
        this.d('left room - disconnected');
        this.doDisconnect(true);
    }

    async doDisconnect(b: boolean) {
        this.d('doDisconnect()')
        if (this.activeRoom) {
            this.d('doDisconnect(): this.activeRoom.disconnect()')
            this.activeRoom.disconnect();
            // this.activeRoom = null;
        }

        // this.camera.finalizePreview();
        // const videoDevice = this.settings.hidePreviewCamera();
        // this.camera.initializePreview(videoDevice);

        // this.participants.clear();
    }








    async doConnect(roomName: string, auth_token: string) {
        if (roomName) {
            if (this.activeRoom) {
                this.activeRoom.disconnect();
            }

            this.camera.finalizePreview();
            const tracks = await this.settings.showPreviewCamera();
            // const tracks = null;

            this.activeRoom =
                await this.videoChatService
                          .joinOrCreateRoom(roomName, tracks, auth_token);

            // this.roomJoined(this.activeRoom);
            this.activeRoom.on('trackSubscribed', function(track, publication, participant) {
              this.d("doConnect: Subscribed to " + participant.identity + "'s track: " + track.kind);
              var previewContainer = document.getElementById('remote-media');
              this.attachTracks([track], previewContainer);
            });


            this.d('this.activeRoom.participants = '+this.activeRoom.participants)
            this.participants.initialize(this.activeRoom.participants);
            this.registerRoomEvents();

        }



        // if (!roomName) {
        //     alert('Please enter a room name.');
        //     return;
        // }
        //
        // if (this.activeRoom) {
        //     this.activeRoom.disconnect();
        // }
        //
        // this.d("Joining room '" + roomName + "'...");
        // var connectOptions = {
        //     // name: roomName,
        //     // logLevel: 'debug'
        // };
        // connectOptions['name'] = roomName;
        // connectOptions['logLevel'] = 'debug'
        //
        // if (this.previewTracks) {
        //     connectOptions['tracks'] = this.previewTracks;
        //     this.d('button-join: connectOptions.tracks = previewTracks = '+ this.previewTracks);
        // }
        // this.d('doConnect: previewTracks = '+this.previewTracks);
        // this.d('doConnect: connectOptions.tracks = '+ connectOptions['tracks']);
        //
        // // Join the Room with the token from the server and the
        // // LocalParticipant's Tracks.
        // connect(auth_token, connectOptions).then(this.roomJoined, function(error) {
        //     this.d('Could not connect to Twilio: ' + error.message);
        // });
    }



    // participantConnected(participant) {
    //   this.d('participantConnected(): participant = '+participant);
    //   participant.tracks.forEach(publication => {
    //     this.d('participantConnected(): publication.isSubscribed = '+publication.isSubscribed);
    //     const remoteVideo = publication.track.attach();
    //     this.d('remoteVideo = '+remoteVideo);
    //     console.log('remoteVideo = ', remoteVideo);
    //     // if (publication.isSubscribed) {
    //       document.getElementById('remote-media').appendChild(remoteVideo);
    //     // }
    //   });
    //   this.activeRoom.on('trackSubscribed', track => {
    //     document.getElementById('remote-media').appendChild(track.attach());
    //   });
    // }


    // previewTracks;
    //
    // // Successfully connected!
    // roomJoined(room: Room) {
    //   this.d('roomJoined:  room = '+ room);
    //
    //   room.participants.forEach(this.participantConnected);
    //
    //
    //   // this.activeRoom = room;
    //   // try {  window['room'] = this.activeRoom; } catch(e) { this.d('ERROR: trying to set window[room]=activeRoom '+e); }
    //   try {
    //       document.getElementById('button-join').style.display = 'none';
    //       document.getElementById('button-leave').style.display = 'inline';
    //   } catch(e) { this.d('roomJoined: ERROR: setting some button styles: '+e); }
    //
    //   // Attach LocalParticipant's Tracks, if not already attached.
    //   try {
    //       var previewContainer = document.getElementById('local-media');
    //       if (!previewContainer.querySelector('video')) {
    //         this.d('attachParticipantTracks: room = '+ room+': local-media: video');
    //         this.attachParticipantTracks(room.localParticipant, previewContainer);
    //       }
    //   } catch(e) { this.d('roomJoined: ERROR: dealing with local-media object: '+e); }
    //
    //   try {
    //       if(room.participants) {
    //           // Attach the Tracks of the Room's Participants.
    //           room.participants.forEach(function(participant) {
    //             // this.d("roomJoined: Already in Room: '" + participant.identity + "'");
    //             var previewContainer = document.getElementById('remote-media');
    //             this.attachParticipantTracks(participant, previewContainer);
    //           });
    //       }
    //       // else { this.d('roomJoined: room.participants='+room.participants); }
    //   } catch(e) { this.error = 'roomJoined: ERROR: dealing with room.participants.forEach(...): '+e }
    //
    //   try {
    //       // When a Participant joins the Room, log the event.
    //       room.on('participantConnected', function(participant) {
    //         this.d("roomJoined: participantConnected: Joining: '" + participant.identity + "'");
    //       });
    //   } catch(e) { this.d('roomJoined: ERROR: dealing with participantConnected event: '+e); }
    //
      // When a Participant's Track is subscribed to, attach it to the DOM.
      // room.on('trackSubscribed', function(track, publication, participant) {
      //   this.d("roomJoined: Subscribed to " + participant.identity + "'s track: " + track.kind);
      //   var previewContainer = document.getElementById('remote-media');
      //   this.attachTracks([track], previewContainer);
      // });
    //
    //   // When a Participant's Track is unsubscribed from, detach it from the DOM.
    //   room.on('trackUnsubscribed', function(track, publication, participant) {
    //     this.d("Unsubscribed from " + participant.identity + "'s track: " + track.kind);
    //     this.detachTracks([track]);
    //   });
    //
    //   // When a Participant leaves the Room, detach its Tracks.
    //   room.on('participantDisconnected', function(participant) {
    //     this.d("RemoteParticipant '" + participant.identity + "' left the room");
    //     this.detachParticipantTracks(participant);
    //   });
    //
    //   // Once the LocalParticipant leaves the room, detach the Tracks
    //   // of all Participants, including that of the LocalParticipant.
    //   room.on('disconnected', function() {
    //     this.d('Left (disconnected from the room)');
    //     if (this.previewTracks) {
    //       this.previewTracks.forEach(function(track) {
    //         track.stop();
    //       });
    //       this.previewTracks = null;
    //     }
    //     this.detachParticipantTracks(room.localParticipant);
    //     room.participants.forEach(this.detachParticipantTracks);
    //     // this.activeRoom = null;
    //     document.getElementById('button-join').style.display = 'inline';
    //     document.getElementById('button-leave').style.display = 'none';
    //   });
    // } // end   roomJoined()



    // Attach the Tracks to the DOM.
   attachTracks(tracks, container) {
      this.d('attachTracks(): tracks='+tracks+', container='+container);
      tracks.forEach(function(track) {
         this.d('attachTracks(): tracks.forEach')
        container.appendChild(track.attach());
      });
    }

    // Attach the Participant's Tracks to the DOM.
   attachParticipantTracks(participant, container) {
      this.d('attachParticipantTracks(): participant='+participant+',  container='+container);
      var tracks = this.getTracks(participant);
      this.d('attachParticipantTracks(): this.getTracks(participant)='+tracks);
      this.attachTracks(tracks, container);
    }

    // Detach the Tracks from the DOM.
   detachTracks(tracks) {
      this.d('detachTracks()');
      tracks.forEach(function(track) {
        this.d('detachTracks(): tracks.forEach(...)');
        track.detach().forEach(function(detachedElement) {
          this.d('detachTracks(): tracks.forEach( track.detach().forEach(...) )');
          detachedElement.remove();
        });
      });
    }

    // Detach the Participant's Tracks from the DOM.
   detachParticipantTracks(participant) {
      this.d('detachParticipantTracks()');
      var tracks = this.getTracks(participant);
      this.detachTracks(tracks);
    }

    // async waitForTracks(participant, n) {
    //     while (participant.tracks.length < n) {
    //         await new Promise(resolve => participant.once('trackAdded', resolve))
    //     }
    // }

  // Get the Participant's Tracks.
   getTracks(participant) {
      this.d('getTracks(): participant.tracks='+participant.tracks);
      // ZERO !!!!!!!
      //  Object.keys(participant.tracks).length

      for(var prop in participant.tracks) {
          this.d('getTracks(): participant.tracks['+prop+'] = '+participant.tracks[prop]);
      }
      this.d('getTracks(): participant.tracks.values()='+participant.tracks.values());

      // TODO PROBLEM NOTHING IS PRINTED OUT HERE
      Object.keys(participant.tracks).forEach(xxx => this.d('getTracks(): participant.tracks['+xxx+'] = '+participant.tracks[xxx]));
      // room.localParticipant.tracks.foreach((a=>any)=>{if(a.kind=="video"){videoelement=a.track}})
      return Array.from(participant.tracks.values()).filter(function(publication) {
        this.d('getTracks(): publication='+publication);
        return publication['track'];
      }).map(function(publication) {
        return publication['track'];
      });
  }






    onParticipantsChanged(b: boolean) {
        this.d('onParticipantsChanged()')
        this.videoChatService.nudge();
    }



    // MAYBE THIS FROM  https://stackoverflow.com/questions/58450344/twilio-video-camera-not-showing-on-ios-iphone-safari-only
    // room.localParticipant.tracks.foreach((a=>any)=>{if(a.kind=="video"){videoelement=a.track}})

    // called by   onRoomChanged() AND doConnect()
    private registerRoomEvents() {
        this.d('registerRoomEvents():  this.activeRoom='+this.activeRoom);
        if(this.activeRoom && this.activeRoom.participants) {
            this.d('registerRoomEvents():  this.activeRoom.participants='+this.activeRoom.participants);
            if(this.activeRoom.participants.length > 0) {
                this.activeRoom.participants.forEach(part => this.d('registerRoomEvents(): this.activeRoom.participant[idx] = '+part));
            }
        }
        this.activeRoom
            .on('disconnected',
                (room: Room) => {
                  this.d('registerRoomEvents(): disconnected');
                  room.localParticipant.tracks.forEach(publication => this.detachLocalTrack(publication.track))
            })

            .on('participantConnected',
                async (participant: RemoteParticipant) => {
                    this.d('registerRoomEvents(): participantConnected'); // GOOD - we see this
                    // await this.waitForTracks(participant, 2)
                    this.participants.add(participant)
            })
            .on('participantDisconnected',
                (participant: RemoteParticipant) => {
                    this.d('registerRoomEvents(): participantDisconnected');
                    this.participants.remove(participant)
            })
            .on('dominantSpeakerChanged',
                (dominantSpeaker: RemoteParticipant) => this.participants.loudest(dominantSpeaker));
    }

    private detachLocalTrack(track: LocalTrack) {
        if (this.isDetachable(track)) {
            track.detach().forEach(el => el.remove());
        }
    }

    private isDetachable(track: LocalTrack): track is LocalAudioTrack | LocalVideoTrack {
        return !!track
            && ((track as LocalAudioTrack).detach !== undefined
            || (track as LocalVideoTrack).detach !== undefined);
    }














    // from Swift VideoChatVC...
    descriptionLabel = "Description";
    //video_mission_description
    //edit_video_mission_description_button = Edit
    legislatorLabel = "Legislator"
    //edit_legislator_button = Choose
    //legislatorName =
    state: string;
    chamber: string;
    //district =
    //facebookButton =
    //editFacebookButton =
    //twitterButton =
    //editTwitterButton =
    //fbLabel =
    fbHandle = "";
    fbLink = "";
    //fbId : String? // legislator's FB ID
    //twLabel = "TW:"
    twHandle = "";
    twLink = "";
    videoTitleHeader = "YouTube Video Title"
    //edit_video_title_button = "Edit"
    // video_title: string;
    youtubeVideoDescriptionHeader = "YouTube Video Description"
    //edit_youtube_video_description_button = "Edit"
    //youtube_video_description =
    what_do_you_want_to_do_with_your_video = "What do you want to do with your video?"
    email_to_legislator_label = "Email to Legislator"
    //email_to_legislator =
    post_to_facebook_label = "Post to Facebook"
    //post_to_facebook =
    post_to_twitter_label = "Post to Twitter"
    //post_to_twitter =
    video_status = "Video Status"
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

    vnode: VideoNode;

    // put this suff way down here because most of the time, I don't want to see it
    private setContent(vnode: VideoNode) {
        console.log('vnode = ', vnode);
        this.vnode = vnode;
        this.state = vnode.val['legislator_state_abbrev'] ? vnode.val['legislator_state_abbrev'].toUpperCase() : "";
        this.chamber = vnode.val['legislator_chamber'] ? (vnode.val['legislator_chamber'] === "lower" ? "HD" : "SD") : "";
        if(vnode.val['legislator_facebook'] && vnode.val['legislator_facebook'] != "") {
          this.fbHandle = "@"+vnode.val['legislator_facebook'];
          this.fbLink = "https://www.facebook.com/"+vnode.val['legislator_facebook'];
        }
        if(vnode.val['legislator_twitter'] && vnode.val['legislator_twitter'] != "") {
          this.twHandle = "@"+vnode.val['legislator_twitter'];
          this.twLink = "https://www.twitter.com/"+vnode.val['legislator_twitter'];
        }
        // from Swift VideoChatVC...
        // video_mission_description = vnode.val['video_mission_description']
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
    }


    d(msg:string) {
        this.log.d('HomeComponent: '+this.phone+': '+msg);
    }
}
