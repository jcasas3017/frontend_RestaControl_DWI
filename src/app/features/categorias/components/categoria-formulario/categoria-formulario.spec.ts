import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaFormulario } from './categoria-formulario';

describe('CategoriaFormulario', () => {
  let component: CategoriaFormulario;
  let fixture: ComponentFixture<CategoriaFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaFormulario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaFormulario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
