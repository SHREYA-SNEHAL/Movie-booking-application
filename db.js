const{Sequelize,DataTypes, ENUM, Association}=require('sequelize');

//Create a Sequelize instance
const sequelize=new Sequelize('db','root','Shreya@19',{
    host:'localhost',
    dialect:'mysql',
});

//Define The Model
//Table for Users
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

    role:{
        type:DataTypes.ENUM('user', 'admin'),
        allowNull:false,
        defaultValue:'user',


    },
    
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
        //Use `alter: true` to add the new column without deleting existing data
        await users.sync(); // `force: true` will drop the table if it already exists
        console.log('The table has been created successfully.');
    }
    catch(error){
        console.error('Unable to connect to the database:',error);
    }
})();

//Table for Movies
const movies=sequelize.define('movies',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,

    },

    title:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false,


    },

    description:{
        type:DataTypes.STRING,
    },

    genre:{
        type:DataTypes.STRING,
        allowNull:false,

    },

    duration:{
        type:DataTypes.INTEGER,
        allowNull:false,

    },

    release_date:{
        type:DataTypes.DATE,
        allowNull:false,

    },

    language:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    addedBy:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:users,
            key:'id'
        }
    },

    created_at:{
        type:DataTypes.DATE,

    },

    updated_at:{
        type:DataTypes.DATE,
        

    },

    
},{
    tableName:'Movies',
    timestamps:false,
});

//define Associations Here

users.hasMany(movies,{foreignKey:"addedBy"});
movies.belongsTo(users,{foreignKey:"addedBy"});

//Test the connection
(async()=>{
    try{
        await sequelize.authenticate();
        console.log('Connection has been establised sucessfully.');
        // Synchronize the model with the database
        await movies.sync(); // `force: true` will drop the table if it already exists
        console.log('The table has been created successfully.');
    }
    catch(error){
        console.error('Unable to connect to the database:',error);
    }
})();

module.exports={sequelize,users,movies};