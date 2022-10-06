

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const lodash = require("lodash");

const app = express();

//creating the database

mongoose.connect("mongodb://localhost:27017/todolistDB");

//defining the schemna of the database

const todolistSchema = new mongoose.Schema({
  name: String,
});

const customlistSchema = new mongoose.Schema({
  name:String,
  item:[todolistSchema]
});
//creating the collections of the database

const listItem = mongoose.model("listItem", todolistSchema);
const customListItem = mongoose.model("customList",customlistSchema);
//implemeting the mongoose find method

/////////////////////////////////////////

const first = new listItem({
  name: "Welcome to Your Todo List!",
});

const second = new listItem({
  name: "Press + button to add new items",
});

const third = new listItem({
  name: "<-- Check this to delete the items",
});

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


//creating a get method for the custom domains o rlists

app.get("/:customList",function(req,res){
  const listname = lodash.capitalize(req.params.customList);
  customListItem.findOne({name:listname},function(err,result)
  {
    if(!err)
    {
      if(!result)
      { 
        //here we will create a new custom list
        const newlist = new customListItem({
          name:listname,
          item:[first,second,third]
        });
       newlist.save();
       res.redirect("/" + listname);
      }
      else
      {
        res.render("list",{listTitle:result.name,newListItems:result.item});
      }
      
    }
  }  
  );
 
 
 
});

///////////////////////////////////////////////////////
app.get("/", function (req, res) {
  listItem.find({}, function (err, result) {
    if (result.length === 0) {
      listItem.insertMany([first, second, third]);
      res.redirect("/");
    } else res.render("list", { listTitle: "Today", newListItems: result });
  });
});

app.post("/delete", function (req, res) {
  const id = req.body.checkbox;
  const listName = req.body.listName;
  if(listName === "Today")
  {
    listItem.findByIdAndRemove(id,function(err)
    {
      if(err)
      console.log(err);
      else
       console.log("deleted successfully");
    });
    res.redirect("/");
  }
  else
  {
    customListItem.findOneAndUpdate({name:listName},{$pull:{item:{_id:id}}},function(err,result)
    {
      if(!err)
      {
        res.redirect("/"+listName);
      } 

    });
  }
 
});


app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;
  
  const new_item = new listItem({
    name:itemName
  });
   
    if(listName === "Today")
    {
      new_item.save();
      res.redirect("/");
    }
    else
    {
      
      customListItem.findOne({name:listName},function(err,result)
      { if(!err)
        {
          result.item.push(new_item);
          result.save();
          res.redirect("/" + listName);
        }
        else
        {
          console.log(err);
        }
        
      });     

    }
 
   

});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
