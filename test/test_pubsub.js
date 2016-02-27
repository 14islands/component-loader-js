import jsdom from 'mocha-jsdom';
import chai from 'chai';
import sinon from 'sinon';
import ComponentLoader, {Component} from '../src/index';


const expect = chai.expect;

describe('Publish/Subscribe functionality', () => {
  
  context('when publishing topic to single listener', () => {
    jsdom({
      html: `
        <div data-component="SubscribingComponent"></div>
        <div data-component="PublishingComponent"></div>
      `
    });

    it('should call listener with proper data', () => {
      const spy = sinon.spy()
      const testData = {some: 123, data: 456}
      class SubscribingComponent extends Component {
        constructor() {
          super(...arguments)
          this.subscribe('test-event', spy)
        }
      }
      class PublishingComponent extends Component {
        constructor() {
          super(...arguments)
          this.publish('test-event', testData);
        }
      }
      const cl = new ComponentLoader({SubscribingComponent, PublishingComponent})
      cl.scan()
      expect(spy.called).to.be.true
      expect(spy.calledWith(testData)).to.be.true
    });
  });
  
  context('when publishing topic to multiple listeners', () => {
    jsdom({
      html: `
        <div data-component="SubscribingComponent"></div>
        <div data-component="AnotherSubscribingComponent"></div>
        <div data-component="PublishingComponent"></div>
      `
    });

    it('should call multiple listeners with proper data', () => {
      const spy = sinon.spy()
      const testData = {some: 123, data: 456}
      class SubscribingComponent extends Component {
        constructor() {
          super(...arguments)
          this.subscribe('test-event', spy)
        }
      }
      class AnotherSubscribingComponent extends Component {
        constructor() {
          super(...arguments)
          this.subscribe('test-event', spy)
        }
      }
      class PublishingComponent extends Component {
        constructor() {
          super(...arguments)
          this.publish('test-event', testData);
        }
      }
      
      const cl = new ComponentLoader({
        SubscribingComponent, 
        AnotherSubscribingComponent,
        PublishingComponent
      })
      cl.scan()

      expect(spy.callCount).to.equal(2)
      expect(spy.calledWith(testData)).to.be.true
    });
  });

  context('when unsubscribing from topic', () => {
    jsdom({
      html: `<div data-component="SubscribingComponent"></div>`
    });

    it('should not be called on next publish', () => {
        const spy = sinon.spy()
        class SubscribingComponent extends Component {
          constructor() {
            super(...arguments)
            this.subscribe('test-event', spy)
          }
          destroy() {
            this.unsubscribe('test-event', spy)
          }
        }
    
        const cl = new ComponentLoader({SubscribingComponent})
        cl.scan()

        // trigger event
        cl.publish('test-event');

         // removed El
        const el = document.querySelector('[data-component="SubscribingComponent"]')
        document.body.removeChild(el)

        // scan again
        cl.scan()

        // trigger event for second time
        cl.publish('test-event');

        expect(spy.calledOnce).to.be.true
    });

  });

});

