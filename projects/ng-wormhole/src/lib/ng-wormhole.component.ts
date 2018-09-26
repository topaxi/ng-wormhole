import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  HostBinding,
  ViewChild
} from '@angular/core';
import { NgWormholeDirective } from './ng-wormhole.directive';

@Component({
  selector: 'ng-wormhole', // tslint:disable-line
  template:
    '<ng-content *ngWormhole="to; renderInPlace: renderInPlace"></ng-content>',
  styles: [
    `
      :host {
        display: none;
      }
      :host.render-in-place {
        display: block;
      }
    `
  ]
})
export class NgWormholeComponent {
  private static warnOnce = true;

  @Input()
  @HostBinding('class.render-in-place')
  renderInPlace = false;

  @Input()
  to?: string;

  @ViewChild(NgWormholeDirective)
  private ngWormholeDirective: NgWormholeDirective;

  constructor() {
    if (NgWormholeComponent.warnOnce === true) {
      NgWormholeComponent.warnOnce = false;
      console.warn(
        'The ng-wormhole component is deprecated, please use the ngWormhole directive'
      );
    }
  }

  get destinationElement(): Element | null {
    return this.ngWormholeDirective.destinationElement;
  }
}
