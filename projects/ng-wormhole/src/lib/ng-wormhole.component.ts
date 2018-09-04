import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  HostBinding
} from '@angular/core';

@Component({
  selector: 'ng-wormhole',
  template: '<ng-content></ng-content>',
  styles: [`
    :host { display: none; }
    :host.render-in-place { display: block }
  `]
})
export class NgWormholeComponent
    implements AfterViewInit, OnDestroy, OnChanges {
  @Input()
  @HostBinding('class.render-in-place')
  renderInPlace: boolean = false;

  @Input()
  to?: string;

  private wormholeHeadNode: Node;
  private wormholeFootNode: Node;
  private initialized: boolean = false;

  constructor(
    private element: ElementRef
  ) {
    this.wormholeHeadNode = this.createTextNode('');
    this.wormholeFootNode = this.createTextNode('');
  }

  get destinationElement(): Element | null {
    if (this.renderInPlace) {
      return this.element.nativeElement;
    }

    if (!this.to) {
      return null;
    }

    return document.querySelector(this.to);
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

  private appendToDestination(): void {
    let startingActiveElement = this.getActiveElement();
    let destinationElement = this.destinationElement;

    if (!destinationElement) {
      return;
    }

    this.appendRange(
      destinationElement,
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

  private appendRange(
      destinationElement: Element,
      firstNode: Node,
      lastNode: Node): void {
    let currentNode: Node | null = firstNode;

    while (currentNode) {
      destinationElement.insertBefore(currentNode, null);
      currentNode = currentNode !== lastNode ?
        lastNode.parentNode && lastNode.parentNode.firstChild :
        null;
    }
  }

  private removeRange(firstNode: Node, lastNode: Node) {
    let currentNode: Node | null = lastNode;

    do {
      let next: Node | null = currentNode!.previousSibling;

      if (currentNode.parentNode) {
        currentNode.parentNode.removeChild(currentNode);

        if (currentNode === firstNode) {
          break;
        }
      }

      currentNode = next;
    } while (currentNode);
  }
}