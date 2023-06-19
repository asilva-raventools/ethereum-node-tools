export const cmd = (command:string) => {

  const exec = require('child_process').exec;

  return new Promise((resolve) => {
    exec(command, (error:any, stdout:any, stderr:any) => {
            
      if (error) console.warn(error);
        
      resolve(stdout? stdout : stderr);
    });
  });
}