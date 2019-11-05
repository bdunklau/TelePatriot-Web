import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '../log/log.service';
import { LogEntry } from './logentry.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  private logs: any; //{event:string, level:string, date:string, date_ms:number}[];
  private logSubscription: Subscription;

  constructor(private logService: LogService,) { }

  ngOnInit() {
      this.logSubscription = this.logService.watchLogs().subscribe(logs => {
          console.log('logs = ', logs);
          this.logs = logs;
      })
  }

  ngOnDestroy() {
      if(this.logSubscription) this.logSubscription.unsubscribe();
  }

  deleteLogs() {
      this.logService.deleteLogs();
  }

}
