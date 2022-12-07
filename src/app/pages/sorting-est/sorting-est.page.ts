import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sorting-est',
  templateUrl: './sorting-est.page.html',
  styleUrls: ['./sorting-est.page.scss'],
})
export class SortingEstPage implements OnInit {
  titulo ='Sorting Maduración(Estiba)'
  constructor() { }
  estibas: any[];
  totalkgs: any
  tabla = {
    estibas: 'Estibas: 0',
    kgs: 'KGS: 0.000'
  }

  ngOnInit() {
    fetch('./assets/data/estibas.json').then( res => res.json())//Cambiar esto por lo de la base de datos 
    .then(json => {
      this.estibas = json;
      console.log(this.estibas)
      
      this.tabla.estibas = 'Total estibas: ' + this.estibas.length
      this.totalkgs = 0;
      var v: any;
      for (v=0; v < this.estibas.length; v++){
        this.totalkgs += this.estibas[v].kgs
      }
      this.tabla.kgs = 'KGS: ' + this.totalkgs

      console.log(this.tabla.estibas)
      console.log(this.tabla.kgs)
    });
  }

}
