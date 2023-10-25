//DEVO SISTEMARE, TIPO METTERE MONGOOSE

try {
    const collection = await database.collection("users")
    await collection.updateOne({ 
        email: req.user.email},
        { $set: {
            usage: {
            latestRequestDate: new Date().toLocaleDateString(),
            numberOfRequests: result[0].usage.numberOfRequests + 1 
        }}
        });
    
} catch (e) {
    console.log(e)
}