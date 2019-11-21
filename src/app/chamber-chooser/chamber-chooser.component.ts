import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chamber-chooser',
  templateUrl: './chamber-chooser.component.html',
  styleUrls: ['./chamber-chooser.component.css']
})
export class ChamberChooserComponent implements OnInit {

    // what listens for this?
    @Output() chamber = new EventEmitter<{long: string, short: string}>();
    chamberValue: string = 'SD'
    chambers: {long: string, short: string}[];

    constructor() { }

    ngOnInit() {
        this.chambers = [{long: 'upper', short: 'SD'}, {long: 'lower', short: 'HD'}]
    }


    chooseChamber(chamber: {long: string, short: string}) {
        this.chamberValue = chamber.short;
        this.chamber.emit(chamber);
    }

    // all this just for Nebr
    onStateChosen(state_abbrev: string) {
        if(state_abbrev.toLowerCase() === 'ne')
            this.chambers = [{long: 'upper', short: 'SD'}];
        else
            this.chambers = [{long: 'upper', short: 'SD'}, {long: 'lower', short: 'HD'}];
    }

}
