import { connect } from 'react-redux';
import { sendPutRole, fetchRole } from 'state/roles/actions';
import { fetchPermissions } from 'state/permissions/actions';
import { getPermissionsList } from 'state/permissions/selectors';
import RoleForm from 'ui/roles/common/RoleForm';

export const EDIT_MODE = 'edit';

export const mapStateToProps = state => ({
  mode: EDIT_MODE,
  permissions: getPermissionsList(state),
});

export const mapDispatchToProps = dispatch => ({
  onWillMount: ({ roleCode }) => {
    dispatch(fetchPermissions());
    dispatch(fetchRole(roleCode));
  },
  onSubmit: values => dispatch(sendPutRole(values)),
});

const EditFormContainer = connect(mapStateToProps, mapDispatchToProps)(RoleForm);
export default EditFormContainer;
