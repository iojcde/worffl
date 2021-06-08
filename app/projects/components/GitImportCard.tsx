import { AiFillGithub } from 'react-icons/ai'
import { useEffect } from 'react'
import { Link } from 'blitz'
import { getAntiCSRFToken } from 'blitz'
import ConnectSelector from './connectSelector'
import { GhRepo } from 'db'
import { useDebouncedSearch, UseDebouncedSearchReturn } from 'app/lib/utils'
import Highlighter from 'react-highlight-words'
import { useCurrentUser } from 'app/core/hooks/useCurrentUser'

const GitImportCard: React.FC = () => {
  const useSearch = (): UseDebouncedSearchReturn =>
    useDebouncedSearch((text) => fetchvalue({ query: text }))

  const antiCSRFToken = getAntiCSRFToken()
  async function fetchvalue({
    query,
  }: {
    query?: string
  }): Promise<Record<string, unknown>[] | undefined> {
    if (antiCSRFToken) {
      const url = query === '' ? '/api/github/search' : `/api/github/search?q=${query}`
      const res = await fetch(url, {
        headers: { 'anti-csrf': antiCSRFToken },
      }).then((res) => res.json())
      return res
    }
    return []
  }

  const { inputText, setInputText, searchResults } = useSearch()

  useEffect(() => {
    setInputText('')
  }, [setInputText])

  return (
    <div className="p-4 mt-2 rounded-md border" style={{ height: 445 }}>
      <div className="flex flex-row gap-3">
        <ConnectSelector />
        <input
          value={inputText}
          className="border mb-2 rounded-md px-2 text-sm outline-none focus:ring-1 ring-indigo-500"
          onChange={(e) => setInputText(e.target.value)}
          type="text"
        />
      </div>
      {searchResults.result?.length !== 0 && !searchResults.loading && (
        <div style={{ height: 360 }}>
          <DataCard data={searchResults.result} input={inputText} />
        </div>
      )}
      {searchResults.loading && (
        <div className="w-full flex  rounded" style={{ height: 360 }}>
          <p className="text-center m-auto">Loading..</p>
        </div>
      )}
      {searchResults.result?.length === 0 && !searchResults.loading && (
        <div
          className="w-full  bg-gray-100 text-center border rounded flex "
          style={{ height: 360 }}
        >
          <div className="m-auto">
            <span className="font-medium">No Results Found</span>
            <p className="text-sm">
              Your search for <span className="font-medium">{inputText}</span> did not return any
              results.
            </p>
            <p></p>
          </div>
        </div>
      )}
    </div>
  )
}

type dataCardArgs = {
  data: Array<Record<string, unknown>> | undefined
  input: string
}
const DataCard = ({ data, input }: dataCardArgs): JSX.Element => {
  const user = useCurrentUser()
  if (data !== undefined)
    return (
      <div className="w-full bg-gray-100 rounded  flex flex-col   text-sm">
        {Object.keys(data)
          .slice(0, 5)
          .map((itemKey) => {
            const repo: GhRepo = data[itemKey]
            return (
              <div key={itemKey} className="bg-white p-4 rounded border">
                <div className="flex items-center">
                  <AiFillGithub className="mr-3  " size="2em" />
                  <span className="w-full">
                    <Highlighter
                      searchWords={[input]}
                      autoEscape={true}
                      textToHighlight={repo.name}
                    />
                    <span className="ml-2 text-xs">
                      {Math.round(
                        (Date.now() - new Date(data[itemKey].updatedAt).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}
                      d ago
                    </span>
                  </span>
                  <Link
                    href={{
                      pathname: '/new/details',
                      query: { id: repo.id, target: user?.id },
                    }}
                  >
                    <button className="min-w-max px-3 text-sm button">Import</button>
                  </Link>
                </div>
              </div>
            )
          })}
      </div>
    )
  return <></>
}

export default GitImportCard

/*  <div className="flex flex-row gap-2">
          <Select className="w-56">
            <Select.Option
              onClick={() =>
                window.open(
                  `https://github.com/apps/${process.env.NODE_ENV === 'production' ? 'dply-app' : 'dply-app-dev'
                  }/installations/new?state=${base64url(JSON.stringify({ next: '/new' }))}`,
                  'Add a GitHub Org or User',
                  'toolbar=no,location=no,menubar=no',
                )
              }
              data="1"
            >
              <div className="flex items-center">
                <Plus className="h-3 w-3 mr-2" />
              Add GitHub Account or Org
            </div>
            </Select.Option>
            <Select.Option value="2">Option 1</Select.Option>
          </Select>
          <Input icon={<Search />} placeholder="Search Repos" onChange={search} className="mb-2" />
        </div>
  */
