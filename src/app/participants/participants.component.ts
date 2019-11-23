import {
    Component,
    ViewChild,
    ElementRef,
    Output,
    Input,
    EventEmitter,
    Renderer2
} from '@angular/core';
import {
    Participant,
    RemoteTrack,
    RemoteAudioTrack,
    RemoteVideoTrack,
    RemoteParticipant,
    RemoteTrackPublication
} from 'twilio-video';
import { LogService } from '../log/log.service';

@Component({
    selector: 'app-participants',
    styleUrls: ['./participants.component.css'],
    templateUrl: './participants.component.html',
})
export class ParticipantsComponent {
    // https://stackoverflow.com/a/56752507
    // query results available in ngOnInit
    @ViewChild('list', {static: false}) listRef: ElementRef;
    // this says "list" but we're going to refactor so it only supports one remote participant


    @Output('participantsChanged') participantsChanged = new EventEmitter<boolean>();
    @Output('leaveRoom') leaveRoom = new EventEmitter<boolean>();
    @Input('activeRoomName') activeRoomName: string;

    get participantCount() {
        return !!this.participants ? this.participants.size : 0;
    }

    get isAlone() {
        return this.participantCount === 0;
    }

    private participants: Map<Participant.SID, RemoteParticipant>;
    private dominantSpeaker: RemoteParticipant;


    // Renderer2:   https://ngrefs.com/latest/core/renderer2
    constructor(private readonly renderer: Renderer2,
                private log: LogService) { }


    clear() {
        if (this.participants) {
            this.participants.clear();
        }
    }

    initialize(participants: Map<Participant.SID, RemoteParticipant>) {
        this.participants = participants;
        if (this.participants) {
            this.participants.forEach(participant => this.registerParticipantEvents(participant));
        }
    }

    add(participant: RemoteParticipant) {
        this.d('add RemoteParticipant: '+participant.identity); // GOOD - we see this
        if (this.participants && participant) {
            this.participants.set(participant.sid, participant);
            this.registerParticipantEvents(participant);
        }
    }

    remove(participant: RemoteParticipant) {
        if (this.participants && this.participants.has(participant.sid)) {
            this.participants.delete(participant.sid);
        }
    }

    loudest(participant: RemoteParticipant) {
        this.dominantSpeaker = participant;
    }

    onLeaveRoom() {
        this.leaveRoom.emit(true);
    }

    private registerParticipantEvents(participant: RemoteParticipant) {
       this.d('registerParticipantEvents(): participant='+participant);
        if (participant) {
            this.d('registerParticipantEvents(): participant.tracks='+participant.tracks); // GOOD - we see this
            participant.tracks.forEach(publication => {
                this.d('registerParticipantEvents(): participant='+participant+':  this.subscribe(publication)'); // GOOD - we see this
                this.subscribe(publication);
            });
            participant.on('trackPublished', publication => {
                this.d('trackPublished for RemoteParticipant.identity='+participant.identity); // BAD - we do not see this
                this.subscribe(publication)
              }
            );
            participant.on('trackUnpublished',
                publication => {
                    if (publication && publication.track) {
                        this.d('trackUnpublished for RemoteParticipant.identity='+participant.identity);
                        this.detachRemoteTrack(publication.track);
                    }
                });
        }
    }

    private subscribe(publication: RemoteTrackPublication | any) {
        this.d('subscribe(): publication.on='+publication.on);
        this.d('subscribe(): publication.isSubscribed='+publication.isSubscribed); // GOOD - we see this but always false
        this.d('subscribe(): publication.isTrackEnabled='+publication.isTrackEnabled);
        if (publication && publication.on) {
            publication.on('subscribed', track => {
                this.d('subscribed: RemoteTrackPublication'); // BAD - we do not see this
                this.attachRemoteTrack(track)
              }
            );
            publication.on('unsubscribed', track => {
                this.d('unsubscribed: RemoteTrackPublication');
                this.detachRemoteTrack(track)
              }
            );
        }
    }

    private attachRemoteTrack(track: RemoteTrack) {
        this.d('attachRemoteTrack: RemoteTrack.isAttachable(track)='+this.isAttachable(track));
        if (this.isAttachable(track)) {
            // this method called twice for a participant
            // the first time, element is an <audio> element, type unknown
            // the second time, element is a <video> element, type unknown
            const element = track.attach();
            console.log('element is a -> ', element);
            this.renderer.data.id = track.sid;
            this.renderer.setStyle(element, 'width', '30vw');
            // this.renderer.setStyle(element, 'height', '28vh');
            this.renderer.setStyle(element, 'margin-left', '0%');
            this.renderer.appendChild(this.listRef.nativeElement, element);
            this.participantsChanged.emit(true);
        }
    }

    private detachRemoteTrack(track: RemoteTrack) {
        if (this.isDetachable(track)) {
            track.detach().forEach(el => el.remove());
            this.participantsChanged.emit(true);
        }
    }

    private isAttachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
        return !!track &&
            ((track as RemoteAudioTrack).attach !== undefined ||
            (track as RemoteVideoTrack).attach !== undefined);
    }

    private isDetachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
        return !!track &&
            ((track as RemoteAudioTrack).detach !== undefined ||
            (track as RemoteVideoTrack).detach !== undefined);
    }


    d(msg:string) {
        this.log.d('ParticipantsComponent: '+msg);
    }
}
