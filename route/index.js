// Generated by CoffeeScript 1.6.3
var index,
  _this = this;

index = function(req, res) {
  res.render('index.ect', {
    user: req.user
  });
};

module.exports = {
  index: index
};
