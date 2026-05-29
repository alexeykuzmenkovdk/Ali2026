import { SocksProxyAgent } from 'socks-proxy-agent'
// @ts-ignore
import nodeFetch from 'node-fetch'

const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY

export async function telegramFetch(url: string, options: any = {}) {
  if (proxyUrl) {
    const agent = new SocksProxyAgent(proxyUrl)
    return nodeFetch(url, { ...options, agent })
  }
  return nodeFetch(url, options)
}

