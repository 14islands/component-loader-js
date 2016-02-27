import jsdom from 'mocha-jsdom';
import chai from 'chai';
import sinon from 'sinon';
import ComponentLoader, {Component} from '../src/index';


const expect = chai.expect;

describe('Component', () => {

  context('when instantiated', () => {
    jsdom({
      html: '<div data-component="TestComponent"></div>'
    });

    it('should call constructor', () => {
      const spy = sinon.spy()
      class TestComponent extends Component {
        constructor() {
          super(...arguments)
          spy.call()
        }
      }
      const cl = new ComponentLoader({TestComponent})
      cl.scan()
      expect(spy.called).to.be.true
    });

    it('should have a valid element', () => {
      class TestComponent extends Component {
        constructor() {
          super(...arguments)
          expect(this.el.nodeName).to.equal('DIV')
        }
      }
      const cl = new ComponentLoader({TestComponent})
      cl.scan()
    });

    it('should have access to ComponentLoader', () => {
      class TestComponent extends Component {
        constructor() {
          super(...arguments)
          expect(this.__mediator).to.equal(cl)
        }
      }
      const cl = new ComponentLoader({TestComponent})
      cl.scan()
    });

    it('should be destroyed if removed from DOM', () => {
      const spy = sinon.spy()
      class TestComponent extends Component {
        destroy() {
          spy.call()
        }
      }

      // register and scan
      const cl = new ComponentLoader({TestComponent})
      cl.scan()

      // removed El
      const el = document.querySelector('[data-component="TestComponent"]')
      document.body.removeChild(el)

      // scan again
      cl.scan()
      expect(spy.called).to.be.true
    });

  });

});



