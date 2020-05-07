const express = require("express");
const mongoose = require("mongoose");

const Test = require("../models/Test");

const testRouter = express.Router();

testRouter.route("/")
  .get((req, res) => {
    Test.find({}, function (err, tests) {
      if (err) throw err;
      res.status(200).json({tests: tests});
    });
  })

  .post(function (req, res) {
    Test.create(req.body, function (err, test) {
      if (err) throw err;

      res.status(201).json({test: test});
    });
  })

  .delete(function (req, res) {
    Test.remove({}, function (err, response) {
      if (err) throw err;
      res.json(response);
    });
  });

testRouter.route("/:testId")
  .get(function (req, res) {
    Test.findById(req.params.testId, function (err, test) {
      if (err) throw err;
      res.json(test);
    });
  })

  .put(function (req, res) {
    Test.findByIdAndUpdate(req.params.testId, {
      $set: req.body
    }, {
      new: true
    }, function (err, test) {
      if (err) throw err;
      res.json(test);
    });
  })

  .delete(function (req, res) {
    Test.findByIdAndRemove(req.params.testId, function (err, response) {
      if (err) throw err;
      res.json(response);
    });
  });

module.exports = testRouter;
