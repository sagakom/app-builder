import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Grid, Row, Col, Breadcrumb, Button } from 'patternfly-react';
import { Link } from 'react-router-dom';
import { routeConverter } from '@entando/utils';

import BreadcrumbItem from 'ui/common/BreadcrumbItem';
import InternalPage from 'ui/internal-page/InternalPage';
import PageTitle from 'ui/internal-page/PageTitle';
import SelectedPageModelDetailTableContainer from 'ui/page-models/detail/SelectedPageModelDetailTableContainer';
import PageModelPageReferencesTableContainer from 'ui/page-models/detail/PageModelPageReferencesTableContainer';
import { ROUTE_PAGE_MODEL_LIST, ROUTE_PAGE_MODEL_EDIT } from 'app-init/router';

const PageModelDetailPage = ({ pageModelCode }) => (
  <InternalPage className="PageModelDetailPage">
    <Grid fluid>
      <Row>
        <Col xs={12}>
          <Breadcrumb>
            <BreadcrumbItem active>
              <FormattedMessage id="menu.pageDesigner" />
            </BreadcrumbItem>
            <BreadcrumbItem to={ROUTE_PAGE_MODEL_LIST}>
              <FormattedMessage id="menu.pageModels" />
            </BreadcrumbItem>
            <BreadcrumbItem active>
              <FormattedMessage id="menu.pageModelDetails" />
            </BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <PageTitle titleId="menu.pageModelDetails" helpId="pageModels.help" />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <SelectedPageModelDetailTableContainer />
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs={12}>
          <Link to={routeConverter(ROUTE_PAGE_MODEL_EDIT, { pageModelCode })}>
            <Button
              type="button"
              className="pull-right PageModelDetailPage__edit-btn"
              bsStyle="primary"
            >
              <FormattedMessage id="app.edit" />
            </Button>
          </Link>
        </Col>
      </Row>
      <br />
      <Row className="form-horizontal">
        <label className="col-xs-2 control-label">
          <FormattedMessage id="references.referencedPages" />
        </label>
        <Col xs={10}>
          <PageModelPageReferencesTableContainer />
        </Col>
      </Row>
    </Grid>
  </InternalPage>
);

PageModelDetailPage.propTypes = {
  pageModelCode: PropTypes.string.isRequired,
};

export default PageModelDetailPage;
