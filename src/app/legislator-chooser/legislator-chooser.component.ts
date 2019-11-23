import { Component, OnInit, ViewChild, AfterViewInit, QueryList, ContentChildren, AfterContentInit } from '@angular/core';
import { LegislatorService } from '../legislator/legislator.service';
import { Legislator } from '../legislator/legislator.model';
import { ChamberChooserComponent } from '../chamber-chooser/chamber-chooser.component';
import { DistrictChooserComponent } from '../district-chooser/district-chooser.component';
// import { LegislatorComponent } from '../legislator/legislator.component';


@Component({
  selector: 'app-legislator-chooser',
  templateUrl: './legislator-chooser.component.html',
  styleUrls: ['./legislator-chooser.component.css']
})
export class LegislatorChooserComponent implements OnInit {

    states: any;
    state_abbrev: string;
    chamber: {long: string, short: string} = {long: 'upper', short: 'SD'};
    district: string;
    legislators: Legislator[];
    // @ViewChild(StateChooserComponent) stateChooser: StateChooserComponent;
    @ViewChild('chamberChooser', {static: false}) chamberChooser: ChamberChooserComponent;
    @ViewChild('districtChooser', {static: false}) districtChooser: DistrictChooserComponent;

    constructor(private legislatorService: LegislatorService) { }

    async ngOnInit() {
    }

    async ngAfterViewInit() {
        this.districtChooser.onChamberChosen(this.chamber); // just passing a default chamber to this
    }


    async onStateChosen(state_abbrev: string) {
        this.state_abbrev = state_abbrev;
        this.legislators = await this.legislatorService.getLegislatorsInChamber(this.state_abbrev, this.chamber);
        console.log('this.legislators = ', this.legislators);
        this.chamberChooser.onStateChosen(state_abbrev);
        this.districtChooser.onStateChosen(state_abbrev);
    }


    async onChamberChosen(chamber: {long: string, short: string}) {
        this.chamber = chamber;
        this.districtChooser.onChamberChosen(chamber);
        if(this.state_abbrev) {
            this.legislators = await this.legislatorService.getLegislatorsInChamber(this.state_abbrev, this.chamber);
        }
        console.log('this.legislators = ', this.legislators);
    }

    async onDistrictChosen(district: string) {
        this.district = district;
        if(this.state_abbrev)
            this.legislators = await this.legislatorService.getLegislatorsInDistrict(this.state_abbrev, this.chamber, this.district);
        console.log('this.legislators = ', this.legislators);
    }

}
