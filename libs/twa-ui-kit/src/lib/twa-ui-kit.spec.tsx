import { render } from '@testing-library/react';

import TwaUiKit from './twa-ui-kit';

describe('TwaUiKit', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TwaUiKit />);
    expect(baseElement).toBeTruthy();
  });
});
