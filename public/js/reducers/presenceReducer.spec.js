import presence from './presenceReducer';

describe('presence reducer', () => {

  it('should return the initial state', () => {
    expect(
      presence(undefined, {})
    ).toEqual({}, {});
  });

  it('should handle PRESENCE_STARTED', () => {
    expect(
      presence({}, {
        type: 'PRESENCE_STARTED',
        presence: 'this is presence'
      })
    ).toEqual('this is presence');
  });
});
