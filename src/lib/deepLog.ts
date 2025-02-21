// ANSI escape codes
const reset = '\x1b[0m';
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const magenta = '\x1b[35m';
const yellow = '\x1b[33m';
const gray = '\x1b[90m';

export const JSONColor = {
    stringify(json, replacer = null, space = 2) {
        try {
            // Convert JSON object to a formatted JSON string
            const jsonString = JSON.stringify(json, replacer, space);

            // Apply colors to different parts of the JSON string
            return jsonString
                .replace(/(".*?")(?=:)/g, `${cyan}$1${reset}`)
                .replace(/(:\s*"(.*?)")/g, (match, p1) => `${green}${p1}${reset}`)
                .replace(/(:\s*\d+)/g, `${magenta}$1${reset}`)
                .replace(/(:\s*true|false)/g, `${yellow}$1${reset}`)
                .replace(/(:\s*null)/g, `${gray}$1${reset}`);
        } catch (error : unknown) {
            // console.error("JSONColor.stringify에서 에러 :", error);
            if(error instanceof Error) {
                if(error.message.includes("undefined")){
                    return "undefined";
                } else if(error.message.includes("null")){
                    return "null";
                } else {
                    return "Error";
                }
            } else if( typeof error === "string") {
                if(error.includes("undefined")){
                    return "undefined";
                } else if(error.includes("null")){
                    return "null";
                } else {
                    return "Error";
                }
            }

        }
    },
}
