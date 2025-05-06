import express from "express";
import mongoose from "mongoose";
import cors from "cors";

//Configure the express server.
const app = express();

//Middleware
app.use(express.json());
app.use(cors());

// Connect the database
try {
  mongoose.connect(
    "mongodb://deepakbohara048:JmJroRdz5qtqYfKc@ac-zzqouwz-shard-00-00.ts9cgmf.mongodb.net:27017,ac-zzqouwz-shard-00-01.ts9cgmf.mongodb.net:27017,ac-zzqouwz-shard-00-02.ts9cgmf.mongodb.net:27017/?replicaSet=atlas-105fte-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("Database connected successfully");
} catch (error) {
  console.log("Database connection failed");
}

app.get("/", (req, res) => {
  res.send("Hello from blog server nodemon reset 123");
});

//Blog Schema
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  authorName: { type: String, required: true },
  categoryName: { type: String, required: false },
  timeToRead: { type: Number, required: true },
});
//Table
const Blog = mongoose.model("Blog", blogSchema);

//Writer Schema
const writerSchema = new mongoose.Schema({
  fullName: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true, unique: true },
  address: { type: String, required: false, unique: false },
  age: { type: Number, required: false, unique: false },
});

//Table
const Writer = mongoose.model("Writer", writerSchema);

// Feature Schema
const featureSchema= new mongoose.Schema({
  title: {type: String, required:true, unique: true },
  description: {type: String, required:true}
  
});

//table
const Feature= mongoose.model("Feature", featureSchema);

//Routes

//1.Create a new blog
app.post("/create-blog", async (req, res) => {
  try {
    //check the title already taken or not

    const blogExist = await Blog.findOne({ title: req.body.title });
    if (blogExist) {
      return res.status(409).json({
        success: false,
        msg: "Blog with this title already exist,please choose another title",
        data: null,
      });
    }

    const createdBlog = await Blog.create(req.body);
    return res.status(201).json({
      success: true,
      msg: "Blog created sucessfully",
      data: createdBlog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
      data: null,
      error: error,
    });
  }
});

//2. Get all blogs
app.get("/get-all-blogs", async (req, res) => {
  try {
    const allBlogs = await Blog.find();
    return res.status(200).json({
      success: true,
      msg: "All blog fetched successfully",
      data: allBlogs,
    });
  } catch (error) {
    console.log("Opps Something Went Wrong");
    return res.status(500).json({
      success: false,
      msg: "some thing went wrong",
      data: null,
    });
  }
});

//3. Get single blog
app.get("/get-single-blog/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        msg: "Blog not found",
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      msg: "Single blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Oops! Something went wrong",
      data: null,
      error: error,
    });
  }
});

//4. Update a blog
app.patch("/update-blog/:id", async (req, res) => {
  try {
    const updateBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      msg: "Update Success",
      data: updateBlog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Oops! Something went wrong",
      data: null,
      error: error,
    });
  }
});

//5. Delete a blog
app.delete("/delete-blog/:id", async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        msg: "Blog not found",
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      msg: "Blog deleted successfully",
      data: deletedBlog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Oops! Something went wrong",
      data: null,
      error: error,
    });
  }
});

//Writer Routes

//1.Create
app.post("/create-writer", async (req, res) => {
  try {
    const emailMatch = await Writer.findOne({ email: req.body.email });
    if (emailMatch) {
      return res.status(409).json({
        success: false,
        msg: "Email already taken please take author email",
        data: null,
      });
    }

    //Check phone taken or not
    const phoneMatch = await Writer.findOne({ phone: req.body.phone });
    if (phoneMatch) {
      return res.status(409).json({
        success: false,
        msg: "Phone already taken please take author email",
        data: null,
      });
    }
    const writer = await Writer.create(req.body);
    return res.status(201).json({
      success: true,
      msg: "create success",
      data: writer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "create failed",
      data: null,
      error: error,
    });
  }
});

//2.Fetch all
app.get("/get-all-writer", async (req, res) => {
  try {
    const allWriter = await Writer.find();

    return res.status(200).json({
      success: true,
      msg: "Fetch all writer success",
      data: allWriter,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Fetch all writer failed",
      data: null,
      error: error,
    });
  }
});

//3.Fetch one
app.get("/get-single-writer/:id", async (req, res) => {
  try {
    const fetchedWriter = await Writer.findById(req.params.id);
    if (!fetchedWriter) {
      return res.status(404).json({
        success: false,
        msg: "Not found",
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      msg: "Get one success",
      data: fetchedWriter,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch single writer",
      data: null,
      error: error,
    });
  }
});

//4.Update writer
app.patch("/update-writer/:id", async (req, res) => {
  try {
    const updatedWriter = await Writer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedWriter) {
      return res.status(404).json({
        success: false,
        msg: "Writer with this id doesnot found",
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      msg: "update success",
      data: updatedWriter,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Failed to update",
      data: null,
      error: error,
    });
  }
});

//5.Delete writer
app.delete("/delete-writer/:id", async (req, res) => {
  try {
    const deletedWriter = await Writer.findByIdAndDelete(req.params.id);

    if (!deletedWriter) {
      return res.status(404).json({
        success: false,
        msg: "Writer with this id doesnot found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Delete success",
      data: deletedWriter,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Failed to delete",
      data: null,
      error: error,
    });
  }
});

//Feature Routes

//1. Create feature
app.post("/create-feature", async (req, res) => {
  try {
    //check the title already taken or not

    const featureExist = await Blog.findOne({ title: req.body.title });
    if (featureExist) {
      return res.status(409).json({
        success: false,
        msg: "Feature with this title already exist,please choose another title",
        data: null,
      });
    }

    const createdFeature = await Blog.create(req.body);
    return res.status(201).json({
      success: true,
      msg: "Feature created sucessfully",
      data: createdFeature,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
      data: null,
      error: error,
    });
  }
});
 
//2.Get-all-features
app.get("/get-all-features", async (req, res) => {
  try {
    const allFeatures = await Feature.find();
    return res.status(200).json({
      success: true,
      msg: "All feature fetched successfully",
      data: allFeatures,
    });
  } catch (error) {
    console.log("Opps Something Went Wrong");
    return res.status(500).json({
      success: false,
      msg: "some thing went wrong",
      data: null,
    });
  }
});


//3. Get-one-feature
app.get("/get-one-feature/:id", async(req, res)=> {

  try {
    const oneFeature=await oneFeature.findById(req.params.id);
    if(!oneFeature){
      return res.status(404).json({
        success:false,
        msg:"Feature not found",
        data:null,

      });
    }
    return res.status(200).json({
      success:true,
      msg:"oneFeature fetched successfully",
      data:oneFeature,
    });
  } catch (error) {
    return res.status(500).json({
      success:false,
      msg:"!Oops something is wrong",
      data:null,
      error:error,
    });

    
  }
})

//4.Update Feature
app.patch("/update-feature/:id", async (req, res) => {
  try {
    const updateFeature = await Feature.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      msg: "Update Success",
      data: updateFeature,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Oops! Something went wrong",
      data: null,
      error: error,
    });
  }
});

//5. Delete Feature
app.delete("delete-feature", async(req, res) => {

  try {
    const deletedFeature= await Feature.findByIdAndDelete(req.params.id);
    if(!deletedFeature){
      return res.status(404).json({
        success:false,
        msg:"Feature not found",
        data:null,
      });
    }
    return res.status(200).jason({
      success:true,
      msg:"Feature deleted successfully",
      data:deletedFeature,
    });
  } catch (error) {
    return res.status(404).json({
      success:false,
      msg:"!Oops something is wrong",
      data:null,
      error:error,

    });
    
  }

});


app.listen(4000, () => {
  console.log("Blog Server is running at port 4000");
});
