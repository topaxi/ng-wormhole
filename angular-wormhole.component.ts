import {
  Component,
  Attribute,
  Input,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  HostBinding
} from '@angular/core';

@Component({
  selector: 'ng-wormhole,angular-wormhole',
  template: '<ng-content></ng-content>',
  styles: [`
    :host { display: none; }
    :host.render-in-place { display: block }
  `]
})
export class AngularWormholeComponent implements AfterViewInit, OnDestroy, OnChanges {
  @HostBinding('class.render-in-place')
  @Input()
  renderInPlace = false;

  @Input()
  to: string;

  private wormholeHeadNode: Node;
  private wormholeFootNode: Node;
  private initialized = false;

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

    return document.querySelector(this.to || this.toAttr);
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
    const startingActiveElement = this.getActiveElement();
    this.appendRange(
      this.destinationElement,
      this.wormholeHeadNode,
      this.wormholeFootNode
    );
    const resultingActiveElement = this.getActiveElement();
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

  private appendRange(
      destinationElement: Element,
      firstNode: Node,
      lastNode: Node): void {
    while (firstNode) {
      destinationElement.insertBefore(firstNode, null);
      firstNode = firstNode !== lastNode ?
        lastNode.parentNode.firstChild :
        null;
    }
  }

  private removeRange(firstNode: Node, lastNode: Node) {
    let node = lastNode;

    do {
      const next = node.previousSibling;

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
