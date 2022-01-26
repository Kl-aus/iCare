import { Component, OnInit } from '@angular/core';
import {DataService} from '../../service/data.service';

@Component({
  selector: 'app-core-functions',
  templateUrl: './core-functions.page.html',
  styleUrls: ['./core-functions.page.scss'],
})
export class CoreFunctionsPage implements OnInit {
  diagnosesTabDisabled = true;
  constructor(private dataService: DataService) {
    this.dataService.diagnosesTab.subscribe(res => {
      this.diagnosesTabDisabled = res;
    });
  }

  ngOnInit() {
  }

}
