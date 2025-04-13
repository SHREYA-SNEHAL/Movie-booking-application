const express=require('express');
const {users,movies,showtimes,theaters, sequelize, bookings}=require('./db');//import the users model
const {setUser}=require('./service/auth');
const router=express.Router();
const {restrictToLoggedinUserOnly,isAdmin}=require('./middlware/auth');


// Display registration form (GET /auth/register)
router.get("/register", (req, res) => {
    res.render("register");  // This will render register.ejs
});


//Users Registration
router.post("/register",async(req,res)=>{

    try{
        const {name,role,email,password}=req.body;

        //Validate Input
        if(!name || !role || !email  || !password){
            return res.status(400).json({success:false,message:"All fields are required"})
        }

        //Save  user to the database
        const user=await users.create({
            name,
            role,
            email,
            password,
        });
        res.status(201).json({success:true ,message:"User registered successfully!"});

    }catch(error){

        res.status(500).json({success:false,message:"Register failed",error:error.message});
    }
});


//User Login

router.post("/login",async(req,res)=>{

    const {email,password}=req.body;

    const user=await users.findOne({where:{email}});
    if(!user){
        return res.json({message:"Invalid Username or Password"});
    }

    if (user.password!=password) {
        return res.json({message:"Invalid Username or Password"});
    }
    
    const token =setUser(user);
    res.cookie("uid",token);

    return res.json({message:"Login Successfully"});
});

router.get("/login", (req, res) => {
    res.render("login");  // This will render register.ejs
});

//View Profile
router.get("/profile",restrictToLoggedinUserOnly,async(req,res)=>{
    try{
        // Find the user in the database using their ID from the request (req.user.id)
        const user=await users.findByPk(req.user.id,{
            // Exclude the password field from the returned data for security
            attributes:{exclude:["password"]}
        });
     

        if(!user){
            return res.status(404).json({error:"User not found!"});
        }
    
        res.json(user);
    }catch(error){
        res.status(500).json({error:"Failed to fetch profile",details:error.message});
    }

});

//Update Profile
//pass name,email by json

router.put("/update-users",restrictToLoggedinUserOnly,async(req,res)=>{
    try{
        const{name,email}=req.body;
        console.log("User ID:",req.user.id);

        //Update user details
        const user=await users.findByPk(req.user.id);
        if(!user){
            return res.status(404).json({error:"User not found!"});
        }

        user.name= name || user.name;
        user.email= email || user.email;
        await user.save();

        res.json({message:"Profile updated ssuccessfully!",user});

    }catch(error){
        res.status(500).json({error:"Failed to update profile",details:error.message});
    }
});


//for Add new Movies table
//pass title,duration, genre, release_date,language by json in postman
router.post('/new-movies',restrictToLoggedinUserOnly,isAdmin,async(req,res)=>{
    try {
        const{title,duration, genre, release_date,language}=req.body;

        //Ensure required fields exist
        if(!title || !genre || !duration || !release_date || !language){
            return res.status(400).json({message:"All fields are required"});
        }

        const movie=await movies.create({
            title,
            genre,
            release_date,
            duration,
            language,
            addedBy:req.user.id
            
        });

        res.status(201).json(movie);

    } catch (error) {
        res.status(500).json({message:'Error creating movie',error:error.message});
        
    }
});

//Update details of movies
//pass id,title,duration by json 

router.put('/update-movies',restrictToLoggedinUserOnly,isAdmin,async(req,res)=>{
    try {
        const{id,title,duration}=req.body;
        

        if (!id) {
            return res.status(400).json({ message: "Movie ID is required" });  // ✅ Ensure ID is provided
        }

        console.log("Movie ID:", id); 

        //This help in ensuring admin only update movies that they added
        const movie=await movies.findOne({
            where:{
                id:id,
                addedBy:req.user.id
            }
        });
        if(!movie){
            return res.status(404).json({message:"Movie not found"});

        }
        movie.title= title || movie.title;
        movie.duration= duration || movie.duration;
        await movie.save();

        res.json({message:"Movie updated ssuccessfully!",movie});

    } catch (error) {
        res.status(500).json({ message: 'Error updating movie' });
    }
});

//Delete movies
//pass id by json

router.delete('/delete-movies',restrictToLoggedinUserOnly,isAdmin,async(req,res)=>{
    try{
        const {id}=req.body;

        if (!id) {
            return res.status(400).json({ message: "Movie ID is required" });
        }

        const movie=await movies.findOne({
            where:{
                id:id,
                addedBy:req.user.id
            }
        });

        if(!movie){
            return res.status(404).json({message:"Movie not found or unauthorised"});
        }

        await movie.destroy();
        res.json({message:"Movie deleted successfully!"});
    }catch(error){
        res.status(500).json({message:"Error deleting movie",error:error.message});
    }

});

//Fetch movies details(get not use body so use post for fetch) it fetch all movie by id
//regardless who can added them (pass id by json)

router.post('/fetch-movies',restrictToLoggedinUserOnly,isAdmin,async(req,res)=>{
    try{
        const {id}=req.body;

        if(!id){
            return res.status(400).json({message:"Movie Id is required"});
        }

        const movie=await movies.findOne({
            where:{
                id:id
                
            }
        });

        if(!movie){
            return res.status(404).json({message:"Movie not found or unauthoriesd"});
        }

        res.json(movie);
    }catch(error){
        res.status(500).json({message:"Error fetching movie",error:error.message});
    }
});

//Browse all movies(with pagination), pass page and limit by json
//Allow all user to view no any restrication is there
//Search/filter movies by genre,language,or release_date
//for filter pass genre,language,or release_date(anyone or all) by json

router.post('/browse',async(req,res)=>{
    try{
        //read page and limit from request body
        //default page=1 and limit =5
        const{page=1, limit=5,genre,language,release_date }=req.body;

        //how many movie to skip
        const offset=(page-1)*limit;

        //Build dynamic filter object
        const whereClause={};
        if(genre) whereClause.genre=genre;
        if(language) whereClause.language=language;
        if(release_date) whereClause.release_date=release_date;

        const{ count,rows:movielist}=await movies.findAndCountAll({
            where:whereClause, //Filters applied here
            offset:offset,
            limit:limit,
            order:[['release_date','DESC']],
            attributes:{exclude:['addedBy']}
        });

        res.json({
            totalMovies:count,
            currentPage:page,
            totalPages:Math.ceil(count/limit),
            movies:movielist
        });
    }catch(error){
        res.status(500).json({message:"Error fetching movies",error:error.message});
    }
});

//For add new theaters
//pass id,name,location by json

router.post('/Add-Theaters',restrictToLoggedinUserOnly,isAdmin,async(req,res)=>{
    try{
        
        const{id,name,location}=req.body;

        if(!id || !name || !location){
            return res.status(400).json({message:"All fields are required"});
        }

        const theater=await theaters.create({
            id,
            name,
            location
        });
        res.status(201).json({message:"Theater created successfully!",theater});

    }catch(error){
        res.status(500).json({message:"Error Creating showtime",error:error.message});
    }
});

//For add new Showtimes
//pass id,movie_id,theater_id,date,time,price,total_seats,available_seats by json

router.post('/Add-Showtimes',restrictToLoggedinUserOnly,isAdmin,async(req,res)=>{
    try{
        
        const{id,movie_id,theater_id,date,time,price,total_seats,available_seats}=req.body;

        if(!id || !movie_id || !theater_id || !date || !time || !price || !total_seats || !available_seats){
            return res.status(400).json({message:"All fields are required"});
        }

        const showtime=await showtimes.create({
            id,
            movie_id,
            theater_id,
            date,
            time,
            price,
            total_seats,
            available_seats
        });
        res.status(201).json({message:"Showtime created successfully!",showtime});

    }catch(error){
        res.status(500).json({message:"Error Creating showtime",error:error.message});
    }
});

//View all showtimes
//pass title(movie) from json

router.post('/showtimes',async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Movie title is required" });
        }

        //Find the movie by title
        const movie=await movies.findOne({
            where:{ title },
            //fetch only this column
            attributes:['id','title']
        });

        if(!movie){
            return res.status(404).json({message:"Movie not found"});
        }

        // Get all showtimes for that movie with theater info
        const showtime = await showtimes.findAll({
            where: { movie_id:movie.id },
            //show only this detail from Showtime
            attributes:['id','theater_id','date','time','price','total_seats','available_seats'],
            //join theaters with showtime based on association
            include:[{
                model:theaters,
                attributes:['name','location']
            }],

            order:[['id','ASC']]
           
        });

        if (showtime.length === 0) {
            return res.status(404).json({ message: "No showtimes available for this movie" });
        }

        res.json({
            movie_id:movie.id,
            title: movie.title,
            Showtime:showtime
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching showtimes", error: error.message });
    }
});

//Select Seats and Book tickets

router.post('/book',async(req,res)=>{
    const{user_id, movie_title, theater_name, date, time, seats_booked}=req.body;

    if(!user_id || !movie_title || !theater_name || !date || !time || !seats_booked){
        return res.status(400).json({message:"Missing booking data"});
    }

    try{
        //Get theater
        const theater=await theaters.findOne({
            where:{name:theater_name}
        });
        if(!theater) return res.status(404).json({message:"Theater not found"});

        //Get movie
        const movie=await movies.findOne({
            where:{title:movie_title}
        });

        //Get showtime
        const showtime =await showtimes.findOne({
            where:{
                
                movie_id:movie.id,
                theater_id:theater.id,
                date,
                time
            }
        });
        if(!showtime) return res.status(404).json({message:"Showtime not found"});
        
        //check available seats
        if(showtime.available_seats<seats_booked.length){
            return res.status(409).json({message:"Not enough seats avilable"})
        }

        const total_price=showtime.price*seats_booked.length;

        //Book inside transaction
        const booking=await sequelize.transaction(async(t)=>{
            const newBooking=await bookings.create({
                user_id,
                showtime_id:showtime.id,
                seats_booked: seats_booked.join(','), // store as comma-separated string
                total_price,
                status:"confirmed"

            },{transaction:t});

            await showtimes.update(
                {available_seats:showtime.available_seats-seats_booked.length},
                {
                    where:{
                        id:showtime.id,
                        
                    },transaction:t
                }
            );
            return newBooking;
        });

        res.json({message:"Booking successful",booking});

    }catch(error){
        res.status(500).json({message:"Booking failed",error:error.message});
    }
});

//View booking history 
//pass userid
router.get('/booking',async(req,res)=>{
    const{user_id}=req.body;
    if(!user_id) return res.status(400).json({message:"User id is required"});

    try{

        const history=await bookings.findAll({
            where:{
                user_id:user_id,
            }
        });
        if(!history) return res.status(404).json({message:"History not found"});

        res.json({history});

    }catch(error){
        res.status(500).json({message:"History Not Found",error:error.message});

    }
});

module.exports=router;