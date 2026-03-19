/**
 * Server detection utility.
 * Must be the first script injected (see manifest.json) so that window.server
 * is available to all subsequently loaded scripts, including storage.js.
 *
 * Sets window.server to the subdomain portion of the current host,
 * e.g. "xde", "sde", "rde".
 */
window.server = window.location.host.split('.')[0];
