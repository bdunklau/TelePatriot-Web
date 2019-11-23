import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class LogService {

    constructor(private db: AngularFireDatabase,) { }

    watchLogs() {
       return this.db.list('video/log').valueChanges();
    }


    async d(msg) {
        var e = {};
        e['event'] = msg;
        e['date'] = moment().format('ddd MMM D, h:mm:ss a Z Y');
        e['date_ms'] = moment().valueOf();
        e['level'] = 'debug';
        // e['isError'] = msg.toLowerCase().indexOf('error') != -1;

        // uncomment to log to db
        // this.db.list("video/log").push(e);
    }

    deleteLogs() {
        this.db.list('video/log').remove();
    }
}
