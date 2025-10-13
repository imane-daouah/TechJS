function fun(){
    console.log("Program Started")
    const promise = new Promise((resolve,reject)=>{
        setTimeout(() => {(resolve("Promise Resolved"))}, 3000);
        setTimeout(() => {reject(new Error("Promise Rejected"))}, 2000);
    })

    console.log(promise)

    console.log("Program in progress")
    
    promise.then(()=>{
        console.log("Program complete")
    }).catch(()=>{
        console.log("Program failed")
    })
}


fun();