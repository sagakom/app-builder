import React from 'react';

import 'test/enzyme-init';
import { shallow } from 'enzyme';
import PageModelEditPage from 'ui/page-models/edit/PageModelEditPage';


describe('PageModelEditPage', () => {
  beforeEach(jest.clearAllMocks);

  let component;
  beforeEach(() => {
    component = shallow(<PageModelEditPage />);
  });

  it('renders without crashing', () => {
    expect(component.exists()).toBe(true);
  });

  it('is an InternalPage', () => {
    expect(component.first().is('InternalPage')).toBe(true);
  });

  it('has the PageModelEditPage class', () => {
    expect(component.first().hasClass('PageModelEditPage')).toBe(true);
  });
});
