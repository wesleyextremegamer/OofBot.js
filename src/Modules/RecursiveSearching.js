const fs = require('fs');
const path = require('path');

function getFiles(dir, fileExtention)
{
    let files = [];
    const rootDir = fs.readdirSync(dir);

    for (const filename of rootDir)
    {
        const filePath = path.join(dir, filename)

        if (fs.lstatSync(filePath).isDirectory())
        {
            files = [...files, ...getFiles(filePath, fileExtention)];
        }else if (filename.endsWith(fileExtention)){
            files.push(filePath);
        }
    }

    return files
}

module.exports = getFiles