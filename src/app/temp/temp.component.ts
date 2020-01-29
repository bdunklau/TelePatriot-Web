import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-temp',
  templateUrl: './temp.component.html',
  styleUrls: ['./temp.component.css']
})
export class TempComponent implements OnInit {

  constructor(private readonly http: HttpClient) { }

  ngOnInit() {
    let v = this.getVideo();
    console.log('v = ', v);
    v.subscribe(data => console.log('data = ', data));
  }

  getVideo() {
    // return this.http.get('https://ACce7e5e5cbf309ac4eb81b6579793a1b1:46555fb7aa3cb050c66e75de9dd3c2b0@video.twilio.com/v1/Compositions/CJa989d1694ee07aaf825006f2b50d74ae/Media');

      return this.http.get('https://www.yahoo.com');

  }

}
