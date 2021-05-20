exports.postWeetSerializer = ['id', 'content', 'userId', 'createdAt'];

exports.getWeetsSerializer = [{ weets: [this.postWeetSerializer] }];

exports.rateWeetSerializer = ['id', 'userId', 'weetId', 'score', 'updatedAt'];
