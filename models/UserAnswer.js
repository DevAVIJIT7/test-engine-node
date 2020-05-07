const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userAnswerSchema = new Schema({
  test_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test"
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
  submission_date: {
    type: Date,
    required: true
  },
  user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
  },    
  chosen_options_index: [Number],
  chosen_options_text: [Schema.Types.Mixed]
}, {
  timestamps: true
});

const UserAnswer = mongoose.model("UserAnswer", userAnswerSchema);

module.exports = UserAnswer;