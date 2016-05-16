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

  context('when passed scan() data', () => {
    jsdom({
      html: '<div data-component="TestComponent" data-first-param="firstValue" data-second-param="secondValue"></div>'
    });

    it('should populate this.data and overwrite default', () => {
      const spy = sinon.spy();
      class TestComponent extends Component {
        defaultData() {
          return {
            myScanProp: 'defaultValue'
          }
        }
        constructor() {
          super(...arguments);
          expect(this.data.myScanProp).to.equal('scanValue');
        }
      }
      const cl = new ComponentLoader({TestComponent})
      cl.scan({myScanProp: 'scanValue'})
    });
  });

  context('when passed DOM data attributes', () => {
    jsdom({
      html: '<div data-component="TestComponent" data-first-param="firstValue" data-second-param="secondValue"></div>'
    });

    it('should populate this.data', () => {
      const spy = sinon.spy()
      class TestComponent extends Component {
        constructor() {
          super(...arguments);
          expect(this.data.firstParam).to.equal('firstValue');
          expect(this.data.secondParam).to.equal('secondValue');
        }
      }
      const cl = new ComponentLoader({TestComponent})
      cl.scan()
    });

    it('should use default data if DOM data is missing', () => {
      const spy = sinon.spy()
      class TestComponent extends Component {
        defaultData() {
          return {
            unspecifiedParam: 'defaultValue'
          }
        }
        constructor() {
          super(...arguments);
          expect(this.data.unspecifiedParam).to.equal('defaultValue');
        }
      }
      const cl = new ComponentLoader({TestComponent})
      cl.scan()
    });

    it('DOM data should override default data', () => {
      const spy = sinon.spy()
      class TestComponent extends Component {
        defaultData() {
          return {
            firstParam: 'defaultValue',
            secondParam: 'defaultSecondValue'
          }
        }
        constructor() {
          super(...arguments);
          expect(this.data.firstParam).to.equal('firstValue');
          expect(this.data.secondParam).to.equal('secondValue');
        }
      }
      const cl = new ComponentLoader({TestComponent})
      cl.scan()
    });

    it('scan() data should not destroy DOM data when keys are different', () => {
      const spy = sinon.spy()
      class TestComponent extends Component {
        constructor() {
          super(...arguments);
          expect(this.data.firstParam).to.equal('firstValue');
          expect(this.data.secondParam).to.equal('secondValue');
          expect(this.data.myScanProp).to.equal('scanValue');
        }
      }
      const cl = new ComponentLoader({TestComponent})
      cl.scan({myScanProp: 'scanValue'})
    });

    it('scan() data should overwrite DOM data when keys are matching', () => {
      const spy = sinon.spy()
      class TestComponent extends Component {
        defaultData() {
          return {
            firstParam: 'defaultValue'
          }
        }
        constructor() {
          super(...arguments);
          expect(this.data.firstParam).to.equal('firstScanValue');
          expect(this.data.secondParam).to.equal('secondScanValue');
        }
      }
      const cl = new ComponentLoader({TestComponent})
      cl.scan({firstParam: 'firstScanValue', secondParam: 'secondScanValue'})
    });

  });

});



