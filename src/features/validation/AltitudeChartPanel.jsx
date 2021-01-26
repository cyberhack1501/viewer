import { connect } from 'react-redux';

import ChartPanel from './ChartPanel';
import {
  getAltitudeWarningThreshold,
  getSampledAltitudesForDrones,
} from './selectors';
import { createChartDataSelector } from './utils';

const getDataForAltitudeChart = createChartDataSelector(
  getSampledAltitudesForDrones
);

// Custom range to use for the chart panel. This prevents the annotations from
// affecting the range chosen by Chart.js but it will still allow the data to
// expand the range if needed.
const Y_RANGE = [0, 10];

export default connect(
  // mapStateToProps
  (state) => ({
    data: getDataForAltitudeChart(state),
    range: Y_RANGE,
    threshold: getAltitudeWarningThreshold(state),
    thresholdLabel: 'Altitude threshold',
    title: 'Altitudes',
    verticalUnit: ' m',
  }),
  // mapDispatchToProps
  {}
)(ChartPanel);
