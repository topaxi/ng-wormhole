import {
  Component,
  Attribute,
  Input,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'ng-wormhole,angular-wormhole',
  template: '<ng-content></ng-content>',
  styles: [`
    :host { display: none; }
    :host.render-in-place { display: block }
  `],
  host: {
    '[class.render-in-place]': 'renderInPlace'
  }
})
export class AngularWormholeComponent
    implements AfterViewInit, OnDestroy, OnChanges {
  @Input()
  renderInPlace: boolean = false;

  @Input('to')
  toInput: string;

  private wormholeHeadNode: Node;
  private wormholeFootNode: Node;
  private initialized: boolean = false;

  constructor(
    @Attribute('to') private toAttr: string,
    private element: ElementRef
  ) {
    this.wormholeHeadNode = this.createTextNode('');
    this.wormholeFootNode = this.createTextNode('');
  }

  get destinationElement(): Element {
    if (this.renderInPlace) {
      return this.element.nativeElement;
    }

    return document.querySelector(this.toInput || this.toAttr);
  }

  ngAfterViewInit(): void {
    this.element.nativeElement.insertBefore(
      this.wormholeHeadNode,
      this.element.nativeElement.firstChild
    );
    this.element.nativeElement.appendChild(this.wormholeFootNode);
    this.appendToDestination();
    this.initialized = true;
  }

  ngOnDestroy(): void {
    this.removeRange(this.wormholeHeadNode, this.wormholeFootNode);
    this.initialized = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized) {
      this.appendToDestination();
    }
  }

  private appendToDestination() {
    let startingActiveElement = this.getActiveElement();
    this.appendRange(
      this.destinationElement,
      this.wormholeHeadNode,
      this.wormholeFootNode
    );
    let resultingActiveElement = this.getActiveElement();
    if (startingActiveElement &&
        resultingActiveElement !== startingActiveElement) {
      (startingActiveElement as HTMLElement).focus();
    }
  }

  private getActiveElement(): Element {
    return document.activeElement;
  }

  private createTextNode(text: string): Text {
    return document.createTextNode(text);
  }

  private appendRange(destinationElement, firstNode, lastNode): void {
    while (firstNode) {
      destinationElement.insertBefore(firstNode, null);
      firstNode = firstNode !== lastNode ?
        lastNode.parentNode.firstChild :
        null;
    }
  }

  private removeRange(firstNode, lastNode) {
    let node = lastNode;

    do {
      let next = node.previousSibling;

      if (node.parentNode) {
        node.parentNode.removeChild(node);

        if (node === firstNode) {
          break;
        }
      }

      node = next;
    } while (node);
  }
}
