import React from 'react';
import 'test/enzyme-init';

import ListFragmentPage from 'ui/fragments/list/ListFragmentPage';
import { shallowWithIntl } from 'test/testUtils';

describe('ListFragmentPage', () => {
  let component;
  beforeEach(() => {
    component = shallowWithIntl(<ListFragmentPage />);
  });

  it('renders without crashing', () => {
    expect(component.exists()).toEqual(true);
  });

  it('verify if the InternalPage has class ListFragmentPage', () => {
    expect(component.find('InternalPage').hasClass('ListFragmentPage')).toEqual(true);
  });

  it('has a breadcrumb', () => {
    expect(component.find('Breadcrumb')).toHaveLength(1);
  });

  it('has a page title', () => {
    expect(component.find('PageTitle')).toHaveLength(1);
  });

  it('has a FragmentListContent has default', () => {
    expect(component.find('FragmentListContent').exists()).toBe(true);
  });

  it('has a SettingsFragmentForm if settings tab is active', () => {
    component.setState({ activeTab: 'settings' });
    expect(component.find('FragmentListContent').exists()).toBe(false);
  });
});
