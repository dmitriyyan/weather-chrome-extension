import useSWR from 'swr';
import { getStoredOptions } from '../utils/storage';

export function useOptions() {
  const {
    data: options,
    mutate: mutateOptions,
    isLoading,
    isValidating,
  } = useSWR('options', getStoredOptions);
  return { options, mutateOptions, isLoading, isValidating };
}
