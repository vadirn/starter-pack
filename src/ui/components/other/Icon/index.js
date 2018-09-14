import c from 'classnames';
import React from 'react';
import s from './styles.css';
import { getJsonType } from 'json-model';
import { paths, dimensions } from './icons.js';

function getValueAtPath(source, path) {
  const [key, ...nextPath] = path;
  if (key) {
    const type = getJsonType(source[key]);
    if (type === 'object' && nextPath.length > 0) {
      return getValueAtPath(source[key], nextPath);
    }
    return source[key];
  }
  return;
}

export default class Icon extends React.PureComponent {
  render() {
    const { path, size = 'm', className, stroke = 0, ...props } = this.props;
    let fillColor = 'transparent';
    let strokeColor = 'transparent';
    if (stroke === 0) {
      fillColor = 'currentColor';
    } else {
      strokeColor = 'currentColor';
    }

    const sizePath = size.toUpperCase().split('.');
    const viewBox = getValueAtPath(dimensions, sizePath);

    return (
      <svg
        className={c(
          'inline-block text-valign-top',
          s.container,
          s[sizePath[sizePath.length - 1].toLowerCase()],
          className
        )}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        {...props}>
        <path fillRule="evenodd" fill={fillColor} stroke={strokeColor} strokeWidth={stroke} d={path} />
      </svg>
    );
  }
}

export const ICONS = paths;
