export default class MyClass {
  /**
   * @constructs MyClass
   */
  constructor () {

    /**
     * @member MyClass#myBoolean
     * @type {boolean}
     * @default true
     */
    this.myBoolean = true;
  }

  /**
   * @method MyClass#sayHello
   * @returns {string} A friendly greeting.
   */
  sayHello () {
    return 'Hello, World!';
  }
}
