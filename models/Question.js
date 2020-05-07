const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  test_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test"
  },    
  options: [Schema.Types.Mixed],
  correct_answer_index: {
    type: Number,
    required: true
  },
  correct_answer_text: String
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;