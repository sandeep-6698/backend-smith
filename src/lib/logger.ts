// import chalk from "chalk";

const info = (message: string) => {
    console.log(message)
}

const error = (message: string) => {
    console.error(message)
}

const warn = (message: string) => {
    console.warn(message)
}

const logger = {
    info, error, warn
}

export default logger;