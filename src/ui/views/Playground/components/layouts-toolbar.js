import React from 'react';
import Toolbar from 'components/layouts/Toolbar';

export default function LayoutsToolbar() {
  return (
    <div className="m-m-b">
      <div className="text-caption color-neutral-4">Container 50% width</div>
      <div className="m-m-b" style={{ width: '50%' }}>
        <Toolbar
          className="bg-debug"
          left={<div className="bg-debug">Left</div>}
          middle={<div className="bg-debug p-u">Middle with padding</div>}
          right={<div className="bg-debug">Right</div>}
        />
      </div>
      <div className="text-caption color-neutral-4">Container 240px width</div>
      <div className="m-m-b" style={{ width: '240px' }}>
        <Toolbar
          className="bg-debug"
          left={<div className="bg-debug">Left</div>}
          middle={<div className="bg-debug p-u">Middle with padding</div>}
          right={<div className="bg-debug">Right</div>}
        />
      </div>
      <div className="text-caption color-neutral-4">Container 120px width</div>
      <div className="bg-debug" style={{ width: '120px' }}>
        <div className="h-m" />
        <Toolbar
          className="bg-debug"
          left={<div className="bg-debug">Left</div>}
          middle={<div className="bg-debug p-u">Middle with padding</div>}
          right={<div className="bg-debug">Right</div>}
        />
      </div>
    </div>
  );
}
