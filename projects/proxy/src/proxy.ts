import { ClientRequest, IncomingMessage, ServerResponse } from 'http';
import { ClientHttpResponse } from './models';

const Http = window.require('http');
const Url = window.require('url');
const Crypto = window.require('crypto');
const Proxy = window.require('http-proxy');

export class HttpProxy {

  private proxy;

  constructor(
    private transform: (proxyReq: ClientRequest, req: IncomingMessage & { body?: any, id?: string }, res: ServerResponse) => Promise<null>,
    private onResponse: (req: IncomingMessage, res: ClientHttpResponse) => void,
    listenerHandler = () => console.log('[Proxy] Started'),
    private errorHandler = (error) => console.log('[Proxy] Error', error)
  ) {
    this.proxy = Proxy.createProxyServer({ ws: true, changeOrigin: false });

    Http.createServer((clientReq, clientRes) => {
      this.listener(clientReq, clientRes);
    }).listen(8888, () => listenerHandler()).on('upgrade', (req, socket, head) => {
      // req.url = req.url.replace('gaz', 'localhost');
      // req.headers.host = req.headers.host.replace('gaz', 'localhost');
      this.proxy.ws(req, socket, head);
    }).on('error', (error: Error) => console.log('[HTTP]', error));

    this.proxy.on('error', (err, req: IncomingMessage, res: ServerResponse) => {
      errorHandler(err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end();
      this.onResponse(req, {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        headers: res.getHeaders(),
        body: null
      });
    });

    this.proxy.on('proxyReq', async (proxyReq: ClientRequest, req, res: ServerResponse, options) => {
      // modify req/res here
      if (req.headers.origin) {
        req.headers.origin = (<string>req.headers.origin).replace('gaz', 'localhost');
      }
      // this.deleteRequestCacheHeaders(proxyReq);
      req.id = this.createId(req.method + req.url);
      req.body = await this.getBody(req);
      await this.transform(proxyReq, req, res);
    });

    this.proxy.on('proxyRes', (proxyRes, req, res) => {
      this.onProxyResponse(proxyRes, req, res);
    });
  }

  private listener(clientReq: IncomingMessage & { body?, id?: string }, clientRes: ServerResponse) {
    clientReq.url = clientReq.url.replace('gaz', 'localhost');
    clientReq.headers.host = clientReq.headers.host.replace('gaz', 'localhost');
    if (clientReq.headers.referer) {
      clientReq.headers.referer = (<string>clientReq.headers.referer).replace('gaz', 'localhost');
    }
    const url = Url.parse(clientReq.url);
    this.proxy.web(clientReq, clientRes, { target: `${url.protocol}//${url.host}` });
  }

  private onProxyResponse(proxyRes, clientReq: IncomingMessage, clientRes: ServerResponse) {
    if (!proxyRes.headers['content-type'] || /application\/(json|javascript)|text\/html/.test(proxyRes.headers['content-type'])) {
      this.getBody(proxyRes).then(body => {
        this.onResponse(clientReq, {
          statusCode: proxyRes.statusCode,
          statusMessage: proxyRes.statusMessage,
          headers: proxyRes.headers,
          body
        });
      });
    } else {
      this.onResponse(clientReq, {
        statusCode: proxyRes.statusCode,
        statusMessage: proxyRes.statusMessage,
        headers: proxyRes.headers,
        body: 'body is not text'
      });
    }
  }

  private getBody(message: IncomingMessage | ServerResponse): Promise<any> {
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

  private deleteRequestCacheHeaders(req: ClientRequest) {
    req.removeHeader('etag');
    req.removeHeader('if-none-match');
    req.removeHeader('if-modified-since');
    req.removeHeader('last-modified');
    req.setHeader('expires', '0');
    req.setHeader('cache-control', 'no-cache');
    req.setHeader('pragma', 'no-cache');
  }

}
