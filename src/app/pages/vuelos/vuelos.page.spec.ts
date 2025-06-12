import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VuelosPage } from './vuelos.page';

describe('VuelosPage', () => {
  let component: VuelosPage;
  let fixture: ComponentFixture<VuelosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VuelosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
