import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-palet-temp',
  templateUrl: './palet-temp.page.html',
  styleUrls: ['./palet-temp.page.scss'],
})
export class PaletTempPage implements OnInit {
  titulo ='Creación Palet Temporal'
  constructor() { }
  pallets: any[];
  totalkgs: any;
  totalcajas: any;
  tabla = {
    paletas: 'Pallets: 0',
    cajas: 'Cajas: 0',
    kgs: 'KGS: 0.000'
  }

  ngOnInit() {
  
  }

}
