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
  fetch('./assets/data/temporal.json').then( res => res.json())//Cambiar esto por lo de la base de datos 
  .then(json => {
    this.pallets = json;
    console.log(this.pallets)
    
    this.tabla.paletas = 'Pallets: ' + this.pallets.length
    this.totalkgs = 0;
    this.totalcajas = 0;
    var v: any;
    for (v=0; v < this.pallets.length; v++){
      this.totalkgs += this.pallets[v].kgs
      this.totalcajas += this.pallets[v].caj
    }
    this.tabla.cajas = 'Cajas: ' + this.totalcajas
    this.tabla.kgs = 'KGS: ' + this.totalkgs

    console.log(this.tabla.paletas)
    console.log(this.tabla.cajas)
    console.log(this.tabla.kgs)
  });
  }

}
