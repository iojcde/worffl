// server.ts
import blitz from 'blitz/custom-server'
import { createServer } from 'http'
import httpProxy from 'http-proxy'
import { parse } from 'url'
import { log } from '@blitzjs/display'
import redis from 'redis'
import db from 'db'
import logger from 'logs'
const client = redis.createClient({ url: 'redis://redis' })
const proxy = httpProxy.createProxyServer()
const { PORT = '3000' } = process.env
const dev = process.env.NODE_ENV !== 'production'
const app = blitz({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    if (req.headers.host === 'worffl.jcde.xyz') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const parsedUrl = parse(req.url!, true)
      handle(req, res, parsedUrl)
    } else {
      client.get(`host:${req.headers.host}`, async (err, reply) => {
        if (reply == null) {
          const target = await db.deployment.findFirst({
            where: { domain: req.headers.host },
            select: { domain: true, id: true },
          })
          if (target == null) res.end('404 deployment not found')
          if (target?.id === undefined) return

          client.set(`host:${target?.domain}`, target?.id.toString())
          try {
            proxy.web(req, res, { target: target.domain })
          } catch (e) {
            logger.error(e)
          }
        } else {
          try {
            proxy.web(req, res, { target: reply })
          } catch (e) {
            logger.error(e)
          }
        }
      })
    }
  }).listen(PORT, () => {
    log.success(`Ready on http://localhost:${PORT}`)
  })
})
