import { exec } from 'child_process';

export const runCommandHelper = (command: string) => {
    return new Promise<boolean>((res, rej) => {
        exec(command, (error) => {
            if (error) {
                rej(error)
            }
            res(true)
        })
    })
}