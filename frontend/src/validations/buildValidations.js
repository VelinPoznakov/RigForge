const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const imageMaxSize = 5 * 1024 * 1024;
const componentFields = ['cpu', 'gpu', 'ram', 'storage', 'psu'];

export function validateBuild(values, isImageRequired) {
    const errors = {};

    const title = values.title.trim();

    if (title.length < 5 || title.length > 60)
        errors.title = 'Title must be between 5 and 60 characters.';

    if (!values.purpose)
        errors.purpose = 'Choose what this build is for.';

    for (const field of componentFields) {
        const length = values[field].trim().length;

        if (length < 2 || length > 60)
            errors[field] = 'This field is required.';
    }

    const price = Number(values.priceEur);

    if (values.priceEur === '' || Number.isNaN(price) || price < 1 || price > 100000)
        errors.priceEur = 'Price must be between 1 and 100 000 €.';

    const description = values.description.trim();

    if (description.length < 20)
        errors.description = 'Description must be at least 20 characters.';
    else if (description.length > 800)
        errors.description = 'Description must be at most 800 characters.';

    if (!values.image && isImageRequired)
        errors.image = 'Upload an image of the build.';
    else if (values.image && (!imageTypes.includes(values.image.type) || values.image.size > imageMaxSize))
        errors.image = 'Image must be a JPG, PNG or WEBP file up to 5 MB.';

    return errors;
}
