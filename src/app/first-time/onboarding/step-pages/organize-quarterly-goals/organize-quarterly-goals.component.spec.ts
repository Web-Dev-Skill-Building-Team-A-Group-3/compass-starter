import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizeQuarterlyGoalsComponent } from './organize-quarterly-goals.component';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { signal } from '@angular/core';

describe('OrganizeQuarterlyGoalsComponent', () => {
  let component: OrganizeQuarterlyGoalsComponent;
  let fixture: ComponentFixture<OrganizeQuarterlyGoalsComponent>;

  const mockAuthStore = {
    user: signal({ id: 'test-user', email: 'test@example.com' }),
  };

  const mockBatchWriteService = {
    commit: jasmine.createSpy('commit'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizeQuarterlyGoalsComponent],
      providers: [
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: BATCH_WRITE_SERVICE, useValue: mockBatchWriteService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizeQuarterlyGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit back output event when Back button is clicked', () => {
    let emitted = false;
    component.back.subscribe(() => {
      emitted = true;
    });

    const backButton = fixture.nativeElement.querySelector('.back-btn') as HTMLButtonElement;
    expect(backButton).toBeTruthy();
    backButton.click();

    expect(emitted).toBeTrue();
  });

  it('should emit next output event when Next button is clicked', () => {
    let emitted = false;
    component.next.subscribe(() => {
      emitted = true;
    });

    const nextButton = fixture.nativeElement.querySelector('.next-btn') as HTMLButtonElement;
    expect(nextButton).toBeTruthy();
    nextButton.click();

    expect(emitted).toBeTrue();
  });
});
