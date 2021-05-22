import { Button, Card, Input, Select } from '@geist-ui/react'
import { GitHub, Plus, Search } from 'react-feather'
import { useCurrentUser } from 'app/core/hooks/useCurrentUser'
import { ChangeEvent, useState } from 'react'
import { Link } from 'blitz'
import base64url from 'base64url'
import { getCurrentUserResult } from 'app/users/queries/getCurrentUser'

const GitImportCard: React.FC = () => {
  // not implemented yet
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState([])
  const user = useCurrentUser()
  const sleep = (ms: number): Promise<unknown> => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  const search = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    await sleep(1000)
    const res = await fetch(`/api/github/search/?q=${e.target.value}`).then((res) => res.json())
    setData(res)
  }

  return (
    <>
      <div className="flex flex-row gap-2">
        <Select className="w-56">
          <Select.Option
            onClick={() =>
              window.open(
                `https://github.com/apps/${
                  process.env.NODE_ENV === 'production' ? 'dply-app' : 'dply-app-dev'
                }/installations/new?state=${base64url(JSON.stringify({ next: '/new' }))}`,
                'Add a GitHub Org or User',
                'toolbar=no,location=no,menubar=no',
              )
            }
            value="1"
          >
            <div className="flex items-center">
              <Plus className="h-3 w-3 mr-2" />
              Add GitHub Account or Org
            </div>
          </Select.Option>
          <Select.Option value="2">Option 1</Select.Option>
        </Select>
        <Input icon={<Search />} placeholder="Search Repos" onChange={search} className="mb-2" />
        {/* <Input icon={<Search />} placeholder="Search Repos" className="mb-2" onChange={search} /> */}
      </div>
      <DataCard data={data} user={user} />
    </>
  )
}

type dataCardArgs = {
  data: Array<Record<string, unknown>>
  user: getCurrentUserResult | null
}
const DataCard = ({ data, user }: dataCardArgs): JSX.Element => {
  return (
    <>
      {data !== undefined &&
        Object.keys(data)
          .slice(0, 4)
          .map((itemKey) => (
            <Card key={itemKey} style={{ marginBottom: '3px' }}>
              <div className="flex items-center">
                <GitHub className="mr-3 md:w-5 md:h-5" />
                <span className="w-full">
                  {data[itemKey].name}
                  <span className="ml-2 text-xs">
                    {Math.round(
                      (Date.now() - new Date(data[itemKey].updated_at).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}
                    d ago
                  </span>
                </span>
                <Link
                  href={{
                    pathname: '/new/details',
                    query: { repo: data[itemKey].html_url, id: data[itemKey].id },
                  }}
                >
                  <Button className="min-w-max px-3" size="small" type="success">
                    Import
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
    </>
  )
}

export default GitImportCard
