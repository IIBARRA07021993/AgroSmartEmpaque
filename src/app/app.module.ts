import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterLink } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { Device } from "@awesome-cordova-plugins/device/ngx";
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';



@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SQLite,
    BarcodeScanner,
    Vibration,
    Device,
    Keyboard,
    Vibration,
    AudioManagement,
    NativeAudio,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
