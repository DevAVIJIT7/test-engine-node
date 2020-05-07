const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  end_date: {
    type: Date,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
}, {
  timestamps: true
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;