var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var app= express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

app.set("view engine", "ejs");
app.use(express.static("Assets"));
app.use(methodOverride('_method'));


mongoose.connect("mongodb://localhost:27017/blogApp",{useNewUrlParser:true});
var blogSchema= new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var blogApp = mongoose.model("blogApp", blogSchema);

//RESTful Routes
app.get("/", function(req,res){
    res.redirect("/blog");
});

app.get("/blog",function(req, res){
    blogApp.find({}, function(err,articles){
        if(err){
            console.log(err)
        } else{
            res.render("index", {articles: articles})
        }
    })
    
})

app.get("/blog/new", function(req, res){
    res.render("new");
});

app.get("/blog/:id", function(req,res){
    blogApp.findById(req.params.id, function(err, articleFound){
        if(err){
            console.log(err)
        } else{
            res.render("show", {article: articleFound})
        }
    });
});

app.get("/blog/:id/edit", function(req,res){
    blogApp.findById(req.params.id, function(err, articleFound){
        if(err){
            console.log(err)
        } else{
            res.render("edit", {article: articleFound})
        }
    })
});




app.post("/blog", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body); 
    blogApp.create(req.body.blog, function(err, Article){
        if(err){
            console.log(err)
        } else{
            res.redirect("/blog")
        }
    })
});

app.put("/blog/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blogApp.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedArticle){
        if(err){
            console.log(err)
        } else{
            res.redirect("/blog/"+req.params.id)
        }
    })
});


app.delete("/blog/:id", function(req, res){
    blogApp.findByIdAndRemove(req.params.id, function(err, itemDeleted){
        if(err){
            console.log(err)
        } else{
            res.redirect("/blog")
        }
    })
})


app.listen(3000, function(){
    console.log("Server started at Port 3000");
})