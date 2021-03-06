import React from 'react';
import 'test/enzyme-init';
import { shallow } from 'enzyme';
import { history } from 'app-init/router';
import PageModelListMenuActions from 'ui/page-models/list/PageModelListMenuActions';

global.console.error = jest.fn();
const onClickDelete = jest.fn();
const PAGE_MODEL_CODE = 'page_model_code';

history.push = jest.fn();

beforeEach(jest.clearAllMocks);
describe('PageModelListMenuActions', () => {
  let component;

  describe('with no code', () => {
    beforeEach(() => {
      component = shallow(<PageModelListMenuActions />);
    });

    it('logs an error', () => {
      expect(global.console.error).toHaveBeenCalled();
    });
  });

  describe('basic rendering', () => {
    beforeEach(() => {
      component = shallow((
        <PageModelListMenuActions
          code={PAGE_MODEL_CODE}
          onClickDelete={onClickDelete}
        />
      ));
    });

    it('renders without crashing', () => {
      expect(component.exists()).toEqual(true);
    });

    it('has a dropdown with kebab button', () => {
      expect(component.find('DropdownKebab')).toHaveLength(1);
    });

    it('when clicking on the edit button, goes to the edit page model page', () => {
      const onClick = component.find('.PageModelListMenuActions__menu-item-edit').prop('onClick');
      onClick();
      expect(history.push).toHaveBeenCalledWith('/page-model/edit/page_model_code');
    });

    it('when clicking on the details button, goes to the page model details page', () => {
      const onClick = component.find('.PageModelListMenuActions__menu-item-details').prop('onClick');
      onClick();
      expect(history.push).toHaveBeenCalledWith('/page-model/view/page_model_code');
    });

    it('when clicking on the delete button, calls the onClickDelete function', () => {
      const onClick = component.find('.PageModelListMenuActions__menu-item-delete').prop('onClick');
      onClick();
      expect(onClickDelete).toHaveBeenCalled();
    });
  });
});
