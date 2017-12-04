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

const WordLimit = 400;
export const checkItemsUnderWordCount = (values) => {
    if (values.length > 0) {
        var wordCount = values.map(function(itemData) {
            var strippedText = stripHtml(itemData.body);
            return strippedText.split(" ").length;
        });

        var totalCount = wordCount.reduce(function (total, num) {
            return total + num;
        });

        if (totalCount <= WordLimit) {
            return Promise.resolve(true);
        } else {
            const error = new FieldError('too-long', `You\'ve reached the word limit on this atom type. Please edit your items to less than a total of ${WordLimit} words.`);
            return Promise.resolve(error);
        }

    }
};

function stripHtml(rawBody) {
  return rawBody.replace(/<{1}[^<>]{1,}>{1}/g,"");
}

