import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appFunc } from '../_models/_appFunc';
import { signalRConnection } from '../_models/_signalRConnection';

@Component({
  selector: 'app-screensaver',
  templateUrl: './screensaver.component.html',
  styleUrls: ['./screensaver.component.css']
})
export class ScreensaverComponent implements OnInit {

  imgArray = [
    "ss1.jpg",
  ];

  counter = 0;
  imgSrc: any;

  id: any;

  path = "";

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    
    if(appFunc.screenSaver == undefined){
      this.path = "";
      //signalRConnection.isEmptySSList = true;
    }else{
      this.path = appFunc.screenSaver;
      this.path = this.path.substring(this.path.indexOf("screensaver/") + 12);
      console.log(this.path);
    }
    
    if(appFunc.isEmptySSList){
      this.router.navigate(['verifyMyKad']);
    }
    else{
      this.imgCycle();
      this.id = setInterval(() => {
        this.imgCycle();
      }, 5000);
    }
    
  }

  imgCycle() {
    if(this.path == ""){
      this.imgSrc = "./assets/screensaver/" + this.path + "/" + this.imgArray[this.counter];
      if (this.counter == this.imgArray.length - 1) {
        this.counter = -1;
      }
      this.counter++;
    }else{
      this.imgSrc = "./assets/screensaver/" + this.path + "/" + appFunc.screenSaverList[this.counter];
      if (this.counter == appFunc.screenSaverList.length - 1) {
        this.counter = -1;
      }
      this.counter++;
    }
  }

  screensaverclick(){
    this.router.navigate(['verifyMyKad']);
    clearInterval(this.id);
  }

  ngOnDestroy(){
    clearInterval(this.id);
  }

}
