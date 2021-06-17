// server.ts
import blitz from 'blitz/custom-server'

import { createServer } from 'http'
import httpProxy from 'http-proxy'
import { parse } from 'url'
import { log } from '@blitzjs/display'
import redis from 'redis'
import db from 'db'
import logger from 'logs'
const proxy = httpProxy.createProxyServer()
const { PORT = '3000' } = process.env
const dev = process.env.NODE_ENV !== 'production'
const app = blitz({ dev })
const handle = app.getRequestHandler()

proxy.on('error', function (e) {
  logger.error(e)
})
app.prepare().then(() => {
  createServer(async (req, res) => {
    if (!dev) {
      const client = redis.createClient({ url: 'redis://redis' })
      if (req.headers.host === 'worffl.jcde.xyz') {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const parsedUrl = parse(req.url!, true)
        handle(req, res, parsedUrl)
      } else {
        logger.info(`Request from: ${req.headers.host}`)
        client.get(`host:${req.headers.host?.toLowerCase()}`, async (err, reply) => {
          if (reply == null) {
            const target = await db.deployment.findFirst({
              where: { domain: req.headers.host },
              select: { containerUrl: true, id: true },
            })
            if (target == null) {
              res.end('404 deployment not found')
              return
            }
            if (target?.containerUrl == null) res.end('404 deployment not found')

            proxy.web(req, res, { target: target!.containerUrl! })
          } else {
            proxy.web(req, res, { target: reply })
          }
        })
      }
    } else {
      const parsedUrl = parse(req.url!, true)
      handle(req, res, parsedUrl)
    }
  }).listen(PORT, () => {
    log.success(`Ready on http://localhost:${PORT}`)
  })
})
