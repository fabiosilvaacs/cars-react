import '@testing-library/jest-dom'

// Polyfills para NextResponse.json() em ambiente jsdom
if (typeof Object.getOwnPropertyDescriptor(globalThis, 'Request') === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util')
  Object.defineProperty(globalThis, 'TextEncoder', {
    writable: true,
    value: TextEncoder,
  })
  Object.defineProperty(globalThis, 'TextDecoder', {
    writable: true,
    value: TextDecoder,
  })
}

