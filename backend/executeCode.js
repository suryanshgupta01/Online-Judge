const { exec } = require("child_process");
const path = require("path");

const executeCode = (filepath, dirCodes, inputFile, name, lang) => {
    const fileID = '_' + name
    const dirCodepath = path.join(dirCodes, fileID)
    const commands = {
        "cpp": `g++ ${filepath} -o ${dirCodepath} && cd ${dirCodes} && .\\${fileID}`,
        "py": `python ${filepath}`,
        "c": `gcc ${filepath} -o ${dirCodepath} && cd ${dirCodes} && .\\${fileID}`,
        "java": `java ${filepath}`,
        "cs": `csc ${filepath} && cd ${dirCodes} && .\\${fileID}.exe`,
        "php": `php ${filepath}`,
        "rb": `ruby ${filepath}`,
        "rs": `rustc ${filepath}  && cd ${dirCodes} && .\\${fileID}`
    }
    console.log(commands[lang])
    return new Promise((resolve, reject) => {
        const process = exec(
            commands[lang], (error, stdout, stderr) => {
                if (error) {
                    reject({ error, stderr });
                }
                if (stderr) {
                    reject(stderr);
                }
                resolve(stdout);
            })
        process.stdin.write(inputFile);
        process.stdin.end();
    });

};

module.exports = {
    executeCode
};