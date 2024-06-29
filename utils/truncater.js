const truncatePost = (description)=>{
       if(description.length>100){
         return description.substring(0,100)+"...";
       }
       else return description;
} 
module.exports=truncatePost;