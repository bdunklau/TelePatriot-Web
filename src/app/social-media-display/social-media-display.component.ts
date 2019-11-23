import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LegislatorService } from '../legislator/legislator.service';


@Component({
  selector: 'app-social-media-display',
  templateUrl: './social-media-display.component.html',
  styleUrls: ['./social-media-display.component.css']
})
export class SocialMediaDisplayComponent implements OnInit {


    @Output() deletedChannelOutput = new EventEmitter<{idx: number, url: string, id: string, type: string, facebook_id?: string}>();
    @Input() legIdInput: string;
    @Input() channelInput: {idx: number, url: string, id: string, type: string, facebook_id?: string};
    editing = false;
    deleting = false;
    addingNew = false; // true if the user is adding a new social media handle - everything will be blank
    domain: string;

    constructor(private legislatorService: LegislatorService) { }

    ngOnInit() {
        this.addingNew = this.channelInput.url === '' && this.channelInput.id === '' && this.channelInput.type === '';
        if(this.addingNew) {
            // do anything ?
        }
        else {
            const handleBegin = this.channelInput.url.indexOf(this.channelInput.id);
            this.domain = this.channelInput.url.substring(0, handleBegin);
        }
    }

    save() {
        if(this.addingNew) {
            this.addingNew = false;
            this.domain = 'https://www.'+this.channelInput.type+'.com/';
            this.channelInput.url = this.domain + this.channelInput.id;
            this.legislatorService.saveChannel(this.legIdInput, this.channelInput);
        }
        else {
            this.editing = false;
            this.channelInput.url = this.domain + this.channelInput.id;
            this.legislatorService.saveChannel(this.legIdInput, this.channelInput);
        }
    }


    deleteHandle() {
        if(!this.deleting)
            this.deleting = true;
        else {
            // we are REALLY deleting here - we already confirmed
            this.legislatorService.deleteChannel(this.legIdInput, this.channelInput);
            console.log('deleteHandle(): this.channelInput = ', this.channelInput)
            this.deletedChannelOutput.emit(this.channelInput);
            this.deleting = false;
        }
    }


    cancelDelete() {
        this.deleting = false;
    }


    chooseType(type: string) {
        this.channelInput.type = type;
    }

}
