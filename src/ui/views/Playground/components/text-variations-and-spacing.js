import React from 'react';

export default function VariationsAndSpacing() {
  return (
    <div className="m-m-b" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '40px 24px' }}>
      <div>
        <h1 className="text-caps text-medium color-neutral-4 m-s-b">Text variations</h1>
        <div className="text-title m-s-b bg-debug">Title</div>
        <div className="text-heading m-s-b bg-debug">Heading</div>
        <div className="text-caption m-s-b bg-debug">Caption</div>
        <div className="text-caps m-s-b bg-debug">Caps</div>
        <div className="text-body-2 m-s-b bg-debug">Body-2</div>
        <div className="text-body-1 bg-debug">Body-1</div>
      </div>
      <div>
        <h2 className="text-caps text-medium color-neutral-4 m-s-b">Block sizes</h2>
        <div className="h-u w-u bg-debug m-s-b" />
        <div className="h-s w-s bg-debug m-s-b" />
        <div className="h-m w-m bg-debug m-s-b" />
        <div className="h-l w-l bg-debug m-s-b" />
        <div className="h-xl w-xl bg-debug m-s-b" />
        <div className="h-xxl w-xxl bg-debug" />
      </div>
      <div style={{ gridColumn: '1/3' }}>
        <h2 className="text-caps text-medium color-neutral-4 m-s-b">Weights</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gridGap: '16px 24px',
          }}>
          <div className="text-title">Title</div>
          <div className="text-title text-medium">Title</div>
          <div className="text-title text-bold">Title</div>
          <div className="text-title text-light">Title</div>

          <div className="text-heading">Heading</div>
          <div className="text-heading text-medium">Heading</div>
          <div className="text-heading text-bold">Heading</div>
          <div className="text-heading text-light">Heading</div>

          <div className="text-caption">Caption</div>
          <div className="text-caption text-medium">Caption</div>
          <div className="text-caption text-bold">Caption</div>
          <div />

          <div className="text-caps">Caps</div>
          <div className="text-caps text-medium">Caps</div>
          <div className="text-caps text-bold">Caps</div>
          <div />

          <div className="text-body-2">Body-2</div>
          <div className="text-body-2 text-medium">Body-2</div>
          <div className="text-body-2 text-bold">Body-2</div>
          <div />

          <div className="text-body-1">Body-1</div>
          <div className="text-body-1 text-medium">Body-1</div>
          <div className="text-body-1 text-bold">Body-1</div>
          <div />
        </div>
      </div>
    </div>
  );
}
