import { Octokit} from "@octokit/rest";
import * as dotenv from 'dotenv'
dotenv.config()

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  version: "latest",
});

async function dependency(owner, repo) {
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path: "package-lock.json"
    });
  //console.log(response.data)
  const packageJson = JSON.parse(Buffer.from(response.data["content"], 'base64').toString('utf8'));
  const dependencies = packageJson.dependencies;

  // TESTING
  // for(let i = 0; i < 1; i++){
  //   const [l1, m1, s1] = vers.toString().split('.')
  //   const findIt = vers.toString().indexOf(("-"))
  //     if ((m1 == undefined) && (s1 == undefined)) {
  //       console.log("not correct")
  //       break;
  //     }
  //     else if (findIt != -1){
  //       console.log("not correct")
  //       break;
  //     }
  //     else{
  //       console.log("correct")
  //       break;
  //     }
  //   }

  let notPinned = 0;
  let pinned = 0;
  for (const [dependencyName, version] of Object.entries(dependencies)) {
    const [large, med, small] = version["version"].toString().split('.')
    const finder = version["version"].toString().indexOf("-")
    //ADD CARROT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    //if it is in form "1"
    if ((med == undefined) && (small == undefined)){
      notPinned++
    }
    //if it is in form 1.0-3.2
    else if (finder != -1 ){
      notPinned++
    }
    //otherwise it is in an acceptable format
    else {
      pinned++
    }
  }

  //total num of dependencies
  const numberOfDependencies = Object.keys(dependencies).length;
  // console.log(`counter = ${counter}`)
  // console.log(`The Git repository has ${numberOfDependencies} dependencies.`);
  //
    if (numberOfDependencies == 0) {
      console.log('1.0')
    } else {
      const val = pinned / numberOfDependencies
      console.log(val)
    }

  }
  catch(error) {
    const resp1 = await octokit.repos.getContent({
      owner,
      repo,
      path: "package.json"
    });
    const packageJson = JSON.parse(Buffer.from(resp1.data["content"], 'base64').toString('utf8'));

    const dependencies = packageJson.dependencies;


    let notPinned = 0
    let pinned = 0

    for (const version of Object.entries(dependencies)) {
      //finding out if it is larger than pinned dependency
      const [large, med, small] = version["version"].toString().split('.')
      const finder = version["version"].toString().indexOf("-")
      //ADD CARROT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      //if it is in form "1"
      if ((med == undefined) && (small == undefined)){
        notPinned++
      }
      //if it is in form 1.0-3.2
      else if (finder != -1 ){
        notPinned++
      }
      //otherwise it is in an acceptable format
      else {
        pinned++
      }
    }

      //total num of dependencies
      const numberOfDependencies = Object.keys(dependencies).length;

        if (numberOfDependencies == 0) {
          console.log('0.0')
        } else {
          const val = pinned / numberOfDependencies
          console.log(val)
        }
    }

}

dependency("nullivex", "nodist")