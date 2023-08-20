import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaAnaliseComponent } from './nova-analise.component';

describe('NovaAnaliseComponent', () => {
  let component: NovaAnaliseComponent;
  let fixture: ComponentFixture<NovaAnaliseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NovaAnaliseComponent]
    });
    fixture = TestBed.createComponent(NovaAnaliseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
