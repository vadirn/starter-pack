import React from 'react';
import PropTypes from 'prop-types';

function Color({ name }) {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 right-0 bottom-0 b" />
      <div
        className="relative bg-neutral-5 color-neutral-0 text-caption p-u-l p-u-r text-truncate"
        style={{ minWidth: '120px' }}>
        {name}
      </div>
      <div style={{ display: 'grid' }}>
        <svg viewBox="0 0 1 1" style={{ gridArea: '1 / 1 / 2 / 2' }} />
        <div className={`bg-${name}`} style={{ gridArea: '1 / 1 / 2 / 2' }} />
      </div>
    </div>
  );
}

Color.propTypes = {
  name: PropTypes.string,
};

export default function Colors() {
  return (
    <div className="m-m-b" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gridGap: '24px' }}>
      <Color name="neutral-0" />
      <Color name="neutral-1" />
      <Color name="neutral-2" />
      <Color name="neutral-3" />
      <Color name="neutral-4" />
      <Color name="neutral-5" />

      <Color name="accent-1-light" />
      <Color name="accent-1" />
      <Color name="accent-1-dark" />
    </div>
  );
}
