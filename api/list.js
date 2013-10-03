module.exports = function (mongoose) {

  var Entry = mongoose.model('Entry', {
    text: String,
    timestamp: Date,
    due: Date
  });
 
  return {
    getTodoList: function (params, callback) {
      Entry.find({}, 'text due', function (err, entries) {
        if (err) {
          callback(err, { type: 'error' });
        } else {
          callback(undefined, entries);
        }
      });
    },
    addTodoListItem: function (item, callback) {
      var timestamp = new Date(),
        entryParams = {
          text: item.text,
          due: new Date(item.due),
          timestamp: timestamp
        },
        entry = new Entry(entryParams);
      
      console.log('Got a request: ' + JSON.stringify(item)); 
      entry.save(function (err, result) {
        console.log('saved entry: ' + JSON.stringify(entry));
        if (err) {
          callback(err, { type: 'error' });
        } else {
          callback(undefined, result);
        }
      });
    }
  };
};