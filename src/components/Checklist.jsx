// src/components/Checklist.jsx
import React, { useState, useEffect } from 'react';

export default function Checklist({ token, onBack }) {
  const [status, setStatus]         = useState(null);   // 'open' | 'close' | 'completed'
  const [subs, setSubs]             = useState([]);     // recent submissions
  const [formData, setFormData]     = useState(new FormData());
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage]       = useState(null);

  // Load status + history
  useEffect(() => {
    async function load() {
      try {
        const [st, resp] = await Promise.all([
          fetch('/wp-json/nexgen/v1/checklist-status', {
            headers: { Authorization: `Bearer ${token}` }
          }).then(r => r.json()),
          fetch('/wp-json/nexgen/v1/checklist-submissions', {
            headers: { Authorization: `Bearer ${token}` }
          }).then(r => r.json())
        ]);
        setStatus(st.state);
        setSubs(resp.submissions || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  // Handle field changes
  const handleChange = e => {
    const { name, type, checked, files, value } = e.target;
    if (type === 'file')       formData.set(name, files[0]);
    else if (type === 'checkbox') formData.set(name, checked ? '1' : '');
    else                         formData.set(name, value);
    setFormData(formData);
  };

  // Submit form
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    formData.set('submission_type', status);
    formData.set('nonce', window.wp_ajax_nonce);

    try {
      const res = await fetch('/wp-json/nexgen/v1/checklist', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Submission failed');
      setMessage({ type: 'success', text: data.message || 'Submitted!' });

      // Refresh status & history
      const [st, resp] = await Promise.all([
        fetch('/wp-json/nexgen/v1/checklist-status', {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()),
        fetch('/wp-json/nexgen/v1/checklist-submissions', {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json())
      ]);
      setStatus(st.state);
      setSubs(resp.submissions || []);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (status === 'completed') {
    return (
      <div className="h-screen p-6 bg-white flex flex-col">
        <button onClick={onBack} className="mb-4 text-blue-600">← Back</button>
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          ✅ Checklist Completed for Today
        </h1>
        <p>Come back tomorrow when it resets.</p>
      </div>
    );
  }

  // Field definitions
  const openFields = [
    { name: 'unlock_doors_lights',    label: 'Unlock Doors, Turn on Lights',           type: 'checkbox' },
    { name: 'tablet_drawer',          label: 'Take Tablet Out and Open Drawer',         type: 'checkbox' },
    { name: 'open_sign_aframe',       label: 'Turn on Open Sign and Put A-Frame Out',   type: 'checkbox' },
    { name: 'open_sign_aframe_photo', label: 'A-Frame Photo (Take Now)',                type: 'file', capture: true },
    { name: 'apple_display',          label: 'Mount the Apple Display and Plug in Chargers', type: 'checkbox' },
    { name: 'apple_table_photo',      label: 'Apple Table Photo (Take Now)',             type: 'file', capture: true },
    { name: 'android_table_photo',    label: 'Android Table Photo (Take Now)',           type: 'file', capture: true },
    { name: 'phone_inventory',        label: 'Check Phone Inventory',                    type: 'checkbox' },
    { name: 'phone_inventory_photo',  label: 'Phone Inventory Photo',                    type: 'file', capture: true },
    { name: 'whiteboard_goals',       label: 'Update Whiteboard with Goals',             type: 'checkbox' },
    { name: 'whiteboard_goals_photo', label: 'Whiteboard Photo (Take Now)',              type: 'file', capture: true },
    { name: 'clean_store',            label: 'Clean the Store (make it spotless)',        type: 'checkbox' },
    { name: 'dust_accessories',       label: 'Dust Accessories',                         type: 'checkbox' },
    { name: 'acc_wall_photo',         label: 'Accessory Wall Photo (Take Now)',           type: 'file', capture: true },
    { name: 'notes',                  label: 'Additional Notes (optional)',               type: 'textarea' },
  ];
  const closeFields = [
    { name: 'aframe_sign_off',         label: 'Bring A-Frame In and Turn Open Sign Off', type: 'checkbox' },
    { name: 'aframe_sign_off_photo',   label: 'A-Frame Photo (Take Now)',                type: 'file', capture: true },
    { name: 'iphones_unplug',          label: 'Put iPhones Away and Unplug Chargers',    type: 'checkbox' },
    { name: 'apple_table_close_photo', label: 'Apple Table Photo (Optional)',            type: 'file', capture: true },
    { name: 'android_table_close_photo', label: 'Android Table Photo (Optional)',        type: 'file', capture: true },
    { name: 'clean_everything',        label: 'Clean Everything (tables, vacuum, etc.)',  type: 'checkbox' },
    { name: 'acc_wall_close_photo',    label: 'Accessory Wall Photo (Optional)',          type: 'file', capture: true },
    { name: 'windows_photo',           label: 'Windows Photo (Optional)',                 type: 'file', capture: true },
    { name: 'close_drawer',            label: 'Close Drawer and Store',                  type: 'checkbox' },
    { name: 'envelope_receipt_photo',  label: 'Envelope w/ Receipt Photo (Take Now)',     type: 'file', capture: true },
    { name: 'cash_amount',             label: 'Cash Amount for the Day',                 type: 'number', step: '0.01' },
    { name: 'credit_amount',           label: 'Credit Amount for the Day',               type: 'number', step: '0.01' },
    { name: 'inventory_sales',         label: 'Write Out Inventory and Sales',            type: 'checkbox' },
    { name: 'inventory_sales_photo',   label: 'Inventory Sales Photo (Optional)',         type: 'file', capture: true },
    { name: 'trash',                   label: 'Throw Trash Away',                         type: 'checkbox' },
    { name: 'tablet_cabinet',          label: 'Lock Tablet in Cabinet Drawer',            type: 'checkbox' },
    { name: 'gates_down',              label: 'Bring Gates Down',                         type: 'checkbox' },
    { name: 'alarm_lights',            label: 'Alarm Store & Turn Lights Off',            type: 'checkbox' },
    { name: 'lock_up',                 label: 'Lock Up and Enjoy',                        type: 'checkbox' },
    { name: 'notes',                   label: 'Additional Notes (optional)',               type: 'textarea' },
  ];
  const fields = status === 'open' ? openFields : closeFields;

  return (
    <div className="h-screen p-4 bg-white flex flex-col">
      <button onClick={onBack} className="mb-4 text-blue-600">← Back</button>
      <h1 className={`text-2xl font-bold mb-4 text-center ${status==='open'?'text-teal-600':'text-orange-500'}`}>
        {status==='open' ? '📋 Open Checklist' : '📋 Close Checklist'}
      </h1>

      {message && (
        <div className={`mb-4 p-2 rounded ${
          message.type==='success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto flex-1">
        {fields.map(f => (
          <div key={f.name}>
            {f.type === 'checkbox' && (
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name={f.name}
                  onChange={handleChange}
                  className={`form-checkbox h-5 w-5 ${
                    status==='open' ? 'text-teal-600' : 'text-orange-500'
                  }`}
                  required
                />
                <span className="ml-2 text-gray-700">{f.label}</span>
              </label>
            )}
            {f.type === 'file' && (
              <>
                <label className="block text-gray-700 font-medium">{f.label}</label>
                <input
                  type="file"
                  name={f.name}
                  accept="image/*"
                  capture="environment"
                  onChange={handleChange}
                  required={status==='open'}
                  className="block w-full mt-1"
                />
              </>
            )}
            {f.type === 'textarea' && (
              <>
                <label className="block text-gray-700 font-medium">{f.label}</label>
                <textarea
                  name={f.name}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border rounded p-2 mt-1"
                />
              </>
            )}
            {f.type === 'number' && (
              <>
                <label className="block text-gray-700 font-medium">{f.label}</label>
                <input
                  type="number"
                  name={f.name}
                  step={f.step}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2 mt-1"
                />
              </>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 rounded text-white ${
            status==='open'
              ? (submitting ? 'bg-teal-300'   : 'bg-teal-600 hover:bg-teal-700')
              : (submitting ? 'bg-orange-300' : 'bg-orange-500 hover:bg-orange-600')
          } transition`}
        >
          {submitting
            ? 'Submitting…'
            : (status === 'open' ? 'Submit Open Checklist' : 'Submit Close Checklist')
          }
        </button>
      </form>

      <div className="p-4 bg-gray-50 rounded mt-4 overflow-y-auto" style={{ maxHeight: '25%' }}>
        <h2 className="font-bold mb-2">Recent Submissions</h2>
        {subs.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          subs.map((s, i) => (
            <div key={i} className="border-b py-2">
              <p>
                <strong>Type:</strong>{' '}
                {s.submission_type.charAt(0).toUpperCase() + s.submission_type.slice(1)}
              </p>
              <p><strong>Date:</strong> {s.submission_date}</p>
              <p><strong>Time:</strong> {s.created_at}</p>
              {s.submission_type === 'close' && (
                <>
                  <p><strong>Cash:</strong> ${parseFloat(s.cash_amount).toFixed(2)}</p>
                  <p><strong>Credit:</strong> ${parseFloat(s.credit_amount).toFixed(2)}</p>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
