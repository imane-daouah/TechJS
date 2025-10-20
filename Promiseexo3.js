function fun(){
    console.log("Program Started")
    const promise = new Promise((resolve)=>{
        setTimeout(() => {(resolve("Promise Resolved"))}, 3000);
       
    })

    console.log(promise)

    console.log("Program in progress")
    
    promise.then(()=>{
        console.log("Step 1 complete")
        return new Promise((resolve)=>{
            setTimeout(() => {
                resolve("Step 1 resolved")
            }, 3000);
        })
    }).then(()=>{
        setTimeout(() => {
            console.log("Step 2 complete")
        },3000);
    })
}


fun();