const db = require('../db')
const Model = require('./model-helper')
const FamilyMember = require(__server + '/models/familymembers')

const FamilyHistory = new Model('familyhistory', ['id_famhist', 'id_familymember', 'condition'])
module.exports = FamilyHistory


/* GET ALL BY FAMILYMEMBER
  Returns an array of all family history records corresponding to one family member
*/
FamilyHistory.getAllByFamilyMember = function(id_familymember) {
  return this.findByAttribute('id_familymember', id_familymember)
}


/* GET ALL BY USER
  Returns an array of all family history records corresponding to the user
*/

FamilyHistory.getAllByUser = function(id_user) {

    return db.select("*")
    .from('familymembers')
    .fullOuterJoin("familyhistory", "familymembers.id_familymember", "familyhistory.id_familymember")
    .where('id_user', id_user)
    .then(function(result){
      console.log('Result of getAllByUser: ', result);
      return result;
    })
}


