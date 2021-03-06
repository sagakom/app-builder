import React from 'react';
import 'test/enzyme-init';
import { shallow } from 'enzyme';
import { LIST_DE_COMPONENTS_OK } from 'test/mocks/digital-exchange/components';
import ComponentListListView from 'ui/digital-exchange/components/list/ComponentListListView';
import ComponentImage from 'ui/digital-exchange/components/common/ComponentImage';
import StarRating from 'ui/digital-exchange/common/StarRating';


describe('ComponentListListView', () => {
  let component;
  beforeEach(() => {
    component = shallow(<ComponentListListView components={LIST_DE_COMPONENTS_OK} />);
  });


  it('renders without crashing', () => {
    expect(component.exists()).toEqual(true);
  });

  it('has 5 rows, 1 for each component', () => {
    expect(component.find('Row')).toHaveLength(5);
  });

  it('provided content is rendered properly', () => {
    LIST_DE_COMPONENTS_OK.forEach((componentData, index) => {
      // Checking if provided title is rendered.
      expect(component.find('h1').at(index).text()).toContain(componentData.name);

      // Checking if provided image is rendered.
      if (componentData.image) {
        const componentImageWrapper = component.find('.ComponentList_component-image-wrapper').at(index);
        expect(componentImageWrapper.html()).toContain(componentData.image);
      }

      // Checking if provided version is rendered.
      expect(component.find('.ComponentList__version').at(index).text()).toContain(componentData.version);

      // // Checking if provided rating is rendered.
      const starRatingRendered = component.find('.ComponentList__rating').at(index).render();
      expect(starRatingRendered.find('.StarIcon')).toHaveLength(Math.ceil(componentData.rating));

      // Checking if provided description is rendered.
      expect(component.find('.ComponentList__description').at(index).text()).toEqual(componentData.description);
    });
  });
});
