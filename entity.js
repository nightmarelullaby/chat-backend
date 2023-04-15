const users = []

const addUsers = (name,room,id=null) => {
    console.log(name,room,id, "this is the info")
    if(users.find(e => e.name === name)){
        console.log("lo siento, el usuario ya existe...",users)
        return false;
    }   else{
        users.push({
            name:name,
            room:room,
            id:id
        }) 
        console.log(users)
        return true;
    }

}

const getUser = (id) => {
    try{
        const usersFiltered = users.filter(e => e.id.includes(id))
        return {data:usersFiltered,res:true}
    } catch(err){
        return {data:null,res:false}
    }
}

const deleteUser = (id) => {
    users.splice(users.indexOf(users.find(e => e.id === id)),1)
}
const deleteUserByName = (name) => {
    if(name){
        try{
            users.splice(users.indexOf(users.find(e => e.name === name)),1)
            return {"status":200}
        } catch(err){
            return {"status":400}
        }
    }


}

const getUsersById = (id) => {
    const usersFiltered = users.filter(e => e.room === id)
    return usersFiltered
}
const checkUserExistence = (name) => {
    const res = users.some(e => e.name === name);
    if(res) return true
    return false;
}

module.exports = {
    addUsers,
    getUser,
    getUsersById,
    checkUserExistence,
    deleteUserByName,
    deleteUser,
    users
}