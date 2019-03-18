import {IncomingMessage, ServerResponse} from 'http';
import {ClientResponse} from 'proxy';

declare var window: Window;

interface Window {
  process: any;
  require: NodeRequire;
  Proxy;
  Http;
  Url;
  Crypto;
}

const Http = window.require('http');
const Url = window.require('url');
const Crypto = window.require('crypto');
const Proxy = window.require('http-proxy');

export class HttpProxy {

  private proxy;

  constructor(
    private transform: (req: IncomingMessage & { body?: any, id?: string }, res: ServerResponse) => Promise<null>,
    private onResponse: (req: IncomingMessage, res: ClientResponse) => void,
    listenerHandler = () => console.log('[Proxy] Started'),
    private errorHandler = (error) => console.log('[Proxy] Error', error)
  ) {
    this.proxy = Proxy.createProxyServer({changeOrigin: true});

    Http.createServer((clientReq, clientRes) => {
      this.listener(clientReq, clientRes);
    }).on('upgrade', (req, socket, head) => {
      this.proxy.ws(req, socket, head);
    }).listen(8888, () => listenerHandler())
      .on('error', (error: Error) => console.log('[HTTP]', error));

    this.proxy.on('proxyReq', async (proxyReq, req, res, options) => {
      // proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
      req.id = this.createId(req.method + req.url);
      req.body = await this.getBody(req);
      await this.transform(req, res);
    });

    this.proxy.on('proxyRes', (proxyRes, req, res) => {
      this.onProxyResponse(proxyRes, req, res);
    });
  }

  private listener(clientReq: IncomingMessage & { body?: any, id?: string }, clientRes: ServerResponse) {
    const url = Url.parse(clientReq.url);
    this.proxy.web(clientReq, clientRes, {target: `${url.protocol}//${url.host}`, changeOrigin: true});
  }

  private onProxyResponse(res, clientReq: IncomingMessage, clientRes: ServerResponse) {
    // if (!clientRes.headersSent) {
    //   clientRes.writeHead(res.statusCode, Object.assign(res.headers, clientRes.getHeaders()));
    // }
    if (/application\/json|text\/html/.test(res.headers['content-type'])) {
      this.getBody(res).then(body => {
        this.onResponse(clientReq, {
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          body
        });
      });
    } else {
      this.onResponse(clientReq, {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        headers: res.headers,
        body: 'body is not text'
      });
    }
  }

  private getBody(message: IncomingMessage | ServerResponse) {
    return new Promise((resolve, reject) => {
      const body = [];
      message
        .on('error', error => {
          console.log('[GET BODY ERROR]', error);
          return resolve(null);
        })
        .on('data', chunk => body.push(chunk))
        .on('end', () => resolve(Buffer.concat(body).toString()));
    });
  }

  private createId(str: string) {
    return Crypto.createHash('md5').update(str).digest('hex');
  }

  private deleteCacheHeaders(res) {
    delete res.headers.etag;
    delete res.headers['if-none-match'];
    delete res.headers['if-modified-since'];
    delete res.headers['last-modified'];
    res.headers.expires = '0';
    res.headers.pragma = 'no-cache';
    res.headers['cache-control'] = 'no-cache';
  }

}
