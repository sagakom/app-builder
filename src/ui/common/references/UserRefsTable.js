import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import { DropdownKebab, Spinner } from 'patternfly-react';
import { Table } from 'react-bootstrap';
import UserStatus from 'ui/users/common/UserStatus';
import { routeConverter } from '@entando/utils';
import { LinkMenuItem } from '@entando/menu';

import { ROUTE_USER_EDIT, ROUTE_USER_AUTHORITY } from 'app-init/router';

const msgs = defineMessages({
  edit: {
    id: 'reference.edit',
    defaultMessage: 'Edit - {code}',
  },
  manageAuth: {
    id: 'reference.manageAuthorization',
    defaultMessage: 'Manage Auth - {code}',
  },
});

class UserRefsTable extends React.Component {
  componentWillMount() {
    this.props.onWillMount(this.props);
  }

  renderRows() {
    const { userReferences, intl } = this.props;

    return userReferences.map(reference => (
      <tr key={reference.username}>
        <td>{reference.username}</td>
        <td>{reference.lastLogin}</td>
        <td className="text-center">
          <UserStatus status={reference.status === 'active' ? 'active' : 'disabled'} />
        </td>
        <td className="text-center">
          <DropdownKebab id={`kebab-${reference.username}`} pullRight>
            <LinkMenuItem
              id={`edit-user-${reference.username}`}
              to={routeConverter(ROUTE_USER_EDIT, { username: reference.username })}
              label={intl.formatMessage(msgs.edit, { code: reference.username })}
              className="UserRefsTable__menu-user-edit"
            />
            <LinkMenuItem
              id={`authority-${reference.username}`}
              to={routeConverter(ROUTE_USER_AUTHORITY, { username: reference.username })}
              label={intl.formatMessage(msgs.manageAuth, { code: reference.username })}
              className="UserRefsTable__menu-item-edit"
            />
          </DropdownKebab>
        </td>
      </tr>
    ));
  }

  renderTable() {
    if (this.props.userReferences.length > 0) {
      return (
        <div>
          <Table className="UserRefsTable__table" striped bordered condensed hover >
            <thead>
              <tr>
                <th><FormattedMessage id="user.table.username" /></th>
                <th className="UserRefsTable__th-sm"><FormattedMessage id="user.lastLogin" /></th>
                <th className="UserRefsTable__th-xs text-center"><FormattedMessage id="user.table.status" /></th>
                <th className="UserRefsTable__th-xs text-center"> <FormattedMessage id="app.actions" /></th>
              </tr>
            </thead>
            <tbody>
              {this.renderRows()}
            </tbody>
          </Table>
        </div>
      );
    }
    return (
      <FormattedMessage id="reference.noReferencedUsers" />
    );
  }

  render() {
    return (
      <div className="UserRefsTable">
        <Spinner loading={this.props.loading} >
          {this.renderTable()}
        </Spinner>
      </div>
    );
  }
}

UserRefsTable.propTypes = {
  onWillMount: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  userReferences: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string,
    fullName: PropTypes.string,
    lastLogin: PropTypes.string,
    status: PropTypes.string,
  })),
  intl: intlShape.isRequired,
};

UserRefsTable.defaultProps = {
  loading: false,
  userReferences: [],
};

export default injectIntl(UserRefsTable);
