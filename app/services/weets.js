const { default: Axios } = require('axios');

exports.getQuote = async () => {
  const { data } = await Axios.get('https://geek-jokes.sameerkumar.website/api?format=json');
  return data;
};
