import React, { useState, useCallback, useEffect } from 'react';
import { FwSpinner } from '@freshworks/crayons/react';
import { dialWithZoomPhone } from '../utils/phone';

const DIAL_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

function ZoomdeskApp({ client }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [agent, setAgent] = useState(null);
  const [dialed, setDialed] = useState('');
  const [callMessage, setCallMessage] = useState('');

  const loadAgent = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await client.request.invoke('getAgent', {});
      setAgent(res.response?.account || null);
    } catch (err) {
      console.error(err);
      setError('Could not load agent. Check install settings and user:read:admin scope.');
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    loadAgent();
    client.events.on('cti.triggerDialer', (event) => {
      const data = event.helper.getData();
      if (!data?.number) {
        return;
      }
      setDialed(String(data.number));
      setCallMessage('Number loaded from ticket. Press Call to dial.');
      client.interface.trigger('show', { id: 'softphone' }).catch((err) => {
        console.warn('Could not open CTI sidebar', err);
      });
    });
  }, [client, loadAgent]);

  const placeCall = () => {
    const number = dialed.trim();
    if (!number) {
      setCallMessage('Enter a number first.');
      return;
    }
    if (dialWithZoomPhone(number)) {
      setCallMessage(
        'Handing off to Zoom… If nothing happens, open Zoom Workplace and allow zoomphonecall links.'
      );
    } else {
      setCallMessage('Invalid number. Use digits, +, *, or #.');
    }
  };

  return (
    <div className="zoomdesk">
      <header className="zoomdesk-header">
        <h1 className="zoomdesk-brand">zoomdesk</h1>
        <span className="zoomdesk-logo-mark" aria-hidden="true">Z</span>
      </header>

      <div className="zoomdesk-toolbar">
        <span className="zoomdesk-ready">
          <span className="zoomdesk-status-dot" />
          Ready
        </span>
        <button type="button" className="zoomdesk-refresh" onClick={loadAgent}>
          Refresh
        </button>
      </div>

      {loading && (
        <div className="zoomdesk-loading">
          <FwSpinner size="small" />
        </div>
      )}

      {error && <p className="zoomdesk-error">{error}</p>}

      {!loading && agent && (
        <section className="zoomdesk-agent-card">
          <p><span>Agent</span> {agent.display_name}</p>
          <p><span>Email</span> {agent.email}</p>
          <p><span>Zoom user ID</span> {agent.id}</p>
        </section>
      )}

      <input
        className="zoomdesk-input"
        type="tel"
        placeholder="Number to dial"
        value={dialed}
        onChange={(e) => setDialed(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && placeCall()}
      />

      <div className="zoomdesk-keypad">
        {DIAL_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className="zoomdesk-key"
            onClick={() => setDialed((prev) => prev + key)}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="zoomdesk-actions">
        <button type="button" className="zoomdesk-clear" onClick={() => setDialed('')}>
          Clear
        </button>
        <button type="button" className="zoomdesk-call" onClick={placeCall} aria-label="Call">
          <span className="zoomdesk-call-icon" aria-hidden="true">☎</span>
        </button>
      </div>

      {callMessage && <p className="zoomdesk-call-msg">{callMessage}</p>}

      <p className="zoomdesk-hint">
        Dial pad is a Crayons UI demo. Agent details come from Zoom API.
      </p>
    </div>
  );
}

export default ZoomdeskApp;
