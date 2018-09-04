import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgWormholeModule} from 'ng-wormhole'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgWormholeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
