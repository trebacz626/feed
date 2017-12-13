var middlewares=require("../middleware.js");
module.exports=function(router){
  const fs = require('fs');
var controllers=[];
var router;
fs.readdirSync('./Controller').forEach(file => {
  if(file!='controllers.js'){
      controllers.push(require('./'+file));
  }

});
  for(let i=0;i<controllers.length;i++){

    if(!controllers[i].activities){
      continue;
    }

    for(let a=0;a<controllers[i].activities.length;a++){
      var tasks=[
        middlewares.checkData(controllers[i].activities[a].neededData),
        middlewares.authenticate(controllers[i].activities[a].authenticationLevel),
        controllers[i].activities[a].localMiddlewares,
        controllers[i].activities[a].task];
        var path=controllers[i].activities[a].special_path||"/"+controllers[i].name+'/'+controllers[i].activities[a].name;
        console.log(path+" "+controllers[i].activities[a].method);
        //console.log(tasks);
      switch(controllers[i].activities[a].method){
        case "get":
          router.get(path,tasks);
          break;
        case "post":
          router.post(path,tasks);
          break;
        case "put":
          router.put(path,tasks);
          break;
        case "delete":
          router.delete(path,tasks);
          break;
        default:
          router.use(path,tasks);

      }
      //console.log(router.params);
    }
  }
}
