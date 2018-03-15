import { connect } from 'react-redux';
import FragmentForm from 'ui/fragments/common/FragmentForm';

export const mapDispatchToProps = () => ({
  onSubmit: () => {},
});

const AddFormContainer = connect(null, mapDispatchToProps)(FragmentForm);
export default AddFormContainer;