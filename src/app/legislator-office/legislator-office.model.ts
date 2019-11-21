
// generated by...
// ng generate class legislator-office/legislator-office --type=model
export class LegislatorOffice {
    address?: string;
    email?: string[];
    fax?: string;
    name?: string;
    phone?: string;
    type?: string;

    constructor(office: { address?: string,
                          email?: string[],
                          fax?: string,
                          name?: string,
                          phone?: string,
                          type?: string}) {

        this.address = office.address;
        this.email = office.email;
        this.fax = office.fax;
        this.name = office.name;
        this.phone = office.phone;
        this.type = office.type;

    }
}