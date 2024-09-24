import React from 'react';
import { Handles, Rail, Slider, Tracks } from 'react-compound-slider';
import {
  Handle,
  SliderRail,
  sliderStyle,
  Track,
} from './RangeSliderComponents';

interface Props {
  range: [number, number];
  values: [number, number];
  onChange: (values: [number, number]) => void;
  children: ({
    value,
    labelHandle,
  }: {
    value: number;
    labelHandle: string;
  }) => React.ReactElement; // children should be function of value to display
}

const DualRangeSlider: React.FunctionComponent<Props> = ({
  range,
  values,
  onChange,
  children,
}) => {
  const valueDisplay = children; //
  return (
    <div className="dual-range-slider">
      <Slider
        mode={2}
        step={1}
        domain={range}
        rootStyle={sliderStyle}
        onChange={onChange}
        values={values}
      >
        <Rail>
          {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
        </Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <div className="dual-range-slider__handles">
              {handles.map((handle) => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  domain={range}
                  getHandleProps={getHandleProps}
                />
              ))}
            </div>
          )}
        </Handles>
        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <div className="dual-range-slider__tracks">
              {tracks.map(({ id, source, target }) => (
                <Track
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </div>
          )}
        </Tracks>
      </Slider>
      <span className="dual-range-slider__label dual-range-slider__label--min">
        {valueDisplay({ value: values[0], labelHandle: 'min' })}
      </span>
      <span className="dual-range-slider__label dual-range-slider__label--max">
        {valueDisplay({ value: values[1], labelHandle: 'max' })}
      </span>
    </div>
  );
};

export default DualRangeSlider;
