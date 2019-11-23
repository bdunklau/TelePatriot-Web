import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-video-creators',
  templateUrl: './video-creators.component.html',
  styleUrls: ['./video-creators.component.css']
})
export class VideoCreatorsComponent implements OnInit {

    cbidValue: number;
    user: {citizen_builder_id?: number, name?: string, state_abbrev?: string, roles?: string[]};


    constructor(private userService: UserService) { }

    ngOnInit() {
    }


    // makes the person a Video Creator
    async onSubmit() {
        console.log('parseInt: this.cbidValue = ', this.cbidValue);
        await this.userService.addRole(this.cbidValue, "Video Creator");
        this.user = await this.userService.getUser(this.cbidValue);
        console.log('this.user = ', this.user);
    }

    async removeVideoCreatorRole() {
        await this.userService.removeRole(this.cbidValue, "Video Creator");
        this.user = await this.userService.getUser(this.cbidValue);
    }

}
