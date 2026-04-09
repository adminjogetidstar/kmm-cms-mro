import { type ChangeEvent, useState, useEffect, useId } from 'react';
import { X } from '@phosphor-icons/react';
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from 'react-hook-form';
import imageCompression from 'browser-image-compression';
import { cn } from '@shared/utils';
import { useBool } from '@shared/hooks/useBool';
import { useIsMobile } from '@shared/hooks/useIsMobile';
import { Modal } from '@shared/components';

type FileInputMode = 'camera' | 'file' | 'both';

const compressImage = async (file: File, quality: number): Promise<File> => {
	if (quality <= 0 || quality >= 1 || !file.type.startsWith('image/')) {
		return file;
	}

	try {
		const compressedFile = await imageCompression(file, {
			initialQuality: quality,
			useWebWorker: true,
			preserveExif: true,
		});
		return new File([compressedFile], file.name, {
			type: compressedFile.type,
			lastModified: Date.now(),
		});
	} catch {
		return file;
	}
};

interface BaseFileInputProps {
	label?: string;
	maxFiles?: number;
	disabled?: boolean;
	accept?: string;
	capture?: 'user' | 'environment';
	onError?: (error: string) => void;
	mode?: FileInputMode;
	quality?: number; // 0-1, default 1 (no compression)
	debug?: boolean; // Show both original and compressed preview
}

interface ControlledFileInputProps<
	T extends FieldValues,
> extends BaseFileInputProps {
	control: Control<T>;
	name: Path<T>;
}

interface UncontrolledFileInputProps extends BaseFileInputProps {
	name: string;
	error?: string;
	defaultValue?: File[];
	onChange?: (files: File[]) => void;
	control?: never;
}

type FileInputProps<T extends FieldValues = FieldValues> =
	| ControlledFileInputProps<T>
	| UncontrolledFileInputProps;

type DebugPreview = {
	original: { url: string; size: number };
	compressed: { url: string; size: number };
};

function FileInputInner({
	name,
	label = 'Upload File',
	maxFiles = 5,
	disabled = false,
	error,
	accept = 'image/*',
	capture = 'environment',
	mode = 'both',
	quality = 0.7,
	debug = false,
	value = [],
	onChange,
	onError,
}: {
	name: string;
	label?: string;
	maxFiles?: number;
	disabled?: boolean;
	error?: string;
	accept?: string;
	capture?: 'user' | 'environment';
	mode?: FileInputMode;
	quality?: number;
	debug?: boolean;
	value?: File[];
	onChange?: (files: File[]) => void;
	onError?: (error: string) => void;
}) {
	const cameraInputId = useId();
	const fileInputId = useId();
	const [previews, setPreviews] = useState<string[]>([]);
	const [debugPreviews, setDebugPreviews] = useState<DebugPreview[]>([]);
	const modal = useBool();
	const isMobile = useIsMobile();

	useEffect(() => {
		// Generate previews when files change
		const newPreviews: string[] = [];
		let loadedCount = 0;

		if (value.length === 0) {
			setPreviews([]);
			return;
		}

		value.forEach((file) => {
			const reader = new FileReader();
			reader.onload = (event) => {
				newPreviews.push(event.target?.result as string);
				loadedCount++;
				if (loadedCount === value.length) {
					setPreviews(newPreviews);
				}
			};
			reader.readAsDataURL(file);
		});
	}, [value]);

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || []);

		// Validate max files
		if (value.length + selectedFiles.length > maxFiles) {
			const errorMsg = `Maksimal ${maxFiles} foto`;
			onError?.(errorMsg);
			return;
		}

		// Compress files if quality < 1
		const processedFiles = await Promise.all(
			selectedFiles.map((file) => compressImage(file, quality))
		);

		// Generate debug previews if debug mode is enabled
		if (debug) {
			const newDebugPreviews = await Promise.all(
				selectedFiles.map(async (originalFile, index) => {
					const compressedFile = processedFiles[index];
					const [originalUrl, compressedUrl] = await Promise.all([
						new Promise<string>((resolve) => {
							const reader = new FileReader();
							reader.onload = (e) => resolve(e.target?.result as string);
							reader.readAsDataURL(originalFile);
						}),
						new Promise<string>((resolve) => {
							const reader = new FileReader();
							reader.onload = (e) => resolve(e.target?.result as string);
							reader.readAsDataURL(compressedFile);
						}),
					]);
					return {
						original: { url: originalUrl, size: originalFile.size },
						compressed: { url: compressedUrl, size: compressedFile.size },
					};
				})
			);
			setDebugPreviews((prev) => [...prev, ...newDebugPreviews]);
		}

		const newFiles = [...value, ...processedFiles];
		onChange?.(newFiles);

		// Reset input
		e.target.value = '';
	};

	const removeFile = (index: number) => {
		const newFiles = value.filter((_, i) => i !== index);
		onChange?.(newFiles);
		if (debug) {
			setDebugPreviews((prev) => prev.filter((_, i) => i !== index));
		}
	};

	const formatSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	const handleMainClick = () => {
		if (disabled) return;

		// Di desktop, camera dan both mode jadi file picker
		if (!isMobile && (mode === 'camera' || mode === 'both')) {
			document.getElementById(fileInputId)?.click();
			return;
		}

		if (mode === 'both') {
			modal.setTrue();
		} else if (mode === 'camera') {
			document.getElementById(cameraInputId)?.click();
		} else {
			document.getElementById(fileInputId)?.click();
		}
	};

	const handleSelectCamera = () => {
		modal.setFalse();
		setTimeout(() => {
			document.getElementById(cameraInputId)?.click();
		}, 100);
	};

	const handleSelectFile = () => {
		modal.setFalse();
		setTimeout(() => {
			document.getElementById(fileInputId)?.click();
		}, 100);
	};

	return (
		<div>
			{label && (
				<label className="block text-sm font-medium text-gray-700 mb-2">
					{label}
				</label>
			)}

			<div
				onClick={handleMainClick}
				className={cn(
					'border-2 border-dashed border-[#8FD8D2] rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors',
					disabled && 'opacity-50 cursor-not-allowed',
					error && 'border-red-500'
				)}
			>
				<div className="text-3xl mb-2">📷</div>
				<div className="text-sm font-medium text-gray-700">
					Ambil/Upload Foto
				</div>
				<div className="text-xs text-gray-500 mt-1">
					{value.length}/{maxFiles} foto dipilih
				</div>
			</div>

			{/* Hidden inputs */}
			<input
				id={cameraInputId}
				name={name}
				type="file"
				accept={accept}
				capture={capture}
				multiple={maxFiles > 1}
				disabled={disabled || value.length >= maxFiles}
				onChange={handleFileChange}
				className="hidden"
			/>
			<input
				id={fileInputId}
				name={name}
				type="file"
				accept={accept}
				multiple={maxFiles > 1}
				disabled={disabled || value.length >= maxFiles}
				onChange={handleFileChange}
				className="hidden"
			/>

			{/* Modal for selection */}
			<Modal {...modal} title="Pilih Sumber">
				<div className="space-y-3">
					<button
						type="button"
						onClick={handleSelectCamera}
						className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#8FD8D2] hover:bg-gray-50 transition-colors"
					>
						<div className="text-2xl">📷</div>
						<div className="text-left">
							<div className="font-medium">Kamera</div>
							<div className="text-sm text-gray-500">Ambil foto langsung</div>
						</div>
					</button>
					<button
						type="button"
						onClick={handleSelectFile}
						className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#8FD8D2] hover:bg-gray-50 transition-colors"
					>
						<div className="text-2xl">📁</div>
						<div className="text-left">
							<div className="font-medium">Pilih File</div>
							<div className="text-sm text-gray-500">
								Upload dari galeri/file
							</div>
						</div>
					</button>
				</div>
			</Modal>

			{error && <p className="mt-1 text-sm text-red-500">{error}</p>}

			{/* Debug Preview - Shows both original and compressed */}
			{debug && debugPreviews.length > 0 && (
				<div className="mt-4 space-y-4">
					{debugPreviews.map((item, index) => {
						const reduction = (
							((item.original.size - item.compressed.size) /
								item.original.size) *
							100
						).toFixed(1);
						return (
							<div
								key={index}
								className="border border-gray-200 rounded-lg p-3"
							>
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm font-medium">Image {index + 1}</span>
									<button
										type="button"
										onClick={() => removeFile(index)}
										disabled={disabled}
										className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
									>
										<X size={14} weight="bold" />
									</button>
								</div>
								<div className="grid grid-cols-2 gap-3">
									{/* Original */}
									<div>
										<img
											src={item.original.url}
											alt={`Original ${index + 1}`}
											className="w-full aspect-square object-cover rounded-lg"
										/>
										<div className="mt-1 text-xs text-center text-gray-600">
											<div className="font-medium">Original</div>
											<div>{formatSize(item.original.size)}</div>
										</div>
									</div>
									{/* Compressed */}
									<div>
										<img
											src={item.compressed.url}
											alt={`Compressed ${index + 1}`}
											className="w-full aspect-square object-cover rounded-lg"
										/>
										<div className="mt-1 text-xs text-center text-gray-600">
											<div className="font-medium">
												Compressed ({(quality * 100).toFixed(0)}%)
											</div>
											<div>
												{formatSize(item.compressed.size)}{' '}
												<span className="text-green-600">(-{reduction}%)</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Normal Preview - Only compressed */}
			{!debug && previews.length > 0 && (
				<div className="mt-4 grid grid-cols-2 gap-3">
					{previews.map((preview, index) => (
						<div key={index} className="relative">
							<img
								src={preview}
								alt={`Preview ${index + 1}`}
								className="w-full aspect-square object-cover rounded-lg shadow-md"
							/>
							<button
								type="button"
								onClick={() => removeFile(index)}
								disabled={disabled}
								className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
							>
								<X size={16} weight="bold" />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export function FileInput<T extends FieldValues = FieldValues>(
	props: FileInputProps<T>
) {
	// Controlled with React Hook Form
	if ('control' in props && props.control) {
		return (
			<Controller
				control={props.control}
				name={props.name}
				render={({ field, fieldState }) => (
					<FileInputInner
						{...props}
						name={props.name}
						value={field.value || []}
						onChange={field.onChange}
						error={fieldState.error?.message}
					/>
				)}
			/>
		);
	}

	// Uncontrolled
	const uncontrolledProps = props as UncontrolledFileInputProps;
	return (
		<FileInputInner
			{...uncontrolledProps}
			value={uncontrolledProps.defaultValue}
			onChange={uncontrolledProps.onChange}
		/>
	);
}
