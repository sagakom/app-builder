import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Paginator, Alert, Spinner } from 'patternfly-react';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import ProfileTypeListMenuActions from 'ui/profile-types/list/ProfileTypeListMenuActions';
import ProfileTypeStatusIcon from 'ui/profile-types/common/ProfileTypeStatusIcon';
import ProfileTypesDeleteModalContainer from 'ui/profile-types/common/ProfileTypesDeleteModalContainer';
import ProfileTypeReferenceStatusContainer from 'ui/profile-types/common/ProfileTypeReferenceStatusContainer';

const msgs = defineMessages({
  profileStatus: {
    id: 'profileType.table.status',
    defaultMessage: 'Status',
  },
});

class ProfileTypeListTable extends Component {
  constructor(props) {
    super(props);

    this.changePage = this.changePage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
  }

  componentWillMount() {
    this.props.onWillMount();
  }

  changePage(page) {
    this.props.onWillMount({ page, pageSize: this.props.pageSize });
  }

  changePageSize(pageSize) {
    this.props.onWillMount({ page: 1, pageSize });
  }

  renderTableRows() {
    const { intl, profiletypes } = this.props;
    return profiletypes.map(profiletype => (
      <tr key={profiletype.name}>
        <td className="ProfileTypeListRow__td">{profiletype.name}</td>
        <td className="ProfileTypeListRow__td text-center">{profiletype.code}</td>
        <td className="ProfileTypeListRow__td text-center">
          <ProfileTypeStatusIcon
            status={profiletype.status}
            title={intl.formatMessage(msgs.profileStatus)}
          />
        </td>
        <td className="ProfileTypeListRow__td text-center">
          <ProfileTypeListMenuActions
            code={profiletype.code}
            onClickDelete={this.props.removeProfileType}
            onClickReload={this.props.reloadProfileType}
          />
        </td>
      </tr>
    ));
  }

  renderTable() {
    if (this.props.profiletypes.length > 0) {
      const pagination = {
        page: this.props.page,
        perPage: this.props.pageSize,
        perPageOptions: [5, 10, 15, 25, 50],
      };

      return (
        <Col xs={12}>
          <ProfileTypeReferenceStatusContainer />
          <table className="ProfileTypeListTable__table table table-striped table-bordered">
            <thead>
              <tr>
                <th><FormattedMessage id="app.name" /></th>
                <th className="ProfileTypeListTable__th-sm text-center">
                  <FormattedMessage id="app.code" />
                </th>
                <th className="ProfileTypeListTable__th-xs text-center">
                  <FormattedMessage id="profileType.table.status" />
                </th>
                <th className="ProfileTypeListTable__th-xs text-center">
                  <FormattedMessage id="app.actions" />
                </th>
              </tr>
            </thead>
            <tbody>
              {this.renderTableRows()}
            </tbody>
          </table>
          <Paginator
            pagination={pagination}
            viewType="table"
            itemCount={this.props.totalItems}
            onPageSet={this.changePage}
            onPerPageSelect={this.changePageSize}
          />
        </Col>
      );
    }
    return (
      <Col xs={12}>
        <Alert type="warning">
          <strong><FormattedMessage id="profileType.listEmpty" /></strong>
        </Alert>
      </Col>
    );
  }

  render() {
    return (
      <Spinner loading={!!this.props.loading} >
        <div className="ProfileTypeListTable">
          {this.renderTable()}
          <ProfileTypesDeleteModalContainer />
        </div>
      </Spinner>
    );
  }
}

ProfileTypeListTable.propTypes = {
  intl: intlShape.isRequired,
  onWillMount: PropTypes.func,
  loading: PropTypes.bool,
  profiletypes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  })),
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  removeProfileType: PropTypes.func.isRequired,
  reloadProfileType: PropTypes.func.isRequired,
};

ProfileTypeListTable.defaultProps = {
  onWillMount: () => {},
  loading: false,
  profiletypes: [],
};

export default injectIntl(ProfileTypeListTable);
