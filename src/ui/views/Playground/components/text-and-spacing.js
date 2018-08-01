import React from 'react';

export default function PlaygroundItem() {
  return (
    <div>
      <h1 className="m-s-b" style={{ backgroundColor: 'rgba(232,58,48,.2)' }}>
        Large heading
      </h1>
      <h2 className="m-s-b" style={{ backgroundColor: 'rgba(232,58,48,.2)' }}>
        Medium heading
      </h2>
      <h3 className="m-s-b" style={{ backgroundColor: 'rgba(232,58,48,.2)' }}>
        Small heading
      </h3>
      <h4 className="m-s-b" style={{ backgroundColor: 'rgba(232,58,48,.2)' }}>
        Extra-small heading
      </h4>
      <p className="m-m-b" style={{ backgroundColor: 'rgba(232,58,48,.2)' }}>
        Paragraph one
      </p>
      <p className="m-m-b" style={{ backgroundColor: 'rgba(232,58,48,.2)' }}>
        Paragraph two
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '256px 256px' }}>
        <div>
          <div className="bold m-m-b">Spacing units:</div>
          <div className="fs-s m-u-b">
            <div className="inline-block valign-top h-u w-u m-u-r" style={{ backgroundColor: 'rgba(232,58,48,.2)' }} />
            unit
          </div>
          <div className="fs-s m-u-b">
            <div className="inline-block valign-top h-s w-s m-u-r" style={{ backgroundColor: 'rgba(232,58,48,.2)' }} />s
          </div>
          <div className="fs-s m-u-b">
            <div className="inline-block valign-top h-m w-m m-u-r" style={{ backgroundColor: 'rgba(232,58,48,.2)' }} />m
          </div>
          <div className="fs-s m-u-b">
            <div className="inline-block valign-top h-l w-l m-u-r" style={{ backgroundColor: 'rgba(232,58,48,.2)' }} />l
          </div>
          <div className="fs-s m-u-b">
            <div
              className="inline-block valign-top h-xl w-xl m-u-r"
              style={{ backgroundColor: 'rgba(232,58,48,.2)' }}
            />
            xl
          </div>
        </div>
        <div>
          <div className="bold m-m-b">Padding configurations:</div>
          <div
            className="p-s-l p-s-r p-u-t p-u-b text-center m-s-b"
            style={{ backgroundColor: 'rgba(232,58,48,.2)', width: 'max-content' }}>
            <div style={{ backgroundColor: 'white' }}>Button</div>
          </div>
          <div
            className="p-s-l p-s-r p-u-t p-u-b text-center bg-neutral-5 color-neutral-0 m-s-b"
            style={{ width: 'max-content' }}>
            Button
          </div>
          <div className="p-u m-s-b" style={{ backgroundColor: 'rgba(232,58,48,.2)' }}>
            <div style={{ backgroundColor: 'white' }}>Input</div>
          </div>
          <div className="p-u bg-neutral-5 color-neutral-0 m-s-b">Input</div>
        </div>
      </div>
    </div>
  );
}
