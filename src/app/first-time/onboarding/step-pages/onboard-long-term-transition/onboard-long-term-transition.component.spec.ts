import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardLongTermTransitionComponent } from './onboard-long-term-transition.component';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { signal } from '@angular/core';
import { User, OnboardingState } from 'src/app/core/store/user/user.model';
import { By } from '@angular/platform-browser';

describe('OnboardLongTermTransitionComponent', () => {
  let component: OnboardLongTermTransitionComponent;
  let fixture: ComponentFixture<OnboardLongTermTransitionComponent>;

  const mockUser: User = {
    __id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    onboardingState: OnboardingState.STEP_2,
  };

  const mockAuthStore = {
    user: signal(mockUser),
    isLoadingLogin: signal(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardLongTermTransitionComponent],
      providers: [
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: BATCH_WRITE_SERVICE, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardLongTermTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title and subtitle', () => {
    const titleEl = fixture.debugElement.query(By.css('.title'));
    const subtitleEl = fixture.debugElement.query(By.css('.subtitle'));

    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.textContent.trim()).toBe('Nice work.');

    expect(subtitleEl).toBeTruthy();
    expect(subtitleEl.nativeElement.textContent).toContain('What are a few goals you can set this quarter');
  });

  it('should render the compass logo', () => {
    const imgEl = fixture.debugElement.query(By.css('.compass-logo'));
    expect(imgEl).toBeTruthy();
    expect(imgEl.nativeElement.getAttribute('src')).toBe('/images/logo.svg');
  });

  it('should emit back event when Back button is clicked', () => {
    let backEmitted = false;
    component.back.subscribe(() => {
      backEmitted = true;
    });

    const backButton = fixture.debugElement.query(By.css('.btn-back'));
    expect(backButton).toBeTruthy();
    backButton.nativeElement.click();

    expect(backEmitted).toBe(true);
  });

  it('should emit next event when Next button is clicked', () => {
    let nextEmitted = false;
    component.next.subscribe(() => {
      nextEmitted = true;
    });

    const nextButton = fixture.debugElement.query(By.css('.btn-next'));
    expect(nextButton).toBeTruthy();
    nextButton.nativeElement.click();

    expect(nextEmitted).toBe(true);
  });
});
