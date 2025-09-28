import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { requestMagicLink } from '../../../../store/auth/auth.actions';
import { MagicLinkRequestComponent } from './magic-link-request.component';

describe('MagicLinkRequestComponent', () => {
  let component: MagicLinkRequestComponent;
  let fixture: ComponentFixture<MagicLinkRequestComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MagicLinkRequestComponent],
      imports: [
        ReactiveFormsModule,
        IonicModule.forRoot(),
        HttpClientTestingModule,
        TranslocoTestingModule.forRoot({ langs: { pt: {} }, translocoConfig: { availableLangs: ['pt'], defaultLang: 'pt' } })
      ],
      providers: [provideMockStore()]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(MagicLinkRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch magic link request when form is valid', () => {
    component.form.setValue({ email: 'user@example.com' });

    component.submit();

    expect(store.dispatch).toHaveBeenCalledWith(
      requestMagicLink({ payload: { email: 'user@example.com', tenantSlug: 'demo' } })
    );
  });

  it('should mark form as touched when invalid', () => {
    component.submit();

    expect(component.form.touched).toBeTrue();
  });
});
