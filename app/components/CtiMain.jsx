import React, { useState, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@freshworks/crayons/loader';
import '@freshworks/crayons/css/crayons-min.css';
import ZoomdeskApp from './ZoomdeskApp';

defineCustomElements();

const CtiMain = () => {
  const [child, setChild] = useState(<p className="zoomdesk-loading-text">Loading zoomdesk…</p>);

  useLayoutEffect(() => {
    window.app.initialized().then((client) => {
      window.client = client;
      const resize = () => client.instance.resize({ height: '520px', width: '300px' }).catch(() => {});
      resize();
      client.events.on('app.activated', resize);
      setChild(<ZoomdeskApp client={client} />);
    });
  }, []);

  return <div className="zoom-cti-root">{child}</div>;
};

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CtiMain />
  </React.StrictMode>
);
