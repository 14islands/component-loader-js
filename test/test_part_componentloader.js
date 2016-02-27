import jsdom from 'mocha-jsdom';
import chai from 'chai';
import sinon from 'sinon';
import ComponentLoader, {Component} from '../src/index';


const expect = chai.expect;

describe('ComponentLoader', () => {
  context('when registering/unregistering components', () => {
    jsdom()
    it('should add from constructor', () => {
      class TestComponent1 extends Component {}
      class TestComponent2 extends Component {}
      const cl = new ComponentLoader({TestComponent1, TestComponent2});
      expect(cl.components).to.have.all.keys('TestComponent1', 'TestComponent2')
    });

    it('should add from register() function', () => {
      class TestComponent1 extends Component {}
      class TestComponent2 extends Component {}
      const cl = new ComponentLoader({TestComponent1});
      cl.register({TestComponent2})
      expect(cl.components).to.have.all.keys('TestComponent1', 'TestComponent2')
    });

    it('should remove when using unregister() function', () => {
      class TestComponent1 extends Component {}
      class TestComponent2 extends Component {}
      const cl = new ComponentLoader({TestComponent1, TestComponent2});
      cl.unregister('TestComponent1')
      expect(cl.components).to.have.all.keys('TestComponent2')
    });
  });

  context('when one component exists in DOM', () => {
    jsdom({
      html: '<div data-component="TestComponent"></div>'
    });

    it('should find one Component properly', () => {
      class TestComponent extends Component {}
     	const cl = new ComponentLoader({TestComponent});
      cl.scan();
      expect(cl.numberOfInitializedComponents).to.equal(1)
    });
  });

  context('when same component exists multiple times in DOM', () => {
    jsdom({
      html: `
        <div data-component="TestComponent"></div>
        <div data-component="TestComponent"></div>
      `
    });

    it('should find all components', () => {
      class TestComponent extends Component {}
      const cl = new ComponentLoader({TestComponent});
      cl.scan();
      expect(cl.numberOfInitializedComponents).to.equal(2)
    });
  });

  context('when same component exists multiple times on same DOM node', () => {
    jsdom({
      html: `
        <div data-component="TestComponent TestComponent"></div>
      `
    });

    it('only one instance should be detected', () => {
      class TestComponent extends Component {}
      const cl = new ComponentLoader({TestComponent});
      cl.scan();
      expect(cl.numberOfInitializedComponents).to.equal(1)
    });
  });

  context('when different components exists on multiple DOM nodes', () => {
    jsdom({
      html: `
        <div data-component="TestComponent1"></div>
        <div data-component="TestComponent2"></div>
      `
    });

    it('should find all components', () => {
      class TestComponent1 extends Component {}
      class TestComponent2 extends Component {}
      const cl = new ComponentLoader({TestComponent1, TestComponent2});
      cl.scan();
      expect(cl.numberOfInitializedComponents).to.equal(2)
    });
  });

  context('when different components exists on same DOM node', () => {
    jsdom({
      html: `
        <div data-component="TestComponent1 TestComponent2"></div>
      `
    });

    it('should find all components', () => {
      class TestComponent1 extends Component {}
      class TestComponent2 extends Component {}
      const cl = new ComponentLoader({TestComponent1, TestComponent2});
      cl.scan();
      expect(cl.numberOfInitializedComponents).to.equal(2)
    });
  });

  context('when component is not registered', () => {
    jsdom({
      html: `
        <div data-component="UnknownComponent"></div>
      `
    });

    it('should throw error', () => {
      const cl = new ComponentLoader();
      expect(cl.scan).to.throw(Error);
    });
  });

  context('when scan() is called multiple times', () => {
    jsdom({
      html: `
        <div data-component="TestComponent"></div>
      `
    });

    it('component should only be instantiated once', () => {
      const spy = sinon.spy()
      class TestComponent extends Component {
        constructor() {
          super(...arguments)
          spy.call();
        }
      }
      const cl = new ComponentLoader({TestComponent});
      cl.scan();
      cl.scan();
      expect(spy.calledOnce).to.be.true
    });
  });

  context('when component is removed from DOM', () => {
    jsdom({
      html: `
        <div data-component="TestComponent"></div>
      `
    });

    it('scan() should remove it if previously instantiated', () => {
      // register and scan
      class TestComponent extends Component {}
      const cl = new ComponentLoader({TestComponent})
      cl.scan()

      expect(cl.numberOfInitializedComponents).to.equal(1)
      expect(cl.initializedComponents).to.not.be.empty

      // removed El
      const el = document.querySelector('[data-component="TestComponent"]')
      document.body.removeChild(el)

      // scan again
      cl.scan()
      expect(cl.numberOfInitializedComponents).to.equal(0)
      expect(cl.initializedComponents).to.be.empty

    });
  });

});



