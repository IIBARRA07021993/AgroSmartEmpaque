import { Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  loading: HTMLIonLoadingElement;

  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    private loadingCtrl: LoadingController,
    private nativeAudio: NativeAudio
  ) {}

  async presentToast(
    header: string,
    mensaje: string,
    timpo: number,
    icon: string,
    color: string,
    sonido: string,
    sonar: boolean
  ) {
    const toast = await this.toastController.create({
      mode: 'ios',
      header: header,
      message: mensaje,
      duration: timpo,
      icon: icon,
      position: 'bottom',
      color: color,
    });
    this.playSingle(sonido,sonar);
    toast.present();
  }

  async presentToastok(
    header: string,
    mensaje: string,
    timpo: number,
    icon: string,
    color: string,
    sonido: string,
    sonar: boolean
  ) {
    const toast = await this.toastController.create({
      header: header,
      mode: 'ios',
      message: mensaje,
      duration: timpo,
      icon: icon,
      position: 'middle',
      color: color,
      buttons: [
        {
          text: 'OK',
        },
      ],
    });
    this.playSingle(sonido,sonar);
    toast.present();
  }

  async showLoading(message: string) {
    this.loading = await this.loadingCtrl.create({
      message,
      spinner: 'circles',
      mode: 'ios',
    });

    return this.loading.present();
  }

  async AlertaOK(
    header: string,
    subHeader: string,
    mensaje: string,
    buttons: string,
    sonido: string,
    sonar: boolean
  ) {
    const alert = await this.alertController.create({
      mode: 'ios',
      cssClass: 'alerta',
      header: header,
      subHeader: subHeader,
      message: mensaje,
      backdropDismiss: false,
      buttons: [buttons],
    });
    this.playSingle(sonido,sonar);
    await alert.present();
  }

  playSingle(opcion: string, sonar: boolean) {
    /*reproduce el sonido 1 vez */
    if (sonar) {
      switch (opcion) {
        case 'alerta':
          this.nativeAudio.preloadSimple(
            'uniqueId1',
            'assets/audio/alerta.mp3'
          );
          this.nativeAudio
            .play('uniqueId1')
            .then(async () => {})
            .catch((err) => {
              console.log('error', err);
            });
          break;
        case 'error':
          this.nativeAudio.preloadSimple('uniqueId2', 'assets/audio/error.wav');
          this.nativeAudio
            .play('uniqueId2')
            .then(async () => {})
            .catch((err) => {
              console.log('error', err);
            });
          break;
        case 'bien':
          this.nativeAudio.preloadSimple(
            'uniqueId3',
            'assets/audio/succes.mp3'
          );
          this.nativeAudio
            .play('uniqueId3')
            .then(async () => {})
            .catch((err) => {
              console.log('error', err);
            });
          break;
        default:
          break;   
      }
    }   
  }
}
