const fs = require('fs');
const util = require('util');


const readFile = util.promisify(fs.readFile);

exports.resolve = async function resolve(cwd = process.cwd()) {
    const {dependencies} = JSON.parse(await readFile('./package.json', 'utf8'));
    const result = { imports: {} };
    for (const key of Object.keys(dependencies)) {
        const modulePath = ignoreError(() => require.resolve(key, { paths: [cwd] }), '');
        if (modulePath.startsWith(cwd)) {
            result.imports[key] = modulePath.substr(cwd.length);
        }
    }
    return result;
};

function ignoreError(test, value) { try { return test() } catch { return value } }
