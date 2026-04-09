import React from 'react';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import { marked } from 'marked';
import {
	MDXEditor,
	headingsPlugin,
	listsPlugin,
	linkPlugin,
	linkDialogPlugin,
	quotePlugin,
	thematicBreakPlugin,
	markdownShortcutPlugin,
	toolbarPlugin,
	UndoRedo,
	BoldItalicUnderlineToggles,
	ListsToggle,
	CreateLink,
	type MDXEditorMethods,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

marked.use({
	gfm: true, // Enable GitHub Flavored Markdown (includes task lists)
	renderer: {
		link({ href, title, text }) {
			const titleAttr = title ? ` title="${title}"` : '';
			return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${text}</a>`;
		},
		listitem({ text, task, checked }) {
			if (task) {
				const checkbox = checked
					? '<input type="checkbox" checked disabled class="mr-2 align-middle" />'
					: '<input type="checkbox" disabled class="mr-2 align-middle" />';
				return `<li class="list-none flex !-ml-4">${checkbox}<span class="flex-1">${text}</span></li>`;
			}
			return `<li>${text}</li>`;
		},
	},
});

const parseMarkdown = (markdown: string): string => {
	if (!markdown) return '';
	return marked.parse(markdown) as string;
};

const editorStyles = `
	.mdxeditor a,
	.mdxeditor [data-lexical-decorator="true"] a,
	.mdxeditor-root-contenteditable a {
		color: #2563eb !important;
		text-decoration: underline !important;
	}

	.mdxeditor-root-contenteditable ul {
		list-style-type: disc;
		padding-left: 1.25rem;
	}

	.mdxeditor-root-contenteditable ol {
		list-style-type: decimal;
		padding-left: 1.25rem;
	}

	.mdxeditor-root-contenteditable li {
		margin-top: 0.25rem;
	}
`;

interface MDXTextareaProps {
	value?: string;
	name?: string;
	label?: string;
	error?: string;
	disabled?: boolean;
	readOnly?: boolean;
	placeholder?: string;
	maxLength?: number;
	rows?: number;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
	asHtml?: boolean;
}

const MDXTextareaEditor = React.forwardRef<MDXEditorMethods, MDXTextareaProps>(
	function MDXTextarea(
		{
			value,
			name = 'localName',
			label,
			error,
			disabled = false,
			readOnly = false,
			placeholder,
			maxLength = 200,
			rows = 4,
			onChange,
			onBlur,
		},
		ref
	) {
		// Calculate height based on rows (1 row = 24px)
		const minHeight = `${2 * 25 + (readOnly ? 0 : 36)}px`;
		const maxHeight = `${rows * 25 + (readOnly ? 0 : 36)}px`;
		// Editor mode: form integration
		const localForm = useForm({ defaultValues: { localName: value } });
		const rootForm = useFormContext();
		const form = rootForm || localForm;
		const formError = name
			? (form.formState.errors[name]?.message as string)
			: undefined;

		const errorText = error || formError;
		const fieldValue = useWatch({
			name,
			control: form.control,
			disabled: !name || !form,
		});
		const isReadOnly = readOnly;

		const containerRef = React.useRef<HTMLDivElement>(null);

		const createEvent = (eventValue: string, type: 'change' | 'blur') =>
			({ target: { name, value: eventValue }, type }) as
				| React.ChangeEvent<HTMLInputElement>
				| React.FocusEvent<HTMLInputElement>;

		const handleChange = (newValue: string) => {
			// Check maxLength and set error if exceeded
			if (maxLength && newValue.length > maxLength && name) {
				form.setError(name, {
					type: 'manual',
					message: `Maximum ${maxLength} characters allowed`,
				});
			} else if (name) {
				// Clear error if within limit
				form.clearErrors(name);
			}

			onChange?.(
				createEvent(newValue, 'change') as React.ChangeEvent<HTMLInputElement>
			);
		};

		const handleBlur = () => {
			onBlur?.(
				createEvent(fieldValue, 'blur') as React.FocusEvent<HTMLInputElement>
			);
		};

		React.useEffect(() => {
			if (!containerRef.current) return;
			containerRef.current.querySelectorAll('.mdxeditor a').forEach((link) => {
				link.setAttribute('target', '_blank');
				link.setAttribute('rel', 'noopener noreferrer');
			});
		}, [fieldValue]);

		return (
			<div className="mb-4" ref={containerRef}>
				<style>{editorStyles}</style>
				{label && (
					<label className="block mb-2 text-sm font-medium text-gray-700">
						{label}
					</label>
				)}
				<div
					style={{ minHeight, maxHeight }}
					className={`w-full border rounded-lg transition-colors duration-300 focus-within:border-primary overflow-hidden ${
						errorText ? 'border-red-500' : 'border-gray-300'
					} ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
				>
					<MDXEditor
						ref={ref}
						markdown={fieldValue || ''}
						onChange={handleChange}
						onBlur={handleBlur}
						readOnly={isReadOnly}
						placeholder={placeholder}
						contentEditableClassName={`prose prose-sm prose-a:text-blue-600 prose-a:underline max-w-none px-3 py-2 focus:outline-none`}
						plugins={[
							headingsPlugin(),
							listsPlugin(),
							linkPlugin(),
							linkDialogPlugin(),
							quotePlugin(),
							thematicBreakPlugin(),
							markdownShortcutPlugin(),
							!isReadOnly &&
								toolbarPlugin({
									toolbarContents: () => (
										<>
											<UndoRedo />
											<BoldItalicUnderlineToggles />
											<ListsToggle />
											<CreateLink />
										</>
									),
								}),
						].filter(Boolean)}
					/>
				</div>
				{maxLength && (
					<p className="mt-1 text-xs text-gray-500">
						{(fieldValue || '').length || 0}/{maxLength}
					</p>
				)}
				{errorText && <p className="mt-1 text-xs text-red-600">{errorText}</p>}
			</div>
		);
	}
);

const MDXTextarea = React.forwardRef<MDXEditorMethods, MDXTextareaProps>(
	(props, ref) => {
		const { asHtml, value } = props;

		if (asHtml) {
			return (
				<div
					dangerouslySetInnerHTML={{ __html: parseMarkdown(value || '') }}
					className="text-sm text-gray-700 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:mt-1"
				/>
			);
		}

		return <MDXTextareaEditor ref={ref} {...props} />;
	}
);

export default MDXTextarea;
