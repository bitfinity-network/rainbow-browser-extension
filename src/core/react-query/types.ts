/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  QueryFunctionContext,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';

type PromiseValue<PromiseType> = PromiseType extends PromiseLike<infer Value>
  ? PromiseValue<Value>
  : PromiseType;

// Used to obtain argument types for query functions.
export type QueryFunctionArgs<T extends (...args: any) => any> =
  QueryFunctionContext<ReturnType<T>>;

// Used to obtain types for query function results.
export type QueryFunctionResult<FnType extends (...args: any) => any> =
  PromiseValue<ReturnType<FnType>>;

// Note: we probably want to restrict the amount of configuration
// to the React Query hook. So we are picking out the only the
// configuration the consumer needs. I think these options are
// reasonable.
export type QueryConfig<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey,
> = Pick<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  | 'cacheTime'
  | 'enabled'
  | 'refetchInterval'
  | 'retry'
  | 'staleTime'
  | 'select'
  | 'onError'
  | 'onSettled'
  | 'onSuccess'
>;

export type MutationConfig<Data, Error, Variables = void> = Pick<
  UseMutationOptions<Data, Error, Variables>,
  'onError' | 'onMutate' | 'onSettled' | 'onSuccess'
>;

// Used to obtain types for mutation function results.
export type MutationFunctionResult<FnType extends (...args: any) => any> =
  PromiseValue<ReturnType<FnType>>;
