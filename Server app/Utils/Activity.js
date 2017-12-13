var Activity = function(){
  this.name="";
  this.special_path=null;
  this.method="";
  this.task=function(req,res,next){next()};
  this.neededData=[];
  this.authenticationLevel=Activity.AuthLevels.Guest;
  this.localMiddlewares=[];
}

Activity.Methods={
  Get:"get",
  Post:"post",
  Update:"update",
  Delete:"delete"
}
Activity.AuthLevels={
  Guest:0,
  User:1,
  Moderator:2,
  Admin:10
}

module.exports=Activity;
