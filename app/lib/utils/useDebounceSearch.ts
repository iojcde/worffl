import { useState, Dispatch, SetStateAction } from 'react'
import useConstant from 'use-constant'
import { useAsync, UseAsyncReturn } from 'react-async-hook'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
export type UseDebouncedSearchReturn = {
  inputText: string
  setInputText: Dispatch<SetStateAction<string>>
  searchResults: UseAsyncReturn<
    Record<string, unknown>[] | undefined,
    (string | ((text: string) => Promise<Record<string, unknown>[] | undefined>))[]
  >
}

export const useDebouncedSearch = (
  searchFunction: (text: string) => Promise<Record<string, unknown>[] | undefined>,
): UseDebouncedSearchReturn => {
  // Handle the input text state
  const [inputText, setInputText] = useState<string>('')

  // Debounce the original search async function
  const debouncedSearchFunction = useConstant(() => AwesomeDebouncePromise(searchFunction, 300))

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke
  const searchResults = useAsync(async () => {
    return debouncedSearchFunction(inputText)
  }, [debouncedSearchFunction, inputText])

  // Return everything needed for the hook consumer
  return {
    inputText,
    setInputText,
    searchResults,
  }
}
/*
{
inputText: string
setInputText: Dispatch<SetStateAction<string>>
searchResults: UseAsyncReturn<void | never[], (string | ((inputText: string) => void))[]>
}  */
