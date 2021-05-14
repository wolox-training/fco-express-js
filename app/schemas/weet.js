const { score } = {
  score: {
    options: [-1, 1]
  }
};

exports.weetSchema = {
  score: {
    isInt: { errorMessage: 'score must be integer' },
    toInt: true,
    isIn: {
      errorMessage: `score must be in ${score.options}`,
      options: [score.options]
    }
  }
};
