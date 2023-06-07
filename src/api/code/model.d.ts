declare namespace API {
    type RunCodeInput = {
        code: string;
        language: string;
        inputArray: number[];
        inputString: string;
    };
    type RunCodeOutput = {
        stderr: string;
        stdout: string;
        exitCode: number;
        signal: string;
        memoryUsage: string;
        cpuUsage: string;
    };
}
