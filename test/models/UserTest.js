const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

//Importing our todo model for our unit testing.
const User = require('../../models/User');

describe('toJSON', function() {
  it('expect _id, email, username, firstName, lastName, tokens', function(done) {
    let userMockObj = sinon.mock(User);    
    let expectedResult = {_id: "dummy-id", email: "dummy-email", username: "dummy-username", 
      firstName: "dummy-fName", lastName: "dummy-lName", tokens: []};
    
    userMockObj.expects('toJSON').yields(null, expectedResult);
    userMockObj.toJSON(function (err, result) {
      userMockObj.verify();
      userMockObj.restore();
      expect(result.status).to.be.true;
      done();
    });
  });
});