import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { integer, type IntegerAction, type IntegerIssue } from './integer.ts';

describe('integer', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = IntegerAction<number, undefined>;
      expectTypeOf(integer()).toEqualTypeOf<Action>();
      expectTypeOf(integer(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(integer('message')).toEqualTypeOf<
        IntegerAction<number, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(integer(() => 'message')).toEqualTypeOf<
        IntegerAction<number, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Input = 1 | 2 | 3;
    type Action = IntegerAction<Input, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<IntegerIssue<Input>>();
    });
  });
});
