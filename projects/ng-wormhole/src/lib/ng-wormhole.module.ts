import { NgModule } from '@angular/core';
import { NgWormholeComponent } from './ng-wormhole.component';
import { NgWormholeDirective } from './ng-wormhole.directive';

@NgModule({
  imports: [],
  declarations: [NgWormholeComponent, NgWormholeDirective],
  exports: [NgWormholeComponent, NgWormholeDirective]
})
export class NgWormholeModule {}
