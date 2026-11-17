import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatoLista } from './plato-lista';

describe('PlatoLista', () => {
  let component: PlatoLista;
  let fixture: ComponentFixture<PlatoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatoLista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatoLista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
