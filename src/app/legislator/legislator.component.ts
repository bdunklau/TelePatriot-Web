import { Component, OnInit, Input } from '@angular/core';
import { Legislator } from './legislator.model';
import * as _ from 'lodash';


@Component({
  selector: 'app-legislator',
  templateUrl: './legislator.component.html',
  styleUrls: ['./legislator.component.css']
})
export class LegislatorComponent implements OnInit {

    @Input() legislatorInput: Legislator
    chamber: string;
    photo_url: string;

    constructor() { }

    ngOnInit() {
        this.chamber = this.legislatorInput.chamber === 'lower' ? 'HD' : 'SD';
        this.photo_url = this.legislatorInput.photo_url ? this.legislatorInput.photo_url : this.legislatorInput.photoUrl;
    }


    addChannel() {
        this.legislatorInput.addChannel();
    }


    /**
    remove the channel from the legislator object because it was just deleted from the db
    **/
    onChannelDeleted(channel: any /*{idx: number, url: string, id: string, type: string, facebook_id?: string}*/) {
        console.log('onChannelDeleted(): channel = ', channel);
        const idx = _.findIndex(this.legislatorInput.channels, {idx: channel.idx});
        if(idx !== -1)
            this.legislatorInput.channels.splice(idx, 1);
    }

}
