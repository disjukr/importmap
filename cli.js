#!/usr/bin/env node
const http = require('http');

const yargs = require('yargs');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');

const importmaps = require('.');


yargs
    .scriptName('importmaps')
    .command(
        '$0',
        'prints import-map.json to stdout',
        importmapOptions,
        async argv => console.log(await resolveImportmap(argv)),
    )
    .command('serve', 'serves import-map.json and static files as http', yargs => {
        yargs.option('p', {
            alias: 'port',
            type: 'number',
            demandOption: true,
            default: 3000,
            describe: 'Port to use',
        });
        importmapOptions(yargs);
    }, ({port, ...argv}) => {
        const serve = serveStatic('.');
        http.createServer(async (req, res) => {
            if (req.url === '/import-map.json') {
                res.end(await resolveImportmap(argv));
            } else {
                serve(req, res, finalhandler(req, res));
            }
        }).listen(port, err => {
            if (err) return console.error(err);
            console.log(`listening on http://localhost:${port}`);
        });
    })
    .help()
    .argv;

function importmapOptions(yargs) {
    yargs.option('indent', {
        number: true,
        default: 4,
        describe: 'indent size of import-map.json',
    });
}

async function resolveImportmap({indent}) {
    const importmap = await importmaps.resolve();
    return JSON.stringify(importmap, null, indent);
}
