import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgWormholeComponent } from './ng-wormhole.component';
import { Component } from '@angular/core';

@Component({
  selector: 'ngw-test',
  template: `
    <div id="target-element"></div>
    <ng-wormhole to="#target-element">
      <h1>welcome</h1>
    </ng-wormhole>
  `
})
class TestComponent {}

describe('NgWormholeComponent Acceptance', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, NgWormholeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should render into target', () => {
    let targetContent = fixture.debugElement.query(By.css('#target-element'))
      .nativeElement.innerHTML;
    expect(targetContent).toBe('<h1>welcome</h1>');
  });

  it('should be empty', () => {
    let wormholeContent = fixture.debugElement.query(By.css('ng-wormhole'))
      .nativeElement.innerHTML;
    expect(wormholeContent).toBe('');
  });
});



@Component({
  selector: 'ngw-test',
  template: `
    <div id="target-element"></div>
    <ng-wormhole to="#target-element" [renderInPlace]="true">
      <h1>welcome</h1>
    </ng-wormhole>
  `
})
class Test2Component {}

describe('NgWormholeComponent Acceptance renderInPlace', () => {
  let fixture: ComponentFixture<Test2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Test2Component, NgWormholeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Test2Component);
    fixture.detectChanges();
  });

  it('should not render into target', () => {
    let targetContent = fixture.debugElement.query(By.css('#target-element'))
      .nativeElement.innerHTML;
    expect(targetContent).toBe('');
  });

  it('should not be empty', () => {
    let wormholeContent = fixture.debugElement.query(By.css('ng-wormhole'))
      .nativeElement.innerHTML;
    expect(wormholeContent).toBe('<h1>welcome</h1>');
  });
});
