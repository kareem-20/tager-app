import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BalanceAccountPage } from './balance-account.page';

describe('BalanceAccountPage', () => {
  let component: BalanceAccountPage;
  let fixture: ComponentFixture<BalanceAccountPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BalanceAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
