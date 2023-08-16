import express from "express"
import { Form } from "../models/Form.js";
import excel from "exceljs"
import { User } from "../models/User.js";

const router = express.Router();

//to create a form
router.post("/add_questions" , async (req ,res , next) => {
    const newForm = new Form(req.body)
    try{
        const savedForm = await newForm.save();
        res.status(200).json(savedForm)
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
    try{
        const updatedForm = await Form.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })
        res.status(200).json(updatedForm)
    } catch (err) {
        next(err)
    }
})

//get
router.get("/get_all_filenames/:UserId" , async (req , res , next) => {
    const userId = req.params.UserId
    try {
        const user = await User.findById(userId)
        res.status(200).json(user.forms)
        console.log(user);
    } catch(err) {
        next(err)
    }
})

router.get("/getUser" , async (req ,res , next) => {
    const id = req.params.id;
    try{
        const res = await User.find()
        res.status(200).json(res)
    } catch(err) {
        next(err)
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