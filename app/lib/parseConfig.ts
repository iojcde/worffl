import { getConfigInput, parseConfigReturn } from 'types'

const images = ['node:14-alpine', 'alpine', 'node:14']

export const getConfig = async ({
  token,
  repo,
  path,
}: getConfigInput): Promise<parseConfigReturn> => {
  const config = await fetch(`https://api.github.com/repos/${repo}/contents/${path}/dply.json`, {
    headers: {
      authorization: `bearer ${token}`,
    },
  }).then((res) => res.json())
  if (images.indexOf(config.image) === -1) return { err: 'invalid image' }
  return config
}
