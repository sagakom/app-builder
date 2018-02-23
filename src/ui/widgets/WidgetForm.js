import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldLevelHelp, Button, Tabs, Tab, Row, Col } from 'patternfly-react';
import { formattedText } from 'frontend-common-components';
import { FormattedMessage } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { required, widgetCode, maxLength } from 'util/validateForm';
import RenderTextInput from 'ui/form/RenderTextInput';

export class WidgetFormBody extends Component {
  componentWillMount() {
    this.props.onWillMount();
  }

  render() {
    const onSubmit = (ev) => {
      ev.preventDefault();
      this.props.handleSubmit();
    };


    return (
      <form onSubmit={onSubmit} className="form-horizontal">
        <Row>
          <Col xs={12}>
            <fieldset className="no-padding">
              <legend><FormattedMessage id="widget.page.create.pageTitle" />
                <div className="WidgetForm__required-fields text-right">
                  * <FormattedMessage id="app.fieldsRequired" />
                </div>
              </legend>

              <Field
                component={RenderTextInput}
                name="code"
                label={
                  <span>
                    <FormattedMessage id="widget.page.create.code" />

                    <i className="fa fa-asterisk required-icon WidgetForm__required-icon" />

                  </span>
                }
                placeholder={formattedText('widget.page.create.code.placeholder')}
                help={<FieldLevelHelp content={formattedText('widget.help.code')} />}
                validate={[required, widgetCode]}
              />
              <Field
                component={RenderTextInput}
                name="titles.en"
                label={
                  <span>
                    <span className="label WidgetForm__language-label">
                      <FormattedMessage id="app.en" />
                    </span>
                    <FormattedMessage id="widget.page.create.title" />
                    <sup>
                      <i className="fa fa-asterisk required-icon WidgetForm__required-icon" />
                    </sup>
                  </span>
                }
                placeholder={formattedText('widget.page.create.title.en.placeholder')}
                validate={[required, maxLength(255)]}
              />
              <Field
                component={RenderTextInput}
                name="titles.it"
                label={
                  <span>
                    <span className="label WidgetForm__language-label">
                      <FormattedMessage id="app.it" />
                    </span>
                    <FormattedMessage id="widget.page.create.title" />
                    <sup>
                      <i className="fa fa-asterisk required-icon WidgetForm__required-icon" />
                    </sup>
                  </span>
                }
                placeholder={formattedText('widget.page.create.title.it.placeholder')}
                validate={[required, maxLength(255)]}
              />
              <div className="form-group">
                <label htmlFor="mainGroup" className="col-xs-2 control-label">
                  <FormattedMessage id="widget.page.create.group" />
                </label>
                <Col xs={10}>
                  <Field name="group" component="select" className="form-control">
                    {this.props.groups.map(gr => (
                      <option
                        key={gr.code}
                        value={gr.code}
                      > {gr.name}
                      </option>))}
                  </Field>
                </Col>
              </div>
            </fieldset>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <fieldset className="no-padding">
              <Col xs={12}>
                <div className="form-group">
                  <span className="control-label col-xs-2" />
                  <Col xs={10}>
                    <Tabs id="basic-tabs" defaultActiveKey={1}>
                      <Tab eventKey={1} title={formattedText('widget.page.tab.customUi')} >
                        <div className="tab-content margin-large-bottom ">
                          <div className="tab-pane fade in active">
                            <Field
                              name="customUi"
                              component="textarea"
                              cols="50"
                              rows="8"
                              className="form-control"
                              validate={[required]}
                            />
                          </div>
                        </div>
                      </Tab>
                    </Tabs>
                  </Col>
                </div>
              </Col>
            </fieldset>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12}>
            <Button
              className="pull-right"
              type="submit"
              bsStyle="primary"
              disabled={this.props.invalid || this.props.submitting}
            >
              <FormattedMessage id="app.save" />
            </Button>
          </Col>
        </Row>
      </form>
    );
  }
}

WidgetFormBody.propTypes = {
  onWillMount: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool,
  submitting: PropTypes.bool,
  groups: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    code: PropTypes.string,
  })),
};

WidgetFormBody.defaultProps = {
  onWillMount: () => {},
  invalid: false,
  submitting: false,
  groups: [{
    name: '',
    code: '',
  }],
};


const WidgetForm = reduxForm({
  form: 'widget',
})(WidgetFormBody);

export default WidgetForm;