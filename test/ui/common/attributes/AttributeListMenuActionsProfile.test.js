import React from 'react';
import 'test/enzyme-init';
import { shallow } from 'enzyme';

import AttributeListMenuActionsProfile from 'ui/common/attributes/AttributeListMenuActionsProfile';

const onMoveUp = jest.fn();
const onMoveDown = jest.fn();
const onClickDelete = jest.fn();
const PROFILE_TYPE_CODE = 'PFL';


describe('AttributeListMenuActionsProfile', () => {
  let component;
  beforeEach(() => {
    component = shallow(<AttributeListMenuActionsProfile
      code="attribute_code"
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onClickDelete={onClickDelete}
      routeToEdit=""
      profiletypeCode={PROFILE_TYPE_CODE}
      datatypeCode="code"
    />);
  });

  it('errors without a code', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    shallow(<AttributeListMenuActionsProfile />);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockReset();
    consoleError.mockRestore();
  });

  it('renders without crashing', () => {
    expect(component.exists()).toEqual(true);
  });

  it('has a drop down with kebab button', () => {
    expect(component.find('DropdownKebab')).toHaveLength(1);
  });

  it('on item-move-up clicked should call onMoveUp', () => {
    component.find('.AttributeListMenuAction__menu-item-move-up')
      .simulate('click');
    expect(onMoveUp).toHaveBeenCalled();
  });

  it('on item-move-up clicked should call onMoveDown', () => {
    component.find('.AttributeListMenuAction__menu-item-move-down')
      .simulate('click');
    expect(onMoveDown).toHaveBeenCalled();
  });

  it('on item-delete clicked should call onClickDelete', () => {
    component.find('.AttributeListMenuAction__menu-item-delete')
      .simulate('click');
    expect(onClickDelete).toHaveBeenCalled();
  });
});
