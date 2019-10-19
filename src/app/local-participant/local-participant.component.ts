import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../device/device.service';


@Component({
  selector: 'app-local-participant',
  templateUrl: './local-participant.component.html',
  styleUrls: ['./local-participant.component.css']
})
export class LocalParticipantComponent implements OnInit {

  constructor(
      private readonly deviceService: DeviceService) { }

  ngOnInit() {
  }

}
