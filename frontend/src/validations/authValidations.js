const emailPattern = /^[^@]+@[^@]+$/;

export function validateLogin({email, password}){
    if(!email || !password)
        return false;

    if(!emailPattern.test(email))
        return false;

    return true;

}

const usernamePattern = /^[a-zA-Z0-9._-]{3,20}$/;
const passwordPattern = /^(?=.*\d).{6,}$/;

export function validateRegister({email, username, password, confirmPassword}){
    const errors = {};

    if(!emailPattern.test(email.trim()) || email.trim().length > 120)
        errors.email = 'Enter a valid email address.';

    if(!usernamePattern.test(username.trim()))
        errors.username = 'Username must be 3–20 characters: letters, digits, . _ -';

    if(!passwordPattern.test(password))
        errors.password = 'Password must be at least 6 characters and contain a number.';

    if(!confirmPassword || confirmPassword !== password)
        errors.confirmPassword = 'Passwords do not match.';

    return errors;
}