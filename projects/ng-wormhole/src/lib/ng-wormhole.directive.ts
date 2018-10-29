import {
  Directive,
  Input,
  ViewContainerRef,
  TemplateRef,
  EmbeddedViewRef,
  AfterViewInit,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostBinding,
  Inject,
  OnDestroy
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

function appendReducer<T extends Node>(target: T, node: Node): T {
  target.appendChild(node);

  return target;
}

@Directive({
  selector: '[ngWormhole]' // tslint:disable-line
})
export class NgWormholeDirective
  implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  @Input()
  ngWormholeRenderInPlace = false;

  @Input()
  ngWormhole: string | Element;

  private embeddedViewRef: EmbeddedViewRef<any>;
  private initialized = false;
  private document: Document;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    @Inject(DOCUMENT) document: any
  ) {
    this.document = document;
  }

  get destinationElement(): Element | null {
    if (this.ngWormholeRenderInPlace) {
      return (
        this.viewContainerRef.element &&
        this.viewContainerRef.element.nativeElement
      );
    }

    if (!this.ngWormhole) {
      return null;
    }

    return typeof this.ngWormhole === 'string'
      ? this.document.querySelector(this.ngWormhole)
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized) {
      this.appendToDestination();
    }
  }

  ngOnDestroy() {
    if (this.embeddedViewRef != null) {
      this.embeddedViewRef.destroy();
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
      this.document.createDocumentFragment()
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
    return this.document.activeElement;
  }
}
