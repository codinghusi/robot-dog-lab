/** @type {import("snowpack").SnowpackUserConfig } */

module.exports = {
    plugins: ['@snowpack/plugin-typescript'],
    mount: {
        "dist": {url: '/', static: true},
        "src": {url: '/dist'},
    },
    devOptions: {
        open: 'none'
    }
};