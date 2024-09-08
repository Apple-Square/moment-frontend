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

export const objectDigger = (input) => {
    if(typeof input === 'object') {

        const logMessages: string[] = []; // 로그 메시지를 저장할 배열 =
        const ownProperties: string[] = [];  // 객체 자체의 속성을 저장할 배열
        const prototypeProperties: string[] = [];  // 프로토타입 체인상의 속성을 저장할 배열
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                ownProperties.push(`${key}: ${input[key as keyof typeof input]}`);
            } else {
                prototypeProperties.push(`${key}: ${input[key as keyof typeof input]}`);
            }
        }
        // 결과를 문자열로 변환하여 출력
        const ownResult = ownProperties.join('\n');
        const prototypeResult = prototypeProperties.join('\n');

        logMessages.push(`\n<<<<<객체 자체의 속성>>>>>>`);
        logMessages.push(ownResult);
        logMessages.push(`<<<<<프로토타입 체인상의 속성>>>>>>`);
        logMessages.push(prototypeResult);
        
        return logMessages.join('\n'); // 배열의 모든 메시지를 한 번에 출력
    }
    throw new Error('objectDigger는 인자로 객체만 받습니다. 인자에 전달된 값이 객체가 아닙니다.');
}

export const objectDeepDigger = (input) => {
    const getAllProperties = (obj) => {
        const properties = new Set();
        let currentObj = obj;

        do {
            Object.getOwnPropertyNames(currentObj).forEach(name => properties.add(name));
        } while ((currentObj = Object.getPrototypeOf(currentObj)));

        return Array.from(properties);
    }

    const digObject = (obj) => {
        const properties = getAllProperties(obj);
        const output = {};
        properties.forEach(prop => {
            if (typeof prop === 'string') {
                try {
                    const value = obj[prop];
                    if (typeof value === 'function') {
                        output[prop] = '[Function]';
                    } else if (typeof value === 'object' && value !== null) {
                        output[prop] = digObject(value);
                    } else {
                        output[prop] = value;
                    }
                } catch (error) {
                    output[prop] = '[Unable to access value]';
                }
            }
        });
        return output;
    }

    let result;
    if (typeof input === 'object' && input !== null) {
        result = digObject(input);
    } else {
        result = input;
    }

    return JSONColor.stringify(result, null, 2);
}