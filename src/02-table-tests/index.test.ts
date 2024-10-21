import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 2, b: 10, action: Action.Add, expected: 12 },
  { a: 10, b: 2, action: Action.Subtract, expected: 8 },
  { a: 2, b: 10, action: Action.Multiply, expected: 20 },
  { a: 10, b: 2, action: Action.Divide, expected: 5 },
  { a: 2, b: 2, action: Action.Exponentiate, expected: 4 },
  { a: 2, b: 2, action: 'InvalidAction' as Action, expected: null },
  { a: 'a', b: 2, action: Action.Add, expected: null },
];

describe.each(testCases)(
  '$a $action $b',
  ({
    a,
    b,
    action,
    expected,
  }: {
    a: unknown;
    b: unknown;
    action: unknown;
    expected: number | null;
  }) => {
    test(`equals to ${expected}`, () => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    });
  },
);
