/** @type {import('next').NextConfig} */
const walletStub = './src/lib/wallet-stub.js';

const nextConfig = {
  // Alias unused Algorand wallet connectors to an empty stub. use-wallet v3
  // statically references every connector; we only enable Pera + Lute, so the
  // rest are stubbed to keep them out of the bundle (and avoid native builds).
  turbopack: {
    resolveAlias: {
      '@agoralabs-sh/avm-web-provider': walletStub,
      '@algorandfoundation/liquid-auth-use-wallet-client': walletStub,
      '@blockshake/defly-connect': walletStub,
      '@perawallet/connect-beta': walletStub,
      '@walletconnect/modal': walletStub,
      '@walletconnect/sign-client': walletStub,
      '@magic-ext/algorand': walletStub,
      'magic-sdk': walletStub,
    },
  },
};

module.exports = nextConfig;
