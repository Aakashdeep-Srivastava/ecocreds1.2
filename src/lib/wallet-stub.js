// Stub for Algorand wallet connector packages this app does not use.
// We only enable Pera (@perawallet/connect) and Lute (lute-connect); use-wallet
// statically references every connector, so the unused ones are aliased here to
// avoid bundling them. They are never imported at runtime for our wallet config.
module.exports = {};
module.exports.default = {};
