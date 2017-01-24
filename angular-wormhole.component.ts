import {
  Component,
  Attribute,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'ng-wormhole,angular-wormhole',
  template: '<ng-content></ng-content>',
  styles: [`:host { display: none; }`]
})
export class AngularWormholeComponent implements AfterViewInit, OnDestroy {
  private wormholeHeadNode: Node;
  private wormholeFootNode: Node;

  constructor(
    @Attribute('to') private to: string,
    private element: ElementRef
  ) {
    this.wormholeHeadNode = this.createTextNode('');
    this.wormholeFootNode = this.createTextNode('');
  }

  get destinationElement(): Element {
    return document.querySelector(this.to);
  }

  ngAfterViewInit(): void {
    this.element.nativeElement.insertBefore(
      this.wormholeHeadNode,
      this.element.nativeElement.firstChild
    );
    this.element.nativeElement.appendChild(this.wormholeFootNode);
    this.appendToDestination();
  }

  ngOnDestroy(): void {
    this.removeRange(this.wormholeHeadNode, this.wormholeFootNode);
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
