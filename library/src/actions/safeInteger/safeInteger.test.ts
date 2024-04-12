import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  safeInteger,
  type SafeIntegerAction,
  type SafeIntegerIssue,
} from './safeInteger.ts';

describe('safeInteger', () => {
  describe('should return action object', () => {
    const baseAction: Omit<SafeIntegerAction<number, never>, 'message'> = {
      kind: 'validation',
      type: 'safe_integer',
      expects: null,
      requirement: expect.any(Function),
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: SafeIntegerAction<number, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(safeInteger()).toStrictEqual(action);
      expect(safeInteger(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(safeInteger('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies SafeIntegerAction<number, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(safeInteger(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies SafeIntegerAction<number, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = safeInteger();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for safe integer numbers', () => {
      expectNoActionIssue(action, [
        0,
        1,
        -500,
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = safeInteger('message');
    const baseIssue: Omit<SafeIntegerIssue<number>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'safe_integer',
      expected: null,
      message: 'message',
      requirement: expect.any(Function),
    };

    test('for unsafe integer numbers', () => {
      expectActionIssue(action, baseIssue, [
        9007199254740992,
        Number.MAX_SAFE_INTEGER + 1,
        Number.MIN_SAFE_INTEGER - 1,
      ]);
    });

    test('for fractional and irrational numbers', () => {
      expectActionIssue(action, baseIssue, [5.5, -0.000001, Math.PI]);
    });

    test('for infinity and NaN', () => {
      expectActionIssue(action, baseIssue, [Infinity, -Infinity, NaN]);
    });
  });
});
