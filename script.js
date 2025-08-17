document.addEventListener('DOMContentLoaded', () => {
	const downloadBtn = document.querySelector('.downloadBtn');
	if (downloadBtn) {
		downloadBtn.addEventListener('click', async () => {
			// Load html2canvas if not present
			if (!window.html2canvas) {
				await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
			}

			// Load JSZip if not present
			if (!window.JSZip) {
				await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
			}

			const zip = new JSZip();
			const elements = document.querySelectorAll('.canvas');

			for (let i = 0; i < elements.length; i++) {
				const el = elements[i];
				const canvas = await html2canvas(el);

				// Convert canvas to base64 data (strip prefix)
				const dataUrl = canvas.toDataURL('image/png');
				const base64 = dataUrl.split(',')[1];

				// Add image to zip
				zip.file(`screenshot-${i + 1}.png`, base64, { base64: true });
			}

			// Generate zip as blob
			const content = await zip.generateAsync({ type: 'blob' });

			// Derive filename from HTML file
			let filename = window.location.pathname.split('/').pop() || 'download.html';
			filename = filename.replace(/\.[^/.]+$/, ''); // remove extension
			filename = filename + '.zip';

			// Trigger browser download without FileSaver
			const url = URL.createObjectURL(content);
			const link = document.createElement('a');
			link.href = url;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		});
	}
});