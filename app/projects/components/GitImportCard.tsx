import { Button, Card, Input, Select } from "@geist-ui/react"
import { GitHub, Plus, Search } from "react-feather"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useState } from "react"
import { Link } from "blitz"
import { LoadingCard } from "app/pages/new/index"
import base64url from "base64url"

const GitImportCard: React.FC = () => {
  // not implemented yet
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState({})
  const user = useCurrentUser()
  /*  const search = (e): void => { } */

  return (
    <>
      <div className="flex flex-row gap-2">
        <Select className="w-56">
          <Select.Option
            onClick={() =>
              window.open(
                `https://github.com/apps/dply-app/installations/new?state=${base64url(
                  JSON.stringify({ next: "/new" })
                )}`,
                "Add a GitHub Org or User",
                "toolbar=no,location=no,menubar=no"
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
        <Input icon={<Search />} placeholder="Search Repos" className="mb-2" />
        {/* <Input icon={<Search />} placeholder="Search Repos" className="mb-2" onChange={search} /> */}
      </div>

      {data === {} && (
        <>
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </>
      )}
      {data !== undefined &&
        Object.keys(data)
          .slice(0, 4)
          .map((itemKey) => (
            <Card key={itemKey} style={{ marginBottom: "3px" }}>
              <div className="flex items-center">
                <GitHub className="mr-3 md:w-5 md:h-5" />
                <span className="w-full">
                  {user?.name}/{data[itemKey].name}
                  <span className="ml-2 text-xs">
                    {Math.round(
                      (Date.now() - new Date(data[itemKey].updated_at).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                    d ago
                  </span>
                </span>
                <Link
                  href={{
                    pathname: "/new/details",
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
