export function decodeToken(token) {

    const [, payload] = token.split('.');

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);

    const json = new TextDecoder().decode(
        Uint8Array.from(atob(padded), char => char.charCodeAt(0))
    );

    const claims = JSON.parse(json);

    return {
        id: claims.sub,
        email: claims.email,
        username: claims.username,
        roles: [].concat(claims.role ?? []),
    };
}