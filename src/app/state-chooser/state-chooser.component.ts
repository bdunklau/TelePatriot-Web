import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { LegislatorService } from '../legislator/legislator.service';


@Component({
  selector: 'app-state-chooser',
  templateUrl: './state-chooser.component.html',
  styleUrls: ['./state-chooser.component.css']
})
export class StateChooserComponent implements OnInit {


    // what listens for this?
    @Output() state = new EventEmitter<string>();
    stateValue: string = 'State';
    states: {abbrev: string, name: string}[];


    constructor(private legislatorService: LegislatorService) { }

    async ngOnInit() {
        this.states = await this.legislatorService.getStates();
    }


    chooseState(state_abbrev: string) {
        this.stateValue = state_abbrev.toUpperCase();
        this.state.emit(state_abbrev);
    }

}
