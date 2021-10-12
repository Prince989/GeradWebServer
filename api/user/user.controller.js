const {
  getModes,
  getDefaultFabric,
  getDefaultLining,
  getDefaultButton,
  getAllMaterials,
  getFabricDir,
  getLiningDir,
  getButtonDir,
  getMaterialDir,
  setVerificationCode,
  checkMobile,
  updateVerificationCode,
  setUser,
  fetchSizeElements,
  fetchCart
} = require("./user.model");

const prefix_url = "http://89.41.42.189:33140/";
const postfix_url = "render.webp";
const { sign } = require("jsonwebtoken");

module.exports = {

  fetchMenu: (req, res) => {
    getModes((err, results) => {
      if (err) {
        return res.status(502).json({
          success: "0",
          Message: "Problem with database:" + err,
        });
      }
      output = [];
      results.map((item) => {
        output.push({
          id: item.modeid,
          title: item.title,
          show_name: item.show_name,
          default: {
            id: item.matid,
            icon: item.image,
            price: item.price,
            img: `${prefix_url}Fabrics/m/1/${item.dirname}/1/render.png`,
          },
        });
      });
      return res.json(output);
    });
  },

  getDefault: (req, res) => {
    return res.json({
      Message: "No Default Anymore Send Request Yourself Asshole",
    });
    /*
        let FabricUrl = "";
        let LiningUrl = "";
        let ButtonUrl = "";

        let fabricIcon = "";
        let liningIcon = "";
        let buttonIcon = "";

        let fabricName = "";
        let liningName = "";
        let buttonName = "";

        FabricUrl = prefix_url + "Fabrics/m/1/";
        LiningUrl = prefix_url + "Linings/m/1/";
        ButtonUrl = prefix_url + "Buttons/m/1/";

        getDefaultFabric((err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection errror"
                });
            }
            fabricName = results[0].name;
            FabricUrl += results[0].dirname;
            FabricUrl += "/1/";
            FabricUrl += postfix_url;
            fabricIcon = results[0].image;
            getDefaultLining((err,results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Database connection errror"
                    });
                }
                liningName = results[0].name;
                LiningUrl += results[0].dirname;
                LiningUrl += "/1/";
                LiningUrl += postfix_url;
                liningIcon = results[0].image;

                getDefaultButton((err,results) => {
                    if(err) {
                        console.log(err);
                        return res.status(500).json({
                            success: 0,
                            message: "Database connection errror"
                        });
                    }
                    buttonName = results[0].name;
                    ButtonUrl += results[0].dirname;
                    ButtonUrl += "/1/";
                    ButtonUrl += postfix_url;
                    buttonIcon = results[0].image;

                    let output = [{"url": FabricUrl, "icon": fabricIcon, "name": fabricName}
                        , {"url": LiningUrl, "icon": liningIcon, "name": liningName}
                        , {"url": ButtonUrl, "icon": buttonIcon, "name": buttonName}];

                    res.json(output)
                })
            });
        });*/
  },

  materialList: (req, res) => {
    let data = [];
    data["mode"] = req.params.mode;
    getAllMaterials(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(502).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      let output = [];
      results.map((item) => {
        output.push({
          id: item.id,
          name: item.name,
          image: item.image,
          content: item.content,
          price: item.price,
        });
      });
      res.json(output);
    });
  },

  setRender: (req, res) => {
    let fabricDir = "";
    let liningDir = "";
    let buttonDir = "";

    let fabricId = req.params.fabricId;
    let liningId = req.params.liningId;
    let buttonId = req.params.buttonId;

    getFabricDir(fabricId, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      fabricDir += results[0].dirname;
      getLiningDir(liningId, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection errror",
          });
        }
        liningDir += results[0].dirname;
        getButtonDir(buttonId, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database connection errror",
            });
          }
          buttonDir += results[0].dirname;

          let FabricDirectory = `${prefix_url}Fabrics/${req.params.size}/${req.params.model}/${fabricDir}/${req.params.shot}/${postfix_url}`;
          let LiningDirectory = `${prefix_url}Linings/${req.params.size}/${req.params.model}/${liningDir}/${req.params.shot}/${postfix_url}`;
          let ButtonDirectory = `${prefix_url}Buttons/${req.params.size}/${req.params.model}/${buttonDir}/${req.params.shot}/${postfix_url}`;

          res.json([
            { url: FabricDirectory },
            { url: LiningDirectory },
            { url: ButtonDirectory },
          ]);
        });
      });
    });
  },

  getRender: (req, res) => {
    let renderReqs = req.body.renderItem;
    let dirs = [];
    let i = 0;
    getDirsRecursive(renderReqs, i, dirs, (err, succ) => {
      if (err) {
        return res.json({
          Success: "0",
          Message: err,
        });
      }
      let output = [];
      dirs.map((item) => {
        let Directory = `${prefix_url}${capitalize(item.mode)}s/${
          req.params.size
        }/${req.params.model}/${item.dirname}/${
          req.params.shot
        }/${postfix_url}`;

        output.push(Directory);
      });
      return res.json(output);
    });
  },

  sendCode: (req, res) => {
    let mobile = req.body.mobile;
    let randomCode = Math.floor(1000 + Math.random() * 9000);
    let data = {
      mobile: mobile,
      code: randomCode,
    };

    checkMobile("verification_code", data, (err, result) => {
      if (err) {
        return res.status(200).json({
          success: 0,
        });
      } else {
        if (result.length > 0) {
          updateVerificationCode(data, (err, results) => {
            if (err) {
              res.status(200).json({
                success: 0,
              });
            } else {
              res.status(200).json({
                success: "1",
              });
            }
          });
        } else {
          setVerificationCode(data, (err, results) => {
            if (err) {
              res.status(200).json({
                success: 0,
              });
            } else {
              res.status(200).json({
                success: 1,
              });
            }
          });
        }
      }
    });
  },

  verifyCode: (req, res) => {
    let data = req.body;
    checkMobile("verification_code", data, (err, result) => {
      if (err) {
        return res.status(200).json({
          success: 0,
          message: "check mobile code sql error",
        });
      } else {
        if (data.code === result[0].code) {
          const jsontoken = sign({ result: result.id }, "qwe1234", {
            expiresIn: "3h",
          });
          setUser(data, jsontoken, (err, result) => {
            if (err) {
              res.status(200).json({
                success: 0,
              });
            } else {
              res.status(200).json({
                success: "1",
                token: jsontoken,
              });
            }
          });
        } else {
          return res.status(200).json({
            success: 0,
            message: "invalid code",
          });
        }
      }
    });
  },

  getSize: (req, res) => {
    let waistSize = req.body.waist;
    let shoulder = req.body.shoulder;
    let suitSize = req.body.suitSize;
    let sleeveSize = req.body.sleeveSize;

    if (!waistSize)
      return res.json({
        Message: "Bad request : waist size empty",
      });

    if (!shoulder)
      return res.json({
        Message: "Bad request : shoulder size empty",
      });
    let data = [];

    data["waist"] = waistSize;
    fetchSizeElements(data, (err, results) => {
      if (err) {
        return res.json({
          Success: "0",
          Message: "Database error connection",
        });
      }
      if (results.length < 1)
        return res.json({
          Success: "0",
          Message: "Invalid Size Input",
        });

      if (results.length > 1) {
        for (let i = 0; i < results.length; i++) {
          if (shoulder <= results[i].shoulder) {
            return res.json({
              Success: "1",
              Size: results[i].suit_size,
            });
          }
        }
        return res.json({
          Success: "1",
          Size: results[results.length - 1].suit_size,
        });
      }
      return res.json({
        Success: "1",
        Size: results[0].suit_size,
      });
    });
  },

  fetchCart :(req,res) => {
      const token = req.params.userToken 
      fetchCart(token,(error,result)=>{
          if(error){
            return res.status(200).json({
              "success":0,
              "message":" fetch cart error "
            })
          }
          else{
              return res.status(200).json({
                success:1,
                data:result
              })
          }
      })
  }

};

function getDirsRecursive(reqs, i, results, callback) {
  if (i >= reqs.length) {
    callback(null, results);
    return;
  }

  let mode = reqs[i].mode;
  let id = reqs[i].id;
  let data = [];
  data["id"] = id;

  getMaterialDir(data, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    dirname = result[0].dirname;
    results.push({
      mode: mode,
      dirname: dirname,
    });
    i++;
    getDirsRecursive(reqs, i, results, callback);
  });
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
