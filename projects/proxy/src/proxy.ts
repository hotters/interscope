import { ClientRequest, IncomingMessage, ServerResponse } from 'http';
import { ProxyHttpResponse } from './models';

declare var window: any;

const Http = window.require('http');
const Url = window.require('url');
const Crypto = window.require('crypto');
const Proxy = window.require('http-proxy');

export class HttpProxy {

  private proxy;
  private server;

  constructor(
    private onRequest: (req: IncomingMessage & { body?: any, id?: string }) => Promise<{ statusCode, headers, body }>,
    private onResponse: (req: IncomingMessage, res: ProxyHttpResponse) => void,
    listenerHandler = () => console.log('[Proxy] Started'),
    errorHandler = (error) => console.log('[Proxy] Error', error)
  ) {
    this.createProxy(errorHandler);
    this.createServer(listenerHandler);
  }

  private createServer(listenerHandler) {
    this.server = Http.createServer((clientReq, clientRes) => this.listener(clientReq, clientRes));
    this.server.listen(8888, () => listenerHandler());
    this.server.on('error', (error: Error) => console.log('[HTTP]', error));
    this.server.on('upgrade', (req, socket, head) => {
      // req.url = req.url.replace('gaz', 'localhost');
      // req.headers.host = req.headers.host.replace('gaz', 'localhost');
      this.proxy.ws(req, socket, head);
    });
  }

  private createProxy(errorHandler) {
    this.proxy = Proxy.createProxyServer({ ws: true, changeOrigin: false });
    this.proxy.on('error', (err, req: IncomingMessage, res: ServerResponse) => {
      errorHandler(err);
      res.end();
      // TODO передавать текст ошибки в ui
      this.onResponse(req, {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        headers: res.getHeaders(),
        body: null
      });
    });

    this.proxy.on('proxyReq', async (proxyReq: ClientRequest, req, res: ServerResponse, options) => {
      // modify req/res here
      req.id = this.createId(req.method + req.url);
      req.body = await this.getBody(req);

      const transformedRequest = await this.onRequest(req);
      if (transformedRequest) {
        proxyReq.abort();
        res.writeHead(transformedRequest.statusCode, transformedRequest.headers);
        res.end(transformedRequest.body);
      }
    });

    this.proxy.on('proxyRes', (proxyRes, req, res) => {
      this.onProxyResponse(proxyRes, req, res);
    });
  }

  private listener(clientReq: IncomingMessage & { body?, id?: string, mapped?: boolean }, clientRes: ServerResponse) {
    let { protocol, host } = Url.parse(clientReq.url);
    clientReq.mapped = false;
    if (window.localStorage[host]) {
      host = window.localStorage[host];
      clientReq.mapped = true;
    }
    this.proxy.web(clientReq, clientRes, { target: `${protocol}//${host}` });
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

}
