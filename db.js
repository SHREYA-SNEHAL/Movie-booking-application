const{Sequelize,DataTypes}=require('sequelize');

//Create a Sequelize instance
const sequelize=new Sequelize('db','root','Shreya@19',{
    host:'localhost',
    dialect:'mysql',
});

//Define The Model
const users=sequelize.define('users',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
         
    },

    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },

    email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false,
    },

    password:{
        type:DataTypes.STRING,
        allowNull:false,
    },

    // role:{
    //     type:DataTypes.STRING,
    //     allowNull:false,


    // },

    // created_at:{
    //     type:DataTypes.DATE,
        
    // },

    // updated_at:{
    //     type:DataTypes.DATE,
    // },

},{
    tableName:'Users',
    timestamps:false,
});

//Test the connection
(async()=>{
    try{
        await sequelize.authenticate();
        console.log('Connection has been establised sucessfully.');
        // Synchronize the model with the database
        await users.sync(); // `force: true` will drop the table if it already exists
        console.log('The table has been created successfully.');
    }
    catch(error){
        console.error('Unable to connect to the database:',error);
    }
})();

module.exports={sequelize,users};