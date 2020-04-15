import { add } from '../index';

describe('add', () => {
  it('expect to sum', () => {
    expect(add(5, 4)).toBe(9);
  });
});
