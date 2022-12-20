import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { Bandas } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-paletvirtual',
  templateUrl: './paletvirtual.page.html',
  styleUrls: ['./paletvirtual.page.scss'],
})
export class PaletvirtualPage implements OnInit {
  @ViewChild('codpal', { static: false }) codpal!: IonInput;

  
  banda: Bandas;
  c_codigo_pal: string = '';
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((Params: Bandas) => {
      this.banda = Params;
    });
  }


  enterkey(){}

  fn_scanner(){}
}
