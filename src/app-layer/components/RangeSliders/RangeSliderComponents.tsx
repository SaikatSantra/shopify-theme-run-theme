import * as React from 'react';
import * as CSS from 'csstype';

import {
  GetRailProps,
  GetHandleProps,
  GetTrackProps,
  SliderItem,
} from 'react-compound-slider';

interface SliderRailProps {
  getRailProps: GetRailProps;
}

export const SliderRail: React.FC<SliderRailProps> = ({ getRailProps }) => {
  return (
    <>
      <div className="dual-range-slider__rail dual-range-slider__rail--foreground" {...getRailProps()} />
      <div className="dual-range-slider__rail dual-range-slider__rail--background" />
    </>
  );
};

interface HandleProps {
  domain: number[];
  handle: SliderItem;
  getHandleProps: GetHandleProps;
  disabled?: boolean;
}


export const sliderStyle : CSS.Properties  = {
  position: 'relative',
  width: '100%',
  touchAction: 'none',
};

export const Handle: React.FC<HandleProps> = ({
  domain: [min, max],
  handle: { id, value, percent },
  disabled = false,
  getHandleProps,
}) => {
  return (
    <div
      {...getHandleProps(id)}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div
        className='dual-range-slider__handle dual-range-slider__handle--area'
        style={{
          '--left': `${percent}%`,
        } as React.CSSProperties}
      />
      <div
        className={`dual-range-slider__handle dual-range-slider__handle--handle${disabled ? ' dual-range-slider__handle--disabled' : ''}`}
        style={{
          '--left': `${percent}%`,
        } as React.CSSProperties}
      />
    </div>
  );
};


export const KeyboardHandle: React.FC<HandleProps> = ({
  domain: [min, max],
  handle: { id, value, percent },
  disabled = false,
  getHandleProps,
}) => {
  return (
    <button
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      className={`dual-range-slider__keyboard-handle${disabled ? ' dual-range-slider__keyboard-handle--disabled' : ''}`}
      style={{
        '--left': `${percent}%`,
      } as React.CSSProperties}
      {...getHandleProps(id)}
    />
  );
};


interface TrackProps {
  source: SliderItem;
  target: SliderItem;
  getTrackProps: GetTrackProps;
  disabled?: boolean;
}

export const Track: React.FC<TrackProps> = ({
  source,
  target,
  getTrackProps,
  disabled = false,
}) => {
  return (
    <div
      className={`dual-range-slider__track${disabled ? ' dual-range-slider__track--disabled' : ''}`}
      style={{
        '--left': `${source.percent}%`,
        '--width': `${target.percent - source.percent}%`,
      } as React.CSSProperties}
      {...getTrackProps()}
    />
  );
};
