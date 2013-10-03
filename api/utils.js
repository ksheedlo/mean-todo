module.exports = {
  createAPI: function (action) {
    return function (req, res) {
      var reqData = req.body || {};
  
      actionArgs = [function (err, data) {
        if (err) {
          res.statusCode = 500;
        }
        res.end(JSON.stringify(data));
      }];
      if (action.length == 2) {
        actionArgs.unshift(reqData);
      }
      action.apply(null, actionArgs);
    };
  }
};