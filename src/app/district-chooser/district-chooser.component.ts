import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { LegislatorService } from '../legislator/legislator.service';



@Component({
  selector: 'app-district-chooser',
  templateUrl: './district-chooser.component.html',
  styleUrls: ['./district-chooser.component.css']
})
export class DistrictChooserComponent implements OnInit {


      // what listens for this?
      @Output() district = new EventEmitter<string>();
      districtValue: string = 'District';
      districts: string[] = [];
      state_abbrev: string;
      chamber: {long: string, short: string};


      constructor(private legislatorService: LegislatorService) { }

      async ngOnInit() {
      }


      chooseDistrict(district: string) {
          this.districtValue = district;
          this.district.emit(district);
      }


      async onStateChosen(state_abbrev: string) {
          this.state_abbrev = state_abbrev;
          if(this.chamber) {
              this.districts = await this.legislatorService.getDistricts(this.state_abbrev, this.chamber);
              console.log('districts = ', this.districts);
          }
      }


      async onChamberChosen(chamber: {long: string, short: string}) {
          this.chamber = chamber;
          if(this.state_abbrev) {
              this.districts = await this.legislatorService.getDistricts(this.state_abbrev, this.chamber);
              console.log('districts = ', this.districts);
          }
      }

}
