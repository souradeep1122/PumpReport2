//dotenv config
require("dotenv").config();

const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const axios = require("axios");
const multerS3 = require('multer-s3');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Passport & Session Imports
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');

// 1. Models & Middleware Imports
const PumpTestComparison = require("./Middleware/DATABASE/Report"); 
const User = require("./Middleware/DATABASE/Credentials"); 
const Design = require("./Middleware/DATABASE/Design"); 
const { parseExcelData } = require("./Middleware/ExcelParser");

const app = express();

// Fetching admin list from .env
const ADMIN_LIST = process.env.ADMIN_LIST;

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 2. S3 Configuration
const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey
    }
});

const BUCKET_NAME = "undertaker099";

// 3. Passport & Session Configuration
app.use(session({
    secret: 'pumpsense_secret_key',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Auth Middlewares
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(403).send("Access Denied: Only administrators can perform this action.");
}

// 4. Multer Configuration for S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const uniqueName = `NodeJs_Excel_Uploads/${Date.now()}-${file.originalname}`;
            cb(null, uniqueName);
        }
    })
});

// 5. Authentication Routes
app.get("/login", (req, res) => {
    res.render("Login", { 
        message: req.flash('error'), 
        success: req.flash('success') 
    });
});

app.post("/login", passport.authenticate('local', {
    successRedirect: '/view-files',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/login');
    });
});

app.post("/register", async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match.');
            return res.redirect('/login');
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.flash('error', 'User already exists.');
            return res.redirect('/login');
        }
        const assignedRole = ADMIN_LIST.includes(username.toLowerCase()) ? 'admin' : 'user';
        await User.create({ username, password, role: assignedRole });
        req.flash('success', 'Account created successfully! You can now login.');
        res.redirect('/login');
    } catch (error) {
        req.flash('error', 'Registration failed.');
        res.redirect('/login');
    }
});

// 6. Application Routes
app.get("/", ensureAuthenticated, (req, res) => {
    if (req.user.role !== 'admin') return res.redirect('/view-files');
    res.render("Upload", { user: req.user });
});

app.get("/view-files", ensureAuthenticated, async (req, res) => {
    try {
        const allFiles = await PumpTestComparison.find({}); 
        res.render("Table", { files: allFiles, user: req.user });
    } catch (error) {
        res.status(500).send("Error fetching file list.");
    }
});

app.post("/delete-report/:id", ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const reportId = req.params.id;
        const report = await PumpTestComparison.findById(reportId);
        if (!report) return res.status(404).json({ success: false, message: "Report not found" });

        const filesToDelete = [];
        if (report.trueFile && report.trueFile.public_id) filesToDelete.push(report.trueFile.public_id);
        if (report.alteredFile && report.alteredFile.public_id) filesToDelete.push(report.alteredFile.public_id);

        await Promise.all(filesToDelete.map(async (key) => {
            const deleteParams = { Bucket: BUCKET_NAME, Key: key };
            return s3.send(new DeleteObjectCommand(deleteParams));
        }));

        await PumpTestComparison.findByIdAndDelete(reportId);
        res.json({ success: true, message: "Report and associated files deleted." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// UPDATED: Logic to handle 1 mandatory file and 1 optional file
app.post("/upload", ensureAuthenticated, isAdmin, upload.array("file", 2), async (req, res) => {
    try {
        // At least one file (True File) must be present
        if (!req.files || req.files.length === 0) {
            return res.status(400).send("Please upload at least the True / Original file.");
        }

        // Fetch buffers for uploaded files
        const fileBuffers = await Promise.all(
            req.files.map(async (file) => {
                const response = await axios.get(file.location, { responseType: "arraybuffer" });
                return response.data;
            })
        );

        // Process True Data (Always index 0)
        const trueDataRaw = parseExcelData(fileBuffers[0]);
        
        // Process Altered Data only if second file exists
        let alteredDataRaw = null;
        let alteredFileData = null;

        if (req.files.length > 1) {
            alteredDataRaw = parseExcelData(fileBuffers[1]);
            alteredFileData = {
                filename: req.files[1].originalname,
                public_id: req.files[1].key,
                url: req.files[1].location
            };
        }

        await PumpTestComparison.create({
            uploadDate: new Date(),
            trueFile: {
                filename: req.files[0].originalname,
                public_id: req.files[0].key,
                url: req.files[0].location
            },
            alteredFile: alteredFileData,
            trueData: trueDataRaw,
            alteredData: alteredDataRaw
        });

        res.redirect(`/view-files`);
    } catch (error) {
        console.error("Upload failed:", error);
        res.status(500).send("Upload failed: " + error.message);
    }
});

app.get('/report/:id', ensureAuthenticated, async (req, res) => {
    try {
        const reportId = req.params.id;
        const report = await PumpTestComparison.findOne({_id: reportId});
        if (!report) return res.status(404).send("Report not found");
        res.render('report2', { report, user: req.user });
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});
// GET: Render the design upload form (Admin Only)
app.get("/upload-design", ensureAuthenticated, isAdmin, (req, res) => {
    res.render("Designform", { 
        user: req.user, 
        message: req.flash('error') 
    });
});

// POST: Handle the design form submission (Admin Only)
app.post("/upload-design", ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const { pumpModel, serialNo, discharge, power, efficiency, totalHead } = req.body;

        // Check for duplicate serial numbers
        const existingDesign = await Design.findOne({ serialNo });
        if (existingDesign) {
            req.flash('error', `A design with Serial No. ${serialNo} already exists.`);
            return res.redirect('/upload-design');
        }

        await Design.create({
            pumpModel,
            serialNo,
            discharge: parseFloat(discharge),
            power: parseFloat(power),
            efficiency: parseFloat(efficiency),
            totalHead: parseFloat(totalHead),
            createdBy: req.user._id
        });

        req.flash('success', 'Design specification saved successfully.');
        res.redirect('/view-files');
    } catch (error) {
        console.error("Design Save Error:", error);
        req.flash('error', 'Failed to save design: ' + error.message);
        res.redirect('/upload-design');
    }
});







const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));