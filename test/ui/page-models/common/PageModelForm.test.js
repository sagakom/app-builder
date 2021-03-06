
import React from 'react';
import 'test/enzyme-init';
import { shallow } from 'enzyme';

import { PageModelFormBody as PageModelForm, validateJson } from 'ui/page-models/common/PageModelForm';
import { mockIntl } from 'test/testUtils';

const ON_SUBMIT = jest.fn();
const HANDLE_SUBMIT = jest.fn();
const ON_WILL_MOUNT = jest.fn();

describe('PageModelForm', () => {
  beforeEach(jest.clearAllMocks);

  describe('basic rendering', () => {
    let component;
    beforeEach(() => {
      component = shallow((
        <PageModelForm
          onSubmit={ON_SUBMIT}
          handleSubmit={HANDLE_SUBMIT}
          previewErrors={[]}
          intl={mockIntl}
        />
      ));
    });

    it('renders without crashing', () => {
      expect(component).toExist();
    });

    it('has class PageModelForm', () => {
      expect(component).toHaveClassName('PageModelForm');
    });


    it('renders the "code" Field', () => {
      expect(component.find('Field[name="code"]')).toExist();
    });

    it('renders the "descr" Field', () => {
      expect(component.find('Field[name="descr"]')).toExist();
    });

    it('renders the "configuration" Field', () => {
      expect(component.find('Field[name="configuration"]')).toExist();
    });

    it('renders the "template" Field', () => {
      expect(component.find('Field[name="template"]')).toExist();
    });

    it('renders a PageConfigGrid to show the template preview', () => {
      expect(component.find('PageConfigGrid')).toExist();
    });
  });

  describe('with onWillMount callback', () => {
    beforeEach(() => {
      shallow((
        <PageModelForm
          onSubmit={ON_SUBMIT}
          handleSubmit={HANDLE_SUBMIT}
          previewErrors={[]}
          onWillMount={ON_WILL_MOUNT}
          intl={mockIntl}
        />
      ));
    });

    it('calls onWillMount', () => {
      expect(ON_WILL_MOUNT).toHaveBeenCalled();
    });
  });

  describe('if form is invalid', () => {
    let component;
    beforeEach(() => {
      component = shallow((
        <PageModelForm
          onSubmit={ON_SUBMIT}
          handleSubmit={HANDLE_SUBMIT}
          previewErrors={[]}
          invalid
          intl={mockIntl}
        />
      ));
    });
    it('Save button is disabled', () => {
      expect(component.find('.PageModelForm__save-btn')).toBeDisabled();
    });
  });

  describe('if form is submitting', () => {
    let component;
    beforeEach(() => {
      component = shallow((
        <PageModelForm
          onSubmit={ON_SUBMIT}
          handleSubmit={HANDLE_SUBMIT}
          previewErrors={[]}
          submitting
          intl={mockIntl}
        />
      ));
    });
    it('Save button is disabled', () => {
      expect(component.find('.PageModelForm__save-btn')).toBeDisabled();
    });
  });

  describe('if form is valid', () => {
    let component;
    beforeEach(() => {
      component = shallow((
        <PageModelForm
          onSubmit={ON_SUBMIT}
          handleSubmit={HANDLE_SUBMIT}
          previewErrors={[]}
          invalid={false}
          intl={mockIntl}
        />
      ));
    });
    it('Save button is enabled', () => {
      expect(component.find('.PageModelForm__save-btn')).not.toBeDisabled();
    });
  });

  describe('validateJson function', () => {
    it('returns undefined if the string is in a valid JSON format', () => {
      expect(validateJson('{ "value": 4 }')).toBeUndefined();
    });

    it('returns an error string if the string is not in a valid JSON format', () => {
      expect(validateJson('this is not valid json!')).toMatch(/^Invalid JSON format/);
    });
  });

  describe('validatePreviewErrors function', () => {
    let component;
    beforeEach(() => {
      component = shallow((
        <PageModelForm
          onSubmit={ON_SUBMIT}
          handleSubmit={HANDLE_SUBMIT}
          previewErrors={[]}
          invalid={false}
          intl={mockIntl}
        />
      ));
    });
    it('returns undefined if previewErrors are empty', () => {
      const result = component.instance()
        .validatePreviewErrors(null, null, { previewErrors: [] });
      expect(result).toBeUndefined();
    });

    it('returns an array of react elements if preview errors is not empty', () => {
      const result = component.instance()
        .validatePreviewErrors(null, null, {
          previewErrors: [{ id: 'some_err' }],
        });
      expect(result).toBeInstanceOf(Array);
    });
  });
});
