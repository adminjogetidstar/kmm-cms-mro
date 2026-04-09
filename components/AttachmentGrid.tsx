import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import React, { useState } from 'react';

interface AttachmentGridProps {
	title: string;
	attachments: (string | null)[];
}

const AttachmentGrid: React.FC<AttachmentGridProps> = ({
	title,
	attachments,
}) => {
	const [previewIndex, setPreviewIndex] = useState<number | null>(null);

	const validAttachments = attachments.filter((a): a is string => a !== null);
	const isPreviewOpen = previewIndex !== null;

	const handleOpenPreview = (attachment: string | null) => {
		if (!attachment) return;
		const index = validAttachments.indexOf(attachment);
		if (index !== -1) {
			setPreviewIndex(index);
		}
	};

	const handleClose = () => {
		setPreviewIndex(null);
	};

	const handlePrev = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (previewIndex !== null && previewIndex > 0) {
			setPreviewIndex(previewIndex - 1);
		}
	};

	const handleNext = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (previewIndex !== null && previewIndex < validAttachments.length - 1) {
			setPreviewIndex(previewIndex + 1);
		}
	};

	return (
		<div className="mt-6">
			<h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
			<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
				{attachments.map((attachment, index) => (
					<div
						key={`${title}-${index}`}
						onClick={() => handleOpenPreview(attachment)}
						className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
					>
						{attachment ? (
							<img
								src={attachment}
								alt={`${title} ${index + 1}`}
								className="w-full h-full object-cover rounded-lg"
							/>
						) : (
							<svg
								className="w-8 h-8 text-gray-400"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
									clipRule="evenodd"
								/>
							</svg>
						)}
					</div>
				))}
			</div>

			{/* Preview Modal */}
			{isPreviewOpen && previewIndex !== null && (
				<div
					className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/50"
					onClick={handleClose}
				>
					{/* Close Button */}
					<button
						onClick={handleClose}
						className="absolute top-4 right-4 z-10 p-2 text-white transition-all hover:scale-110"
					>
						<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
							<path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
						</svg>
					</button>

					{/* Previous Button */}
					{previewIndex > 0 && (
						<button
							onClick={handlePrev}
							className="absolute left-4 z-10 p-2 text-white transition-all hover:scale-110"
						>
							<CaretLeftIcon className="text-3xl" weight="bold" />
						</button>
					)}

					{/* Image */}
					<div
						onClick={(e) => e.stopPropagation()}
						className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
					>
						<img
							src={validAttachments[previewIndex]}
							alt={`Preview ${previewIndex + 1}`}
							className="max-w-full max-h-[90vh] shadow-2xl object-contain rounded-lg"
						/>
					</div>

					{/* Next Button */}
					{previewIndex < validAttachments.length - 1 && (
						<button
							onClick={handleNext}
							className="absolute right-4 z-10 p-2 text-white transition-all hover:scale-110"
						>
							<CaretRightIcon className="text-3xl" weight="bold" />
						</button>
					)}

					{/* Image Counter */}
					<div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm">
						{previewIndex + 1} / {validAttachments.length}
					</div>
				</div>
			)}
		</div>
	);
};

export default AttachmentGrid;
