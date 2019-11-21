import { LegislatorOffice } from '../legislator-office/legislator-office.model';


// Generate model classes with ng cli like this:
// ng generate class team/team --type=model
export class Legislator {

    // CREATED IN legislator.service: createLegislator()

    key: string;
    leg_id: string;
    first_name: string;
    last_name: string;
    party?: string;
    party_abbrev?: string;
    emails?: string[];
    photo_url?: string;
    photoUrl?: string;
    chamber: string;
    district: string;
    offices?: LegislatorOffice[];
    // social Media
    channels?: {idx: number, url: string/*derived data*/, id: string, type: string, facebook_id?: string}[];


    // inserts a blank/empty channel that needs to be defined
    addChannel() {
        const idx = this.channels ? this.channels.length : 0;
        this.channels.push({idx: idx, url: '', id: '', type: ''});
    }
}
