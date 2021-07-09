import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarContraseniaComponent } from './recuperar-contrasenia.component';

describe('RecuperarContraseniaComponent', () => {
  let component: RecuperarContraseniaComponent;
  let fixture: ComponentFixture<RecuperarContraseniaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecuperarContraseniaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarContraseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
