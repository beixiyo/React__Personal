import call from "./call.js";

export default function (duration) {
    return call(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, duration);
        })
    })
}