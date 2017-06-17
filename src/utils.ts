export function includes<T>(arr: T[], target: T) {
    return arr.indexOf(target) >= 0;
}

export function identity<T>(v: T) {
    return v;
}
