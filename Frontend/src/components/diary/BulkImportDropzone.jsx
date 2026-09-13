import React, { useState } from 'react';

const BulkImportDropzone = () => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div 
      className={`w-full p-8 rounded-2xl border-2 border-dashed transition-colors flex flex-col items-center justify-center text-center ${
        isDragging ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/50 bg-surface-container-low/50'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
    >
      <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px] text-on-surface-variant">upload_file</span>
      </div>
      <h3 className="font-title-md text-title-md text-on-surface font-semibold mb-1">Bulk Import Diary</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mb-6">
        Drag and drop a PDF export of your food diary to automatically import past entries using AI.
      </p>
      <button className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/60 font-title-md text-body-md text-on-surface hover:bg-surface-container-low transition-colors shadow-sm">
        Browse Files
      </button>
    </div>
  );
};

export default BulkImportDropzone;
