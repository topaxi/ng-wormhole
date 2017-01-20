import { NgModule } from '@angular/core';
import { AngularWormholeComponent } from './angular-wormhole.component';

@NgModule({
  declarations: [
    AngularWormholeComponent
  ],
  exports: [
    AngularWormholeComponent
  ]
})
export class AngularWormholeModule {}
