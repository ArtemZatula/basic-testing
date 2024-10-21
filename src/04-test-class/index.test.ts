import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';
import * as lodash from 'lodash';

jest.mock('lodash', () => {
  return {
    __esModule: true,
    ...jest.requireActual('lodash'),
  };
});

describe('BankAccount', () => {
  const initBalance = 1000;
  let account: BankAccount;

  beforeEach(() => {
    account = getBankAccount(initBalance);
  });

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(initBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(1001)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => account.transfer(1001, getBankAccount(100))).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(1001, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const value = 1;
    account.deposit(value);
    expect(account.getBalance()).toBe(initBalance + value);
  });

  test('should withdraw money', () => {
    const value = 100;
    account.withdraw(value);
    expect(account.getBalance()).toBe(initBalance - value);
  });

  test('should transfer money', () => {
    const newAccount = getBankAccount(100);
    account.transfer(100, newAccount);
    expect(newAccount.getBalance()).toBe(200);
    expect(account.getBalance()).toBe(900);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(lodash, 'random').mockReturnValueOnce(50).mockReturnValueOnce(1);
    await expect(account.fetchBalance()).resolves.toEqual(50);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const newBalance = 30;
    jest
      .spyOn(lodash, 'random')
      .mockReturnValueOnce(newBalance)
      .mockReturnValueOnce(1);
    await account.synchronizeBalance();
    expect(account.getBalance()).toEqual(newBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(lodash, 'random').mockReturnValueOnce(30).mockReturnValueOnce(0);
    await expect(account.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
