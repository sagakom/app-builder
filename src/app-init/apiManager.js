import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { config, setApi, useMocks } from '@entando/apimanager';
import { addToast, TOAST_WARNING } from '@entando/messages';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { history, ROUTE_DASHBOARD, ROUTE_HOME } from 'app-init/router';
import pluginsArray from 'entando-plugins';
import withAuth from 'auth/withAuth';

class ApiManager extends Component {
  constructor(props) {
    super(props);
    this.initApiManager();
  }

  initApiManager() {
    const { store, auth, intl } = this.props;
    const logout = (status) => {
      auth.logout(status);
    };
    const goHome = (opts) => {
      if (!auth.toRefreshToken) {
        const { redirectUri, pathname } = opts;
        if (redirectUri) {
          window.location.href = redirectUri;
          return;
        }
        const route = pathname ? pathname.replace(process.env.PUBLIC_URL, '') : null;
        const goto = auth.enabled && route && route !== ROUTE_HOME
          ? route
          : ROUTE_DASHBOARD;
        history.push(goto);
      } else {
        auth.toRefreshToken = false;
      }
    };
    config(store, logout, goHome);
    store.dispatch(setApi({
      domain: (window && window.env && window.env.REACT_APP_DOMAIN) || process.env.DOMAIN,
      useMocks: process.env.USE_MOCKS,
    }));

    if (useMocks(store.getState())) {
      const msgs = defineMessages({
        usingMocks: {
          id: 'app.usingMocks',
          defaultMessage: 'Using Mocks',
        },
      });
      store.dispatch(addToast(
        intl.formatMessage(msgs.usingMocks),
        TOAST_WARNING,
      ));
    }

    if (pluginsArray && pluginsArray.length) {
      pluginsArray.forEach((plugin) => {
        if (plugin.apiManagerConfig) {
          plugin.apiManagerConfig(store, logout, goHome);
        }
      });
    }
  }

  render() {
    return <Fragment>{this.props.children}</Fragment>;
  }
}

ApiManager.propTypes = {
  store: PropTypes.shape({}).isRequired,
  auth: PropTypes.shape({}).isRequired,
  intl: intlShape.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default withAuth(injectIntl(ApiManager));
