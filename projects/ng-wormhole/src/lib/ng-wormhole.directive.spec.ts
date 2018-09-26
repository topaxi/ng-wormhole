import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgWormholeComponent } from './ng-wormhole.component';
import { Component } from '@angular/core';
import { NgWormholeDirective } from './ng-wormhole.directive';

function removeHTMLComments(str: string) {
  return str.replace(/<!--.*?-->/gms, '');
}

@Component({
  selector: 'ngw-test',
  template: `
    <div id="target-element"></div>
    <div id="wormhole"><h1 *ngWormhole="'#target-element'">welcome</h1></div>
  `
})
class TestComponent {}

describe('NgWormholeDirective Acceptance', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, NgWormholeDirective]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should render into target', () => {
    let targetContent = fixture.debugElement.query(By.css('#target-element'))
      .nativeElement.innerHTML;
    targetContent = removeHTMLComments(targetContent);
    expect(targetContent).toBe('<h1>welcome</h1>');
  });

  it('should not be rendered outside target', () => {
    let wormholeContent = fixture.debugElement.query(By.css('#wormhole'))
      .nativeElement.innerHTML;
    wormholeContent = removeHTMLComments(wormholeContent);
    expect(wormholeContent).toBe('');
  });
});

@Component({
  selector: 'ngw-test',
  template: `
    <div id="target-element"></div>
    <div id="wormhole"><h1 *ngWormhole="'#target-element'; renderInPlace: true">welcome</h1></div>
  `
})
class Test2Component {}

describe('NgWormholeDirective Acceptance renderInPlace', () => {
  let fixture: ComponentFixture<Test2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Test2Component, NgWormholeDirective]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Test2Component);
    fixture.detectChanges();
  });

  it('should not render into target', () => {
    let targetContent = fixture.debugElement.query(By.css('#target-element'))
      .nativeElement.innerHTML;
    targetContent = removeHTMLComments(targetContent);
    expect(targetContent).toBe('');
  });

  it('should not be empty', () => {
    let wormholeContent = fixture.debugElement.query(By.css('#wormhole'))
      .nativeElement.innerHTML;
    wormholeContent = removeHTMLComments(wormholeContent);
    expect(wormholeContent).toBe('<h1>welcome</h1>');
  });
});

@Component({
  selector: 'ngw-test',
  template: `
    <div #targetElement id="target-element"></div>
    <div id="wormhole"><h1 *ngWormhole="targetElement">welcome</h1></div>
  `
})
class Test3Component {}

describe('NgWormholeDirective Acceptance elementRef', () => {
  let fixture: ComponentFixture<Test3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Test3Component, NgWormholeDirective]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Test3Component);
    fixture.detectChanges();
  });

  it('should render into target', () => {
    let targetContent = fixture.debugElement.query(By.css('#target-element'))
      .nativeElement.innerHTML;
    targetContent = removeHTMLComments(targetContent);
    expect(targetContent).toBe('<h1>welcome</h1>');
  });

  it('should be empty', () => {
    let wormholeContent = fixture.debugElement.query(By.css('#wormhole'))
      .nativeElement.innerHTML;
    wormholeContent = removeHTMLComments(wormholeContent);
    expect(wormholeContent).toBe('');
  });
});
