import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {


  loading:HTMLIonLoadingElement;

  constructor(public toastController: ToastController,
    public alertController: AlertController,
    private loadingCtrl: LoadingController) { }


  async presentToast( header:string , mensaje :string  , timpo :number , icon:string  , color : string ) {
    const toast = await this.toastController.create({
      mode :'ios',
      header: header,
      message: mensaje,
      duration: timpo,
      icon: icon ,
      position: 'middle',
      color: color
    });
    toast.present();
  }




  async presentToastok( header:string , mensaje :string  , timpo :number , icon:string  , color : string ) {
    const toast = await this.toastController.create({
      header: header,
      mode :'ios',
      message: mensaje,
      duration: timpo,
      icon: icon ,
      position:'middle' ,
      color: color,
      buttons: [
        {
          text: 'OK'
        }
      ],
    });
    toast.present();
  }


  async showLoading(  message :string    ) {
    this.loading = await this.loadingCtrl.create({
      message,
      spinner: 'circles',
      mode:'ios',
      
    });


   return  this.loading.present();
  }

  
  async AlertaOK(header:string , subHeader :string ,mensaje :string , buttons:string  ) {
    const alert = await this.alertController.create({
      mode :'ios',
      cssClass:'alerta',
      header: header,
      subHeader: subHeader,
      message: mensaje ,
      backdropDismiss: false,
      buttons: [buttons],
    });

    await alert.present();
    
  }



}
