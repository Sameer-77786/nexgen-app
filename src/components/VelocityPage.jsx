// src/components/VelocityPage.jsx
import React, { useEffect } from 'react';

export default function VelocityPage({ onBack }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://mynexgenmobile.com/wp-content/plugins/ar_form/assets/js/ar-forms.js'; // adjust if your plugin uses a different name
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <div className="p-4 bg-white h-full overflow-auto">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded shadow"
      >
        ← Back
      </button>

      <div
        className="ar-form-container"
        dangerouslySetInnerHTML={{
          __html: `
            <div class="ar-form">
              <!-- Your full AR Form HTML goes here -->
              <!-- If you're embedding via shortcode, render it server-side and paste the HTML here -->
              [velocity_form_embed]
            </div>
          `
        }}
      />
    </div>
  );
}
