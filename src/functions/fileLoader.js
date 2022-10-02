const { glob } = require('glob');
const { promisify } = require('util');
const proGlob = promisify(glob);

//grabs every file that ends with .js
async function loadFiles(dirName) {
    const Files = await proGlob(`${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`);
    //delete every cached file
    Files.forEach((file) => delete require.cache[require.resolve(file)]);
    console.log(Files.length);
    return Files;
}

module.exports = { loadFiles }