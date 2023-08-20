import express from "express"
import { Form } from "../models/Form.js";
import excel from "exceljs"
import { User } from "../models/User.js";
import { Response } from "../models/Response.js";

const router = express.Router();

//to create a form
router.post("/add_questions/:userId" , async (req ,res , next) => {
    const userId = req.params.userId;
    try {
        const form = await Form.create(req.body)
        const user = await User.findById(userId)
        user.forms.push(form._id)
        await user.save()
        res.status(200).json(form)
    } catch (err) {
        next(err)
    }
})

//to get form data
router.get("/data/:id" , async (req , res , next) => {
    const id = req.params.id;
    try {
        const form = await Form.findById(id)
        res.status(200).json(form)
    } catch(err) {
        next(err)
    }
})

//update
router.put("/updateData/:id" , async (req , res , next) => {
    console.log(req.body);
    try{
        const updatedForm = await Form.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })
        res.status(200).json(updatedForm)
    } catch (err) {
        next(err)
    }
})

router.put("/renameData/:id" , async (req , res , next) => {
    const id = req.params.id
    try{
        const updatedForm = await Form.findByIdAndUpdate(id,
            { $set: req.body },
            { new: true })
        res.status(200).json(updatedForm)
    } catch (err) {
        next(err)
    }
})

router.delete("/removeData/:userId/:formId", async (req, res, next) => {
    const userId = req.params.userId;
    const formId = req.params.formId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json("User not found");
        }

        const index = user.forms.indexOf(formId);
        if (index === -1) {
            return res.status(404).json("Form not found for this user");
        }

        user.forms.splice(index, 1);
        await user.save();

        const deletedForm = await Form.findByIdAndDelete(formId);
        if (!deletedForm) {
            return res.status(404).json("Form not found");
        }

        res.status(200).json("Data removed");
    } catch (err) {
        console.error("Error:", err);
        next(err);
    }
});


//get
router.get("/get_all_filenames/:UserId", async (req, res, next) => {
    const userId = req.params.UserId;
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const formPromises = user.forms.map(formId => Form.findById(formId));
      const forms = await Promise.all(formPromises);
  
      res.status(200).json(forms);
    } catch (err) {
      next(err);
    }
  });

// to store the response data
router.post("/submit/:formId", async (req, res, next) => {
    try{
        const newResp = new Response(req.body);
        const savedResp = await newResp.save();
        res.status(200).json(savedResp)
    } catch(err) {
        next(err);
    }
})

router.get("/responseCount/:formId" ,async (req , res , next) => {
    try{
        const formId = req.params.formId;
        const count = await Promise.all(Response.countDocuments(formId))
        res.status(200).json({success : true, count : count });
    } catch(err) {
        next(err);
    }
})


//to store response in excel
router.post("/student_response/:doc_name", (req, res) => {
    var docs_data = req.body;
    var name = req.params.doc_name;
    let workbook = new excel.Workbook();
    var data = req.body.answer_data;
    let worksheet = workbook.addWorksheet(`${name}`);

    worksheet.columns = [{ header: "Time Stamp", key: "datetime" }, ...docs_data.column];
    worksheet.columns.forEach(column => {
        column.width = column.header.length < 12 ? 12 : column.header.length;
    });

    worksheet.getRow(1).font = { bold: true };
    data.forEach(e => {
        worksheet.addRow({ datetime: new Date(), ...e }); // Assuming datetime should be the timestamp for each row
    });

    workbook.xlsx.writeFile(`${name}.xlsx`).then(() => {
        res.send("Excel file generated and saved successfully");
    }).catch(err => {
        console.error("Error generating Excel file:", err);
        res.status(500).send("Error generating Excel file");
    });
});


export default router