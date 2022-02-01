// Examples
export const SET_USER_NAME = 'SET_USER_NAME';
export const SET_USER_AG = 'SET_USER_AGE';

export const setName = name => dispatch => {
  dispatch({
    type: SET_USER_NAME,
    payload: name,
  });
};

export const setAge = age => dispatch => {
  dispatch({
    type: SET_USER_NAME,
    payload: age,
  });
};
