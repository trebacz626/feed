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
  Put:"put",
  Delete:"delete"
}
Activity.AuthLevels={
  Guest:0,
  User:1,
  IngredientModerator:2,
  DishModerator:3
  Admin:10
}

module.exports=Activity;
