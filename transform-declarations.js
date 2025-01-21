const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const declarationsDir = path.resolve(__dirname, 'src/declarations');

const transformFilesInDirectory = (directory) => {
    fs.readdir(directory, (err, files) => {
        if (err) {
            return console.error('Could not list the directory.', err);
        }

        files.forEach(file => {
            const filePath = path.join(directory, file);
            fs.stat(filePath, (err, stat) => {
                if (err) {
                    return console.error('Error stating file.', err);
                }

                if (stat.isFile() && file.endsWith('.js')) {
                    exec(`npx babel ${filePath} --out-file ${filePath}`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Error transforming ${file}:`, error);
                            return;
                        }
                        console.log(`Transformed ${filePath} to CommonJS`);
                    });
                } else if (stat.isDirectory()) {
                    transformFilesInDirectory(filePath); // Recursive call
                }
            });
        });
    });
}

transformFilesInDirectory(declarationsDir);

