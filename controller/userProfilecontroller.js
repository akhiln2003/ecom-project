const session = require('express-session');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { response } = require('express');



            // Load profile

const loadProfile  =  async(req,res)=>{
    try {
        const id  = req.session.user._id;
        const user = await User.findOne({_id:id});
        res.render('profile',{user});
    } catch (error) {
        console.log(error);
    }
}

            // Load Address

const loadAddress = async(req,res)=>{
    try {
        const id = req.session.user._id;
        const user  = await User.findOne({_id:id});
        res.render('address',{user});
    } catch (error) {
        console.log(error);
    }
}

            //  Load Edit Profile

const loadEditprofile = async (req, res) => {
    try {
       const id = req.query.id;
       const user = await User.findOne({_id:id})
       res.render('editProfile',{user});
    } catch (error) {
        console.log(error);
       
    }
}

            // Update profiel

const updateProfile = async(req,res)=>{
    try {
      const{id,editName,editPhone} = req.body;
      const existname = await User.findOne({_id:{$ne:id},name:editName});
      const existnumber = await User.findOne({_id:{$ne:id},mobile:editPhone});

      if(existname){
          req.flash('error',"Name is alredy existed");
          res.redirect(`/editProfile?id=${id}`);
        }if (existnumber) {
            req.flash('error',"nu   mber is alredy existed");
          res.redirect(`/editProfile?id=${id}`);
        }else{
         await User.findOneAndUpdate({_id:id},{name:editName,mobile:editPhone});
          res.redirect('/profile');
      }

      
    } catch (error) {
       
        console.log(error);
    }
}
        // Lod Change Password 

const loadChangepassword = async(req,res)=>{
    try {
        res.render('changePassword');
    } catch (error) {
        console.log(error);
    }
}

        //Chandge Password

const changePassword = async(req,res)=>{
    try {
        const {id,current,newPassword} = req.body;
        const user = await User.findOne({_id:id});
        const password  = user.password;
        const compare = await bcrypt.compare(current,password);
        if(compare){
            const securePasswor = await  bcrypt.hash(newPassword,10);
            await User.findOneAndUpdate({_id:id},{$set:{password:securePasswor}});
            res.redirect('/profile');
            }else{
                req.flash('error',"Current Password is not currect");
                res.redirect('/changePassword');
            }
         
    } catch (error) {
        console.log(error);
    }
}

        // Add Prodict 

const loadAddaddress = async(req,res)=>{
    try {
        res.render('addAddress');
    } catch (error) {
        console.log(error);
    }
}

            // insert Address

const insertAddress = async(req,res)=>{
    try {
       const id = req.session.user._id;
       const {name,state,city,pin,phone}=req.body;
      await User.findOneAndUpdate({_id:id},{
        $push:{
        address:{
        name:name,
        state:state,
        city:city,
        pin:pin,
        phone:phone
        }
      }});
      res.redirect('/address')
        
    } catch (error) {
        console.log(error);
    }
}


const deletAddress =async(req,res)=>{
    try {
     const {userid,addressid} = req.body;
      await User.findOneAndUpdate({_id:userid},{$pull:{address:{_id:addressid}}});
      res.redirect('/address');

    } catch (error) {
        console.log(error);
    }
}

const loadEditaddress = async(req,res)=>{
    try {

        const index =  req.query.index
        const userid = req.session.user._id;
        const user = await User.findOne({_id:userid });
        const userAddress = user.address[index]
        res.render('editAddress',{user,index,userAddress});
    } catch (error) {
        console.log(error);
    }
}

const updatEditaddress = async(req,res)=>{
    try {
       const {id,index,name,state,city,pin,phone} = req.body;
       await User.findOneAndUpdate({_id:id},{
        $set:{
            [`address.${index}.name`]: name,
            [`address.${index}.state`]: state,
            [`address.${index}.city`]: city,
            [`address.${index}.pin`]: pin,
            [`address.${index}.phone`]: phone

        }
       })
       res.redirect('/address')
    } catch (error) {
        console.log(error);
    }
}

const loadOrders  = async(req,res)=>{
    try {
        res.render('orders');
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadProfile,
    loadAddress,
    loadEditprofile,
    updateProfile,
    loadChangepassword,
    changePassword,
    loadAddaddress,
    insertAddress,
    deletAddress,
    loadEditaddress,
    updatEditaddress,
    loadOrders
}