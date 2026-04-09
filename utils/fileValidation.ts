import { z } from 'zod';

/**
 * Zod schema untuk single file upload
 * @param options - Options untuk validasi file
 * @param options.required - Apakah file wajib diisi
 * @param options.maxSize - Maksimal ukuran file dalam bytes (default: 5MB)
 * @param options.acceptedTypes - Array mime types yang diterima
 */
export const createFileSchema = (options?: {
	required?: boolean;
	maxSize?: number;
	acceptedTypes?: string[];
}) => {
	const { required = true, maxSize = 5000000, acceptedTypes } = options || {};

	const baseSchema = z
		.instanceof(File, { message: 'File is required' })
		.refine((file) => !file || file.size !== 0, {
			message: 'File is required',
		})
		.refine((file) => !file || file.size <= maxSize, {
			message: `Max size is ${Math.round(maxSize / 1000000)}MB`,
		});

	const withTypeValidation =
		acceptedTypes && acceptedTypes.length > 0
			? baseSchema.refine(
					(file) => !file || acceptedTypes.includes(file.type),
					{
						message: `File type must be ${acceptedTypes.join(', ')}`,
					}
				)
			: baseSchema;

	return required ? withTypeValidation : withTypeValidation.optional();
};

/**
 * Zod schema untuk multiple file upload
 * @param options - Options untuk validasi file
 * @param options.required - Apakah file wajib diisi
 * @param options.minFiles - Minimal jumlah file
 * @param options.maxFiles - Maksimal jumlah file
 * @param options.maxSize - Maksimal ukuran per file dalam bytes (default: 5MB)
 * @param options.acceptedTypes - Array mime types yang diterima
 */
export const createFileArraySchema = (options?: {
	required?: boolean;
	minFiles?: number;
	maxFiles?: number;
	maxSize?: number;
	acceptedTypes?: string[];
}) => {
	const {
		required = false,
		minFiles = 0,
		maxFiles = 5,
		maxSize = 5000000,
		acceptedTypes,
	} = options || {};

	const baseSchema = z.array(z.instanceof(File));

	const withMinMax =
		minFiles > 0
			? maxFiles > 0
				? baseSchema
						.min(minFiles, {
							message: `Minimal ${minFiles} file${minFiles > 1 ? 's' : ''}`,
						})
						.max(maxFiles, {
							message: `Maksimal ${maxFiles} file${maxFiles > 1 ? 's' : ''}`,
						})
				: baseSchema.min(minFiles, {
						message: `Minimal ${minFiles} file${minFiles > 1 ? 's' : ''}`,
					})
			: maxFiles > 0
				? baseSchema.max(maxFiles, {
						message: `Maksimal ${maxFiles} file${maxFiles > 1 ? 's' : ''}`,
					})
				: baseSchema;

	const withSizeValidation = withMinMax.refine(
		(files) => files.every((file) => file.size <= maxSize),
		{
			message: `Max size per file is ${Math.round(maxSize / 1000000)}MB`,
		}
	);

	const withTypeValidation =
		acceptedTypes && acceptedTypes.length > 0
			? withSizeValidation.refine(
					(files) => files.every((file) => acceptedTypes.includes(file.type)),
					{
						message: `File type must be ${acceptedTypes.join(', ')}`,
					}
				)
			: withSizeValidation;

	return required && minFiles > 0
		? withTypeValidation
		: withTypeValidation.optional();
};

/**
 * Zod schema untuk file yang bisa berupa File baru atau string (existing file URL)
 */
export const createFileOrUrlSchema = (options?: {
	required?: boolean;
	maxSize?: number;
	acceptedTypes?: string[];
}) => {
	const { required = true, maxSize = 5000000, acceptedTypes } = options || {};

	const fileSchema = z
		.instanceof(File)
		.refine((file) => file.size !== 0, {
			message: 'File is required',
		})
		.refine((file) => file.size <= maxSize, {
			message: `Max size is ${Math.round(maxSize / 1000000)}MB`,
		});

	const urlSchema = z.string().url('Invalid URL');

	const baseUnion = z.union([fileSchema, urlSchema]);

	const withTypeValidation =
		acceptedTypes && acceptedTypes.length > 0
			? baseUnion.refine(
					(value) => {
						if (typeof value === 'string') return true;
						return acceptedTypes.includes(value.type);
					},
					{
						message: `File type must be ${acceptedTypes.join(', ')}`,
					}
				)
			: baseUnion;

	const withRequiredValidation = withTypeValidation.refine(
		(value) => value instanceof File || typeof value === 'string',
		{
			message: 'File or URL is required',
		}
	);

	return required ? withRequiredValidation : withRequiredValidation.optional();
};
