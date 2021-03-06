import { connect } from 'react-redux';
import { clearErrors } from '@entando/messages';

import { fetchDataTypes } from 'state/data-types/actions';
import { getDataTypeList } from 'state/data-types/selectors';
import { sendPostDataModel } from 'state/data-models/actions';
import DataModelForm from 'ui/data-models/common/DataModelForm';

export const mapStateToProps = state => ({
  dataTypes: getDataTypeList(state),
});

export const mapDispatchToProps = dispatch => ({
  onWillMount: () => {
    dispatch(clearErrors());
    dispatch(fetchDataTypes({ page: 1, pageSize: 0 }));
  },
  onSubmit: (values) => {
    dispatch(sendPostDataModel(values));
  },
});
export default connect(mapStateToProps, mapDispatchToProps, null, {
  pure: false,
})(DataModelForm);
