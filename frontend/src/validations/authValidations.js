const emailPattern = /^[^@]+@[^@]+$/;

export function validateLogin({email, password}){
    if(!email || !password)
        return false;

    if(!emailPattern.test(email))
        return false;

    return true;

}