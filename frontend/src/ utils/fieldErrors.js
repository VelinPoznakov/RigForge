export function toFieldErrors(messages = {}) {
    return Object.fromEntries(
        Object.entries(messages).map(([field, message]) => [field[0].toLowerCase() + field.slice(1), message])
    );
}
