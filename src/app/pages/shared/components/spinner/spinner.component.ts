import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html'
})
export class SpinnerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  spinnerActive: boolean = false;

  public dateToString(param: boolean) {
    this.spinnerActive = param;
  }
}
