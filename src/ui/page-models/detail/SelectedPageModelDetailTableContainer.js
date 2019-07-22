import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getSelectedPageModel, getSelectedPageModelCellMap } from 'state/page-models/selectors';
import { getLoading } from 'state/loading/selectors';
import { loadSelectedPageModel } from 'state/page-models/actions';
import PageModelDetailTable from 'ui/page-models/detail/PageModelDetailTable';

export const mapStateToProps = state => ({
  pageModel: getSelectedPageModel(state),
  cellMap: getSelectedPageModelCellMap(state),
  loading: !!getLoading(state).pageModel,
});

export const mapDispatchToProps = (dispatch, { match: { params } }) => ({
  onWillMount: () => {
    dispatch(loadSelectedPageModel(params.pageModelCode));
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageModelDetailTable));
