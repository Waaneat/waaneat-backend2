// const Admin = require("../../models/admin/Admin");
// const isValidImageFormat = require("../../utils/isValidImageFormat");
// const Ads = require("../../models/admin/Ads");

// exports.create = async(req,res)=>{
//     try {
//         const {adsImg} = req.body;
        
//         if (adsImg == null || adsImg === "" || !isValidImageFormat(adsImg)) {
//             res.status(400).json({code:20007,message:"Image vide ou au mauvais format"});
//         } else {

//             const admin = await Admin.findOne({},
//                 {
//                     where: {id: req.cookies.userId},
//                 }
//             );
    
//             if(admin == null || admin.role != "admin" || admin.role !="root"){
//                 res.status(403).json({code:20041,message:"vous n’etes pas un admin"});
//             }else if(admin != null){
                
//                 await Ads.create(
//                     {
//                         adsImg : adsImg
//                     }
//                 )
//                 res.status(200).json({code:20041,message:"pub cree avec success"});
                
//             }else{
//                 res.status(403).json({code:20041,message:"Action strictement interdite"});
//             }

//         }

        
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({code:20040,message:"serveur erreur"});
//     }
// }

// exports.update = async(req,res)=>{
//     try {
//         const idAds = req.params.idAds;
//         const {adsImg} = req.body;
        
//         if (adsImg == null || adsImg === "" || !isValidImageFormat(adsImg)) {
//             res.status(400).json({code:20007,message:"Image vide ou au mauvais format"});
//         } else{

//             const admin = await Admin.findOne({},
//                 {
//                     where: {id: req.cookies.userId}
//                 }
//             );
    
//             if(admin == null || admin.role != "admin" || admin.role !="root"){
//                 res.status(403).json({code:20041,message:"vous n’etes pas un admin"});
//             }else if(admin != null){
                
//                 const ads = await Ads.findOne({},
//                     {
//                         where: {id: idAds},
//                     }
//                 );

//                 if(ads == null){
//                     res.status(403).json({code:20041,message:"La pub n'existe pas"});
//                 }else if(ads != null){
//                     await Ads.update(
//                         {
//                             adsImg : adsImg
//                         },
//                         {
//                             where: {id: ads.id},
//                         }
//                     )
//                     res.status(200).json({code:20041,message:"Pub modifié avec success"});
//                 }else{
//                     res.status(400).json({code:20041,message:"Action strictement interdite"});
//                 }
                
//             }else{
//                 res.status(403).json({code:20041,message:"Action strictement interdite"});
//             }

//         }

        
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({code:20040,message:"serveur erreur"});
//     }
// }

// exports.delete = async(req,res)=>{
//     try {
//         const idAds = req.params.idAds;
        

//         const admin = await Admin.findOne({},
//             {
//                 where: {id: req.cookies.userId}
//             }
//         );
    
//         if(admin == null || admin.role != "admin" || admin.role !="root"){
//             res.status(403).json({code:20041,message:"vous n’etes pas un admin"});
//         }else if(admin != null){
                
//             const ads = await Ads.findOne({},
//                 {
//                     where: {id: idAds},
//                 }
//             );

//             if(ads == null){
//                 res.status(403).json({code:20041,message:"La pub n'existe pas"});
//             }else if(ads != null){
//                 await Ads.delete(
//                     {
//                         where: {id: ads.id},
//                     }
//                 )
//                 res.status(200).json({code:20041,message:"Pub supprimé avec success"});
//             }else{
//                 res.status(400).json({code:20041,message:"Action strictement interdite"});
//             }
                
//         }else{
//             res.status(403).json({code:20041,message:"Action strictement interdite"});
//         }


        
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({code:20040,message:"serveur erreur"});
//     }
// }

// exports.get = async(req,res)=>{
//     try {
//         const idAds = req.params.idAds;

//         const admin = await Admin.findOne({},
//             {
//                 where: {id: req.cookies.userId}
//             }
//         );

//         if(admin == null || admin.role != "admin" || admin.role !="root"){
//             res.status(403).json({code:20041,message:"vous n’etes pas un admin"});
//         }else if(admin != null){
                
//             const ads = await Ads.findOne({},
//                 {
//                     where: {id: idAds},
//                 }
//             );

//             if(ads == null){
//                 res.status(403).json({code:20041,message:"La pub n'existe pas"});
//             }else if(ads != null){
//                 res.status(200).json({code:20041,message:ads});
//             }else{
//                 res.status(400).json({code:20041,message:"Action strictement interdite"});
//             }
                
//         }else{
//             res.status(403).json({code:20041,message:"Action strictement interdite"});
//         }

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({code:20060,message:"serveur erreur"});
//     }
// }

// exports.getAllAds = async(req,res)=>{
//     try {
//         const admin = await Admin.findOne({},
//             {
//                 where: {id: req.cookies.userId}
//             }
//         );

//         if(admin == null || admin.role != "admin" || admin.role !="root"){
//             res.status(403).json({code:20041,message:"vous n’etes pas un admin"});
//         }else if(admin != null){
                
//             const ads = await Ads.findAll({});

//             if(ads == null){
//                 res.status(200).json({code:20041,message:"Aucun element"});
//             }else if(ads != null){
//                 res.status(200).json({code:20041,message:ads});
//             }else{
//                 res.status(400).json({code:20041,message:"Action strictement interdite"});
//             }
                
//         }else{
//             res.status(403).json({code:20041,message:"Action strictement interdite"});
//         }

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({code:20080,message:"serveur erreur"});
//     }
// }