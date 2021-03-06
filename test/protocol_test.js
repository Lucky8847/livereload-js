const assert = require('assert');
const { Parser } = require('../src/protocol');

class MockHandler {
  constructor () {
    this._log = [];
    this.gotError = false;
  }

  obtainLog () { const result = this._log.join('\n'); this._log = []; return result; }

  log (message) { return this._log.push(message); }

  connected (protocol) {
    this.protocol = protocol;
  }

  error (error) {
    this.error = error;
    this.gotError = true;
  }

  message (msg) {
    switch (msg.command) {
      case 'reload': return this.log(`reload(${msg.path})`);
      default: return this.log(msg.commmand);
    }
  }
}

describe('Protocol', function () {
  it('should reject a bogus handshake', function () {
    const handler = new MockHandler();
    const parser = new Parser(handler);

    parser.process('boo');
    return assert.ok(handler.gotError);
  });

  it('should speak protocol 6', function () {
    const handler = new MockHandler();
    const parser = new Parser(handler);

    parser.process('!!ver:1.6');
    assert.strictEqual(6, parser.protocol);

    parser.process('[ "refresh", { "path": "foo.css" } ]');
    return assert.strictEqual('reload(foo.css)', handler.obtainLog());
  });

  return it('should speak protocol 7', function () {
    const handler = new MockHandler();
    const parser = new Parser(handler);

    parser.process('{ "command": "hello", "protocols": [ "http://livereload.com/protocols/official-7" ] }');
    assert.strictEqual(undefined, (handler.error || {}).message);
    assert.strictEqual(7, parser.protocol);

    parser.process('{ "command": "reload", "path": "foo.css" }');
    return assert.strictEqual('reload(foo.css)', handler.obtainLog());
  });
});
