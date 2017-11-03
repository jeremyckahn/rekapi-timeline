import MyClass from '../src/index';
import assert from 'assert';

describe('MyClass', () => {
  let myClass;

  beforeEach(() => {
    myClass = new MyClass();
  });

  describe('constructor', () => {
    it('constructs', () => {
      assert(myClass instanceof MyClass);
    });
  });

  describe('sayHello', () => {
    it('says hello', () => {
      assert.equal(myClass.sayHello(), 'Hello, World!');
    });
  });
});
