import React from 'react';
import ImageUpload from '../components/ai/ImageUpload';

const AIScannerPage = () => {
  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <div>
        <h1 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">AI Food Scanner</h1>
        <p className="text-on-surface-variant font-body-md text-body-md">Log meals instantly using state-of-the-art vision models.</p>
      </div>

      <ImageUpload />
      
      <div className="mt-4 bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-[32px]">tips_and_updates</span>
        </div>
        <div>
          <h4 className="font-title-lg text-title-lg font-semibold text-on-surface mb-2">Pro Tips for Best Results</h4>
          <ul className="text-on-surface-variant text-body-md list-disc list-inside space-y-1">
            <li>Ensure good lighting without harsh shadows.</li>
            <li>Capture the entire plate or the full nutrition label clearly.</li>
            <li>If taking a photo of a barcode, ensure it is flat and clearly visible.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIScannerPage;
