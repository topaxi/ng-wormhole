import {
  Directive,
  Input,
  ViewContainerRef,
  TemplateRef,
  EmbeddedViewRef,
  AfterViewInit,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  HostBinding
} from '@angular/core';

function appendReducer<T extends Node>(target: T, node: Node): T {
  target.appendChild(node);

  return target;
}

@Directive({
  selector: '[ngWormhole]'
})
export class NgWormholeDirective
  implements AfterViewInit, OnDestroy, OnInit, OnChanges {
  @Input()
  ngWormholeRenderInPlace = false;

  @Input()
  ngWormhole: string | Element;

  private embeddedViewRef: EmbeddedViewRef<any>;
  private initialized = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  get destinationElement(): Element | null {
    if (this.ngWormholeRenderInPlace) {
      if (this.viewContainerRef.element === null) {
        console.log(this.viewContainerRef);
      }

      return this.viewContainerRef.element.nativeElement;
    }

    if (!this.ngWormhole) {
      return null;
    }

    return typeof this.ngWormhole === 'string'
      ? document.querySelector(this.ngWormhole)
      : this.ngWormhole;
  }

  ngOnInit(): void {
    this.embeddedViewRef = this.viewContainerRef.createEmbeddedView(
      this.templateRef
    );
  }

  ngAfterViewInit(): void {
    this.appendToDestination();
    this.initialized = true;
  }

  ngOnDestroy(): void {
    this.embeddedViewRef.rootNodes.forEach(node =>
      node.parentNode.removeChild(node)
    );
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

    if (destinationElement == null) {
      return;
    }

    let content = this.embeddedViewRef.rootNodes.reduce(
      appendReducer,
      document.createDocumentFragment()
    );
    if (destinationElement.nodeType === Node.COMMENT_NODE) {
      destinationElement.parentNode.insertBefore(
        content,
        destinationElement.nextSibling
      );
    } else {
      destinationElement.appendChild(content);
    }

    let resultingActiveElement = this.getActiveElement();
    if (
      startingActiveElement != null &&
      resultingActiveElement !== startingActiveElement
    ) {
      (startingActiveElement as HTMLElement).focus();
    }
  }

  private getActiveElement(): Element {
    return document.activeElement;
  }

  private createTextNode(text: string): Text {
    return document.createTextNode(text);
  }
}
