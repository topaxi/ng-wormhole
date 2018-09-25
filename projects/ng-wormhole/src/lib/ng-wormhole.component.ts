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
  @Input()
  @HostBinding('class.render-in-place')
  renderInPlace = false;

  @Input()
  to?: string;

  @ViewChild(NgWormholeDirective)
  private ngWormholeDirective: NgWormholeDirective;

  get destinationElement(): Element | null {
    return this.ngWormholeDirective.destinationElement;
  }
}
