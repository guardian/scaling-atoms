import FieldError from '../constants/FieldError';
/**
 *
 * Validator should return a promise resolved with true for a pass and a new FieldError('error', 'message') if false
 *
 **/


export const isHttpsUrl = (value) => {
  const stringValue = typeof value === 'string' ? value : '';
  if (stringValue.match(/^(https:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
    return Promise.resolve(true);
  } else {
    const error = new FieldError('not-https', 'Not a HTTPS url');
    return Promise.resolve(error);
  }
};

export const checkItemsUnderWordCount = (values) => {
    if (values.length > 0) {
        var wordCountList = values.map(function(itemData) {
            return stripHtml(itemData.body).length;
        });

        var totalCount = wordCountList.reduce(function (total, num) {
            return total + num;
        });

        if (totalCount <= 400) {
            return Promise.resolve(true);
        } else {
            const error = new FieldError('too-long', 'You\'ve reached the word limit on this atom type');
            return Promise.resolve(error);
        }

    }
};

function stripHtml(rawBody) {
  return rawBody.replace(/<{1}[^<>]{1,}>{1}/g,"");
}

