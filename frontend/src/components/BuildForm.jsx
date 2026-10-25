import {useEffect, useMemo, useState} from "react";
import {Link, useNavigate, useParams} from "react-router";
import {mutate} from "../ utils/request.js";
import {protectedRoutes, publicRoutes} from "../ utils/ApplicationUrlPaths.js";
import {rigPurposes} from "../ utils/ApplicationConstants.js";
import {toFieldErrors} from "../ utils/fieldErrors.js";
import {validateBuild} from "../validations/buildValidations.js";
import useForm from "../hooks/useForm.js";
import Spinner from "./Loading.jsx";
import ErrorLoadingBuilds from "./ErrorLoadingBuilds.jsx";

const initialValues = {
    title: '',
    purpose: 'Gaming',
    cpu: '',
    gpu: '',
    ram: '',
    storage: '',
    psu: '',
    priceEur: '',
    description: '',
    image: null,
};

const buildPurposes = rigPurposes.filter(purpose => purpose.purpose);

const componentInputs = [
    {name: 'cpu', label: 'CPU', placeholder: 'Ryzen 7 5700X3D'},
    {name: 'gpu', label: 'GPU', placeholder: 'RTX 4060 Ti 8GB'},
    {name: 'ram', label: 'RAM', placeholder: '32GB DDR4-3600'},
    {name: 'storage', label: 'Storage', placeholder: '2TB NVMe Gen4'},
    {name: 'psu', label: 'PSU', placeholder: '750W 80+ Gold'},
];

const inputBaseClass = "w-full rounded-md border bg-field px-3 py-2.5 text-sm text-ink transition placeholder:text-ink-dim focus:ring-3 focus:outline-none";

const toFormValues = (build) => ({
    title: build.title,
    purpose: build.purpose,
    cpu: build.cpu,
    gpu: build.gpu,
    ram: build.ram,
    storage: build.storage,
    psu: build.psu,
    priceEur: String(build.priceEur),
    description: build.description,
    image: null,
});

export default function BuildForm({build = null, isLoading = false, loadErrors = null}){
    const {id} = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();

    const {values, changeHandler, blurHandler, errors, touched, touchAll, isValid} = useForm(
        build ? toFormValues(build) : initialValues,
        (formValues) => validateBuild(formValues, !isEdit)
    );

    const [serverErrors, setServerErrors] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentImageUrl = build ? `${import.meta.env.VITE_API_URL ?? ''}${build.imageUrl}` : null;

    const previewUrl = useMemo(() => values.image ? URL.createObjectURL(values.image) : null, [values.image]);

    useEffect(() => () => {
        if (previewUrl)
            URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

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

    const imageChangeHandler = (e) => {
        changeHandler(e);
        blurHandler(e);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        touchAll();

        if (!isValid)
            return;

        const formData = new FormData();

        for (const [field, value] of Object.entries(values)) {
            if (value !== null)
                formData.append(field, typeof value === 'string' ? value.trim() : value);
        }

        setIsSubmitting(true);
        setServerErrors(null);

        try {
            if (isEdit) {
                await mutate('PUT', `/api/builds/${id}`, formData, true);
                navigate(publicRoutes.buildDetails(id));
            }
            else {
                await mutate('POST', '/api/builds', formData, true);
                navigate(protectedRoutes.profile);
            }
        }
        catch (err) {
            setServerErrors(err);
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const photoUrl = previewUrl ?? currentImageUrl;

    return(
        <main className="flex-1 pt-7 pb-14 sm:pt-10 sm:pb-18">
            <div className="mx-auto w-full max-w-site px-4 sm:px-6">
                {isEdit && (
                    <Link className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink" to={publicRoutes.buildDetails(id)}>
                        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        Back to build
                    </Link>
                )}

                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                        <h1 className="text-[26px] leading-tight font-bold tracking-tight sm:text-[32px]">{isEdit ? 'Edit build' : 'Post a build'}</h1>
                        <p className="mt-1.5 text-sm text-ink-muted">
                            {isEdit
                                ? 'Changes are visible to everyone as soon as you save.'
                                : 'Share your rig with the community. All fields are required.'}
                        </p>
                    </div>
                </div>

                {isLoading && <Spinner />}

                <ErrorLoadingBuilds isLoading={isLoading} errors={loadErrors} title="Could not load the build" />

                {!isLoading && !loadErrors && (
                    <form className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]" onSubmit={submitHandler} noValidate>
                        <div className="flex flex-col gap-5 rounded-[14px] border border-line bg-card p-4.5 sm:p-6">
                            {formError && (
                                <div className="rounded-md border border-danger/35 bg-danger/10 px-3.5 py-2.5 text-sm text-[#ff8a87]" role="alert">{formError}</div>
                            )}

                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-baseline justify-between gap-3">
                                    <label className="text-[13px] font-semibold text-ink-soft" htmlFor="title">Title</label>
                                    <span className="font-mono text-[11px] text-ink-dim">{values.title.length} / 60</span>
                                </div>
                                <input className={inputClass('title')}
                                       id="title"
                                       name="title"
                                       maxLength="60"
                                       placeholder="Ryzen Workhorse"
                                       value={values.title}
                                       onChange={changeHandler}
                                       onBlur={blurHandler} />
                                {errorText('title')}
                            </div>

                            <fieldset className="flex flex-col">
                                <legend className="mb-2 text-[13px] font-semibold text-ink-soft">Purpose</legend>
                                <div className="flex flex-wrap gap-2">
                                    {buildPurposes.map(purpose =>
                                        <label key={purpose.key}>
                                            <input className="peer sr-only"
                                                   type="radio"
                                                   name="purpose"
                                                   value={purpose.purpose}
                                                   checked={values.purpose === purpose.purpose}
                                                   onChange={changeHandler} />
                                            <span className="inline-flex h-8 shrink-0 cursor-pointer items-center rounded-full border px-3.5 text-[13px] whitespace-nowrap transition-colors border-line-strong bg-field text-ink-soft hover:border-ink-dim peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">{purpose.value}</span>
                                        </label>
                                    )}
                                </div>
                                {errorText('purpose')}
                            </fieldset>

                            <p className="pt-1 font-mono text-[11px] tracking-widest text-ink-dim uppercase">Components</p>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {componentInputs.map(input =>
                                    <div key={input.name} className="flex flex-col gap-1.5">
                                        <label className="text-[13px] font-semibold text-ink-soft" htmlFor={input.name}>{input.label}</label>
                                        <input className={inputClass(input.name)}
                                               id={input.name}
                                               name={input.name}
                                               maxLength="60"
                                               placeholder={input.placeholder}
                                               value={values[input.name]}
                                               onChange={changeHandler}
                                               onBlur={blurHandler} />
                                        {errorText(input.name)}
                                    </div>
                                )}

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[13px] font-semibold text-ink-soft" htmlFor="priceEur">Price</label>
                                    <div className="relative">
                                        <input className={`${inputClass('priceEur')} pr-8 font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                                               id="priceEur"
                                               name="priceEur"
                                               type="number"
                                               min="1"
                                               max="100000"
                                               step="0.01"
                                               placeholder="1268.00"
                                               value={values.priceEur}
                                               onChange={changeHandler}
                                               onBlur={blurHandler} />
                                        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-sm text-ink-dim">€</span>
                                    </div>
                                    {errorText('priceEur') || <span className="text-xs text-ink-dim">Between 1 and 100 000 €</span>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-baseline justify-between gap-3">
                                    <label className="text-[13px] font-semibold text-ink-soft" htmlFor="description">Description</label>
                                    <span className="font-mono text-[11px] text-ink-dim">{values.description.length} / 800</span>
                                </div>
                                <textarea className={`${inputClass('description')} min-h-30 resize-y`}
                                          id="description"
                                          name="description"
                                          rows="6"
                                          maxLength="800"
                                          placeholder="What is it for, why these parts, how does it perform..."
                                          value={values.description}
                                          onChange={changeHandler}
                                          onBlur={blurHandler} />
                                {errorText('description') || <span className="text-xs text-ink-dim">At least 20 characters.</span>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 lg:sticky lg:top-22">
                            <div className="flex flex-col gap-3 rounded-[14px] border border-line bg-card p-4.5 sm:p-6">
                                <p className="text-[13px] font-semibold text-ink-soft">Photo</p>

                                {photoUrl ? (
                                    <label className={`relative flex aspect-4/3 cursor-pointer items-center justify-center overflow-hidden rounded-[10px] border transition-colors hover:border-accent bg-media bg-linear-135 from-gaming/80 to-transparent to-70% ${fieldError('image') ? 'border-danger' : 'border-line-strong'}`}>
                                        <input className="sr-only" type="file" name="image" accept=".jpg,.jpeg,.png,.webp" onChange={imageChangeHandler} />
                                        <img className="absolute inset-0 size-full object-cover" src={photoUrl} alt="" />
                                        <span className="relative rounded-full border border-white/15 bg-black/75 px-3 py-1.5 text-[13px] font-semibold">Change photo</span>
                                    </label>
                                ) : (
                                    <label className={`relative flex aspect-4/3 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[10px] border-[1.5px] border-dashed p-5 text-center transition-colors hover:border-accent ${fieldError('image') ? 'border-danger' : 'border-line-strong'}`}>
                                        <input className="sr-only" type="file" name="image" accept=".jpg,.jpeg,.png,.webp" onChange={imageChangeHandler} />
                                        <svg className="mb-1.5 size-7 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M5 20h14" /></svg>
                                        <span className="text-sm font-semibold">Click to upload a photo</span>
                                        <span className="text-xs text-ink-dim">JPG, PNG or WEBP, up to 5 MB</span>
                                    </label>
                                )}

                                {errorText('image') || (isEdit && <span className="text-xs text-ink-dim">Leave it as it is to keep the current photo.</span>)}
                            </div>

                            <div className="flex justify-end gap-2.5 max-sm:*:flex-1">
                                <Link className="inline-flex h-9.5 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold whitespace-nowrap transition-colors text-ink-soft hover:bg-field hover:text-ink"
                                      to={isEdit ? publicRoutes.buildDetails(id) : publicRoutes.home}>Cancel</Link>
                                <button type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex h-9.5 cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold whitespace-nowrap transition-colors bg-accent text-on-accent hover:bg-accent-hover disabled:pointer-events-none disabled:opacity-60">
                                    {isEdit
                                        ? (isSubmitting ? 'Saving...' : 'Save changes')
                                        : (isSubmitting ? 'Publishing...' : 'Publish build')}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </main>
    );
}
