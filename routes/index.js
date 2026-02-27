const express = require('express');
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const multerS3 = require('multer-s3');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Models & Middleware Imports
// Adjusting paths assuming these are in the root directory relative to this 'routes' folder
const PumpTestComparison = require("../Report"); 
const User = require("../Credentials"); 
const { parseExcelData } = require("../Middleware/ExcelParser");

// --- PREDEFINED ADMIN LIST ---
const ADMIN_LIST = ['admin@pumpsense.com', 'souradeep@pumpsense.com', 'head@pumpsense.com', 'deep'];

// 1. S3 Configuration
const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey
    }
});

const BUCKET_NAME = "undertaker099";

// 2. Passport & Session Logic (Configured on the router level where applicable)
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

// 3. Multer Configuration for S3
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

// 4. Authentication Routes
router.get("/login", (req, res) => {
    res.render("Login", { 
        message: req.flash('error'), 
        success: req.flash('success') 
    });
});

router.post("/login", passport.authenticate('local', {
    successRedirect: '/view-files',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/login');
    });
});

router.post("/register", async (req, res) => {
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

// 5. Application Routes
router.get("/", ensureAuthenticated, (req, res) => {
    if (req.user.role !== 'admin') return res.redirect('/view-files');
    res.render("Upload", { user: req.user });
});

router.get("/view-files", ensureAuthenticated, async (req, res) => {
    try {
        const allFiles = await PumpTestComparison.find({}); 
        res.render("Table", { files: allFiles, user: req.user });
    } catch (error) {
        res.status(500).send("Error fetching file list.");
    }
});

router.post("/delete-report/:id", ensureAuthenticated, isAdmin, async (req, res) => {
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

// Logic to handle 1 mandatory file and 1 optional file
router.post("/upload", ensureAuthenticated, isAdmin, upload.array("file", 2), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send("Please upload at least the True / Original file.");
        }

        const fileBuffers = await Promise.all(
            req.files.map(async (file) => {
                const response = await axios.get(file.location, { responseType: "arraybuffer" });
                return response.data;
            })
        );

        const trueDataRaw = parseExcelData(fileBuffers[0]);
        
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

router.get('/report/:id', ensureAuthenticated, async (req, res) => {
    try {
        const reportId = req.params.id;
        const report = await PumpTestComparison.findOne({_id: reportId});
        if (!report) return res.status(404).send("Report not found");
        res.render('report2', { report, user: req.user });
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;