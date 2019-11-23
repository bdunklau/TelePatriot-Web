import { Component, OnInit, Input } from '@angular/core';
import { LegislatorOffice } from './legislator-office.model';

@Component({
  selector: 'app-legislator-office',
  templateUrl: './legislator-office.component.html',
  styleUrls: ['./legislator-office.component.css']
})
export class LegislatorOfficeComponent implements OnInit {




    @Input() officeInput: LegislatorOffice;


    constructor() { }

    ngOnInit() {
    }

}
