import { Injectable } from '@angular/core';
import { /*AngularFireList,*/ AngularFireDatabase } from '@angular/fire/database';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { Legislator } from '../legislator/legislator.model';
import { LegislatorOffice } from '../legislator-office/legislator-office.model';


@Injectable({
  providedIn: 'root'
})
export class LegislatorService {

    states: {abbrev: string, name: string}[];

    constructor(private db: AngularFireDatabase) { }

    async getStates() {
        if(this.states) return this.states;
        else {
            let st = await this.db.list("states/list", ref => ref.orderByChild('state_name'))
                .snapshotChanges().pipe(take(1))
                .toPromise();
            this.states = _.map(st, state => {
                // console.log('state = ', state);
                return {abbrev: state.key, name: state.payload.val()['state_name']};
            });
            return this.states;
        }
    }


    async getLegislatorsInChamber(state_abbrev: string, chamber: {long: string, short: string}) {
        var st = state_abbrev.toLowerCase();
        var ch = chamber.long
        var key = st+'-'+ch;
        console.log('state_chamber key = ', key);
        let results = await this.db.list('states/legislators', ref => ref.orderByChild('state_chamber').equalTo(key))
            .snapshotChanges().pipe(take(1))
            .toPromise();
        let legislators = _.map(results, result => {
            return this.createLegislator(result);
        })
        return legislators;
    }


    private createLegislator(result: any) {
        var legislator = new Legislator();
        legislator.key = result.key;
        legislator.leg_id = result.payload.val()['leg_id'];
        legislator.first_name = result.payload.val()['first_name'];
        legislator.last_name = result.payload.val()['last_name'];
        legislator.party = result.payload.val()['party'];
        legislator.party_abbrev = legislator.party.substring(0,1);
        var emails: string[] = [];
        if(result.payload.val()['email']) {
            emails.push(result.payload.val()['email']);
        }
        var otherEmails:string[] = [];
        otherEmails = _.map(result.payload.val()['emails'], email => {return email /*just return the email*/} );
        _.each(otherEmails, other => {
            const idx = _.indexOf(emails, other);
            if(idx === -1)
                emails.push(other);
        })
        legislator.emails = emails;

        // social media handles
        var idx = 0;
        legislator.channels = _.map(result.payload.val()['channels'], channel => {
            var url = 'https://www.'+channel.type.toLowerCase()+'.com/'+channel['id'];
            var ch = {}; //: {url: string, id: string, type: string, facebook_id?: string};
            ch['idx'] = idx;
            ch['url'] = url;
            ch['id'] = channel.id;
            ch['type'] = channel.type;
            if(channel.facebook_id) ch['facebook_id'] = channel.facebook_id;
            ++idx;
            return ch;
        });

        legislator.photo_url = result.payload.val()['photo_url'];
        legislator.photoUrl = result.payload.val()['photoUrl'];
        legislator.chamber = result.payload.val()['chamber'];
        legislator.district = result.payload.val()['district'];
        legislator.offices = _.map(result.payload.val()['offices'], office => {
            return new LegislatorOffice(office);
        });

        return legislator;
    }


    async getDistricts(state_abbrev: string, chamber: {long: string, short: string}) {
        var st = state_abbrev.toLowerCase();
        var ch = chamber.long
        var key = st+'-'+ch;
        console.log('state_chamber key = ', key);
        let results = await this.db.list('states/districts', ref => ref.orderByChild('state_chamber').equalTo(key))
            .snapshotChanges().pipe(take(1))
            .toPromise();
        let districts = _.map(results, result => {
            var dist = result.payload.val()['name'];
            console.log('dist = ', dist);
            var nan = isNaN(parseInt(result.payload.val()['name']));
            var isNumber = !nan;
            if(isNumber) dist = parseInt(result.payload.val()['name']);
            return dist;
        })
        let sorted = _.sortBy(districts, d => d /* just sort by the value */);
        return sorted;
    }


    // some states have multiple reps in a district, like NJ
    async getLegislatorsInDistrict(state_abbrev: string, chamber: {long: string, short: string}, district: string) {
        // leave the district mixed case
        var st = state_abbrev.toLowerCase();
        var ch = chamber.long
        var key = st+'-'+ch+'-'+district;
        let results = await this.db.list('states/legislators', ref => ref.orderByChild('state_chamber_district').equalTo(key))
            .snapshotChanges().pipe(take(1))
            .toPromise();
        let legislators = _.map(results, result => {
            return this.createLegislator(result);
        })
        return legislators;
    }


    async deleteChannel(leg_id: string, channel: {idx: number, url: string, id: string, type: string, facebook_id?: string}) {
        await this.db.object(`/states/legislators/${leg_id}/channels/${channel.idx}`).remove();
    }


    // from social-media-display.component.ts
    async saveChannel(leg_id: string, channel: {idx: number, url: string, id: string, type: string, facebook_id?: string}) {
        var ch = {}
        ch['id'] = channel.id;
        ch['type'] = channel.type;
        if(channel.facebook_id) ch['facebook_id'] = channel.facebook_id;
        await this.db.object(`/states/legislators/${leg_id}/channels/${channel.idx}`).set(ch);
    }

}
