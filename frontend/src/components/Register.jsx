import {useEffect} from "react";
import {Link, Navigate} from "react-router";
import {protectedRoutes, publicRoutes} from "../ utils/ApplicationUrlPaths.js";
import {toFieldErrors} from "../ utils/fieldErrors.js";
import {validateRegister} from "../validations/authValidations.js";
import useAuth from "../hooks/useAuth.js";
import useForm from "../hooks/useForm.js";
import Spinner from "./Loading.jsx";

const initialValues = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
};

const inputBaseClass = "w-full rounded-md border bg-field px-3 py-2.5 text-sm text-ink transition placeholder:text-ink-dim focus:ring-3 focus:outline-none";

export default function Register(){

    const {isAuthenticated, register, errors: serverErrors, loading: isLoading, clearErrors} = useAuth();
    const {values, changeHandler, blurHandler, errors, touched, touchAll, isValid} = useForm(initialValues, validateRegister);

    useEffect(() => {
        clearErrors();
    }, []);

    if(isAuthenticated)
        return <Navigate to={protectedRoutes.profile} replace />;

    if(isLoading)
        return <Spinner />;

    const serverFieldErrors = toFieldErrors(serverErrors?.messages);

    const fieldError = (field) => (touched[field] && errors[field]) || serverFieldErrors[field];

    const inputClass = (field) => `${inputBaseClass} ${fieldError(field)
        ? 'border-danger focus:ring-danger/15'
        : 'border-line-strong focus:border-accent focus:ring-accent/15'}`;

    const errorText = (field) => fieldError(field) && (
        <span className="text-xs text-danger">{fieldError(field)}</span>
    );

    const formError = serverErrors && (serverErrors.isInternalError
        ? 'Could not reach the server. Check your connection and try again.'
        : serverErrors.general ?? (Object.keys(serverFieldErrors).length === 0 ? 'Something went wrong. Please try again.' : null));

    const submitHandler = async (e) => {
        e.preventDefault();
        touchAll();

        if(!isValid)
            return;

        await register({
            email: values.email.trim(),
            username: values.username.trim(),
            password: values.password,
            confirmPassword: values.confirmPassword,
        });
    }

    return(
        <main className="grid flex-1 place-items-center bg-[radial-gradient(ellipse_at_top,rgba(236,122,58,0.08),transparent_60%)] px-4 py-10 max-sm:items-start max-sm:pt-7">
            <div className="w-full max-w-105 rounded-[14px] border border-line bg-card px-5 py-6 sm:p-8">
                <div className="mb-6 text-center">
                    <span className="mb-3.5 inline-block size-3.5 rounded-[3px] bg-accent"></span>
                    <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
                    <p className="mt-1 text-sm text-ink-muted">Share your builds with the RigForge community.</p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={submitHandler} noValidate>
                    {formError && (
                        <div className="rounded-md border border-danger/35 bg-danger/10 px-3.5 py-2.5 text-sm text-[#ff8a87]" role="alert">{formError}</div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-ink-soft" htmlFor="email">Email</label>
                        <input className={inputClass('email')}
                               id="email"
                               name="email"
                               type="email"
                               autoComplete="email"
                               maxLength="120"
                               placeholder="you@example.com"
                               value={values.email}
                               onChange={changeHandler}
                               onBlur={blurHandler} />
                        {errorText('email')}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-ink-soft" htmlFor="username">Username</label>
                        <input className={inputClass('username')}
                               id="username"
                               name="username"
                               autoComplete="username"
                               maxLength="20"
                               placeholder="rigbuilder"
                               value={values.username}
                               onChange={changeHandler}
                               onBlur={blurHandler} />
                        {errorText('username') || <span className="text-xs text-ink-dim">3–20 characters: letters, digits, . _ -</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-ink-soft" htmlFor="password">Password</label>
                        <input className={inputClass('password')}
                               id="password"
                               name="password"
                               type="password"
                               autoComplete="new-password"
                               value={values.password}
                               onChange={changeHandler}
                               onBlur={blurHandler} />
                        {errorText('password') || <span className="text-xs text-ink-dim">At least 6 characters, including a number.</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-ink-soft" htmlFor="confirmPassword">Confirm password</label>
                        <input className={inputClass('confirmPassword')}
                               id="confirmPassword"
                               name="confirmPassword"
                               type="password"
                               autoComplete="new-password"
                               value={values.confirmPassword}
                               onChange={changeHandler}
                               onBlur={blurHandler} />
                        {errorText('confirmPassword')}
                    </div>

                    <button type="submit" className="inline-flex h-10.5 cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold whitespace-nowrap transition-colors bg-accent text-on-accent hover:bg-accent-hover mt-1 w-full">Create account</button>
                </form>

                <p className="mt-5 text-center text-sm text-ink-muted">Already have an account? <Link className="font-semibold text-accent" to={publicRoutes.login}>Log in</Link></p>
            </div>
        </main>
    );
}
