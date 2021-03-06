const assert = require('assert');
const { Timer } = require('../src/timer');

describe('Timer', function () {
  it('should fire an event once in due time', function (done) {
    let fired = 0;
    const timer = new Timer(function () {
      return ++fired;
    });

    assert.strictEqual(false, timer.running);
    timer.start(20);
    assert.strictEqual(true, timer.running);

    return setTimeout(function () {
      assert.strictEqual(1, fired);
      return done();
    }
    , 50);
  });

  it("shouldn't fire after it is stopped", function (done) {
    let fired = 0;
    const timer = new Timer(function () {
      return ++fired;
    });

    timer.start(20);
    setTimeout(() => timer.stop(), 10);

    return setTimeout(function () {
      assert.strictEqual(0, fired);
      return done();
    }
    , 50);
  });

  return it('should restart interval on each start() call', function (done) {
    let okToFire = false;
    let fired = 0;
    const timer = new Timer(function () {
      assert.strictEqual(true, okToFire);
      return ++fired;
    });

    timer.start(10);
    setTimeout(() => timer.start(50), 5);
    setTimeout(() => { okToFire = true; }, 15);

    return setTimeout(function () {
      assert.strictEqual(1, fired);
      return done();
    }
    , 100);
  });
});
