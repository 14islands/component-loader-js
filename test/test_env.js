import jsdom from 'mocha-jsdom';
import chai from 'chai';
import ComponentLoader, {Component} from '../src/index';


const expect = chai.expect;

describe('Test Enviroment', () => {
  jsdom()
  it('should have a valid DOM', () => {
    var div = document.createElement('div')
    expect(div.nodeName).to.equal('DIV')
  });
})

describe('Module', () => {
  it('should export ComponentLoader', () => {
    expect(ComponentLoader).to.exist
  });
  it('should export Component', () => {
    expect(Component).to.exist
  });
});
