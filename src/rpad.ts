export function rpad(text: string, len: number): string {
    let t = text;

    if (t.length > len) {
        t = `${text.substr(0, len - 3)}...`;
    }

    return `${t}${new Array(len - t.length + 1).join(' ')}`;
}
