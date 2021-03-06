import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import WidgetFrame from 'ui/pages/config/WidgetFrame';
import frameDropTarget from 'ui/pages/config/frameDropTarget';
import { configOrUpdatePageWidget } from 'state/page-config/actions';

export const mapDispatchToProps = (dispatch, { match: { params } }) => ({
  onDrop: ({ sourceWidgetId, sourceFrameId, targetFrameId }) => {
    dispatch(configOrUpdatePageWidget(
      sourceWidgetId,
      sourceFrameId,
      targetFrameId,
      params.pageCode,
    ));
  },
});

export default withRouter(connect(null, mapDispatchToProps)(frameDropTarget(WidgetFrame)));
