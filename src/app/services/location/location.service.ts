import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private location:any = {lat:0,lng:0}
  private permission : boolean = false;

  constructor() { }

  async getCurrentLocation() {
    if (Capacitor.getPlatform() == 'web') return this.getWebLocation()
    if(!this.permission) await Geolocation.checkPermissions().then(async (p) => {if(p.location == 'denied') await Geolocation.requestPermissions()})
    const coordinates = await Geolocation.getCurrentPosition();
    if(coordinates.coords) {
        this.location.lat = coordinates.coords.latitude
        this.location.lng = coordinates.coords.longitude
    }
    this.permission = true;
    return this.location
  }


  private async  getWebLocation() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
    };

    await new Promise(resolve => {
      navigator.geolocation.getCurrentPosition((coordinates:any) => {
        this.location.lat = coordinates.coords.latitude
        this.location.lng = coordinates.coords.longitude
        resolve(this.location)
      }, (err) => {
        resolve(this.location)
      },options);
    })
    return this.location
  }


}

/*
permissions :-
1- android:- 
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-feature android:name="android.hardware.location.gps" />
put them in AndroidManifest.xml
2- ios:-
we put messages in Info.plist


*/