import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

  appVersion = environment.appVersion;

  constructor() { }

  ngOnInit(): void {
  }

}
