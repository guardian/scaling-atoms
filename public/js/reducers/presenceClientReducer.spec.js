import presenceClient from './presenceClientReducer';

describe('presence reducer', () => {

  it('should return the initial state', () => {
    expect(
      presenceClient(undefined, {})
    ).toEqual({}, {});
  });

  it('should handle PRESENCE_STARTED', () => {
    expect(
      presenceClient({}, {
        type: 'PRESENCE_STARTED',
        presence: 'this is presence'
      })
    ).toEqual('this is presence');
  });
});
