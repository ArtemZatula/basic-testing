import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    expect(12).toBe(simpleCalculator({ a: 2, b: 10, action: Action.Add }));
  });

  test('should subtract two numbers', () => {
    expect(8).toBe(simpleCalculator({ a: 10, b: 2, action: Action.Subtract }));
  });

  test('should multiply two numbers', () => {
    expect(20).toBe(simpleCalculator({ a: 2, b: 10, action: Action.Multiply }));
  });

  test('should divide two numbers', () => {
    expect(5).toBe(simpleCalculator({ a: 10, b: 2, action: Action.Divide }));
  });

  test('should exponentiate two numbers', () => {
    expect(4).toBe(
      simpleCalculator({ a: 2, b: 2, action: Action.Exponentiate }),
    );
  });

  test('should return null for invalid action', () => {
    expect(
      simpleCalculator({ a: 2, b: 2, action: 'Action' as Action }),
    ).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    expect(simpleCalculator({ a: 'a', b: 2, action: Action.Add })).toBeNull();
  });
});
