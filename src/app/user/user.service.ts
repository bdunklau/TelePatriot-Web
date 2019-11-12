import { Injectable } from '@angular/core';
import { /*AngularFireList,*/ AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class UserService {

    constructor(private db: AngularFireDatabase) { }

    async addRole(cbid: number, role: string) {
        await this.setRole(cbid, role, "true");
    }

    async getUser(cbid: number) {
        let users = await this.db.list("users", ref => ref.orderByChild('citizen_builder_id').equalTo(cbid))
            .snapshotChanges().pipe(take(1))
            .toPromise();
        if(!users || users.length === 0)
            return {}
        else {
            const state = users[0].payload.val()['residential_address_state_abbrev'] ? users[0].payload.val()['residential_address_state_abbrev'].toUpperCase() : '';
            const cbid: number = users[0].payload.val()['citizen_builder_id'];
            const name: string = users[0].payload.val()['name'];
            var user: {citizen_builder_id?: number, name?: string, state_abbrev?: string, roles?: string[]} = {};
            user.citizen_builder_id = cbid;
            user.name = name;
            user.state_abbrev = state;
            user.roles = users[0].payload.val()['roles']
            return user;
        }
    }

    async removeRole(cbid: number, role: string) {
        await this.setRole(cbid, role, "false");
    }

    async setRole(cbid: number, role: string, value: string) {
        // query by cbid to get the uid

        let users = await this.db.list("users", ref => ref.orderByChild('citizen_builder_id').equalTo(cbid))
            .snapshotChanges().pipe(take(1))
            .toPromise();

        var updates = {};
        _.each(users, user => {
            updates[`/users/${user.payload.key}/roles/${role}`] = value;
        })
        this.db.object('/').update(updates);
        // return users;
    }


}
