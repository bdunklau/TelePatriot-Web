import { Component, ViewChild, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { /*Subject, Observable,*/ Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import { LogService } from '../log/log.service';


@Component({
    selector: 'app-home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private log: LogService) { }

    async ngOnInit() {

    }


    @HostListener('window:beforeunload')
    async ngOnDestroy() {
    }


}
