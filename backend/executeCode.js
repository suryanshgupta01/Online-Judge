const { exec } = require("child_process");
const path = require("path");

const executeCode = (filepath, dirCodes, inputFile, name, lang) => {
    const fileID = '_' + name
    const dirCodepath = path.join(dirCodes, fileID)
    const commands = {
        // "cpp": `g++ ${filepath} -o ${dirCodepath} && cd ${dirCodes} && .\\${fileID}`,
        "cpp": `g++ ${filepath} -o ${dirCodepath} && ${dirCodepath}`,
        "py": `python ${filepath}`,
        "c": `gcc ${filepath} -o ${dirCodepath} && ${dirCodepath}`,
        "java": `java ${filepath}`,
        "cs": `csc ${filepath} && cd ${dirCodes} && .\${fileID}.out`,
        "php": `php ${filepath}`,
        "rb": `ruby ${filepath}`,
        "rs": `rustc ${filepath}  && cd ${dirCodes} && .\${fileID}`
    }
    console.log(dirCodepath)//try execFile
    return new Promise((resolve, reject) => {
        try {
            const process = exec(
                commands[lang], (error, stdout, stderr) => {
                    if (error) {
                        reject({ error, stderr });
                    }
                    else if (stderr) {
                        reject(stderr);
                    }
                    else resolve(stdout);
                })
            process.stdin.write(inputFile);
            process.stdin.end();
        } catch (err) {
            reject(err)
        }
    });

};

module.exports = {
    executeCode
};