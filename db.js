const { name } = require('ejs');
const{Sequelize,DataTypes, ENUM, Association}=require('sequelize');

//Create a Sequelize instance
const sequelize=new Sequelize('db','root','Shreya@19',{
    host:'localhost',
    dialect:'mysql',
});

//Define The Model(User Management)
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

//Movie Management
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
//User-Movie(Relationship)

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


//Ticket Booking
//Theatres table

const theaters=sequelize.define('theaters',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },

    name:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false,
    },

    location:{
        type:DataTypes.STRING,
        allowNull:false,
    },

    },{
        tableName:'Theaters',
        timestamps:true  //adds createdAt and updatedAt automatically
    
});

//Showtime table

const showtimes=sequelize.define('showtimes',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,

    },

    movie_id:{
        type:DataTypes.INTEGER,
        allowNull:false,

    },

    theater_id:{
        type:DataTypes.INTEGER,
        allowNull:false,

    },

    date:{
        type:DataTypes.DATEONLY,
        allowNull:false,

    },

    time:{
        type:DataTypes.TIME,
        allowNull:false,

    },

    price:{
        type:DataTypes.FLOAT,
        allowNull:false,

    },

    total_seats:{
        type:DataTypes.INTEGER,
        allowNull:false,

    },

    available_seats:{
        type:DataTypes.INTEGER,
        allowNull:false,

    },
},{
    tableName:'Showtimes',
    timestamps:true
});

//Booking Model

const bookings=sequelize.define('bookings',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,

    },

    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,

    },

    showtime_id:{
        type:DataTypes.INTEGER,
        allowNull:false,

    },

    seats_booked:{
        type:DataTypes.TEXT,
        allowNull:false,

    },

    total_price:{
        type:DataTypes.FLOAT,
        allowNull:false,

    },

    status:{
        type:DataTypes.ENUM('confirmed','cancelled'),
        allowNull:false,
        defaultValue:'confirmed',

    },


},{
    tableName:'Bookings',
    timestamps:true
});

//Showtime-Movie and Theater(Relationship)
showtimes.belongsTo(movies,{foreignKey:'movie_id'});//connect automatically with id of movies table
//not need to create movie_id in movies table ,create it only in showtime table
showtimes.belongsTo(theaters,{foreignKey:'theater_id'});
//it join theaters with each showtime//association
theaters.hasMany(showtimes,{foreignKey:'theater_id'});

//Booking-User and Showtime(Relationship)
bookings.belongsTo(users,{foreignKey:'user_id'});
bookings.belongsTo(showtimes,{foreignKey:'showtime_id'});

//Sync all 3(theaters,showtimes,bookings) table together

(async ()=>{
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        await sequelize.sync();//sync all
        console.log('All tables have been created successfully.');

    }catch(error){
        console.error('Unable to connect to the database:',error);
    }
})();

module.exports={sequelize,users,movies,theaters,showtimes,bookings};