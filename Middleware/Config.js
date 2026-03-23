// Load environment variables
require("dotenv").config();

// Standard Libraries
const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const axios = require("axios");
const multerS3 = require('multer-s3');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Passport & Auth
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');

// Models & Middleware
const PumpTestComparison = require("./DATABASE/Report"); 
const User = require("./DATABASE/Cred2"); 
const Design = require("./DATABASE/Design2"); 
const { parseExcelData } = require("./ExcelParser");

/**
 * 1. S3 CONFIGURATION
 */
const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey
    }
});

const BUCKET_NAME = "undertaker099";

/**
 * 2. MULTER CONFIGURATION
 */
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

/**
 * 3. RBAC CONSTANTS
 */
const ROLES = {
    MASTER: 'MASTER',
    REPORT_TEAM: 'REPORT TEAM',
    DESIGN_TEAM: 'DESIGN TEAM',
    USER: 'USER'
};

const MASTER_LIST = (process.env.MASTER_LIST || "").toLowerCase().split(",").map(i => i.trim());
const REPORT_TEAM_LIST = (process.env.REPORT_TEAM_LIST || "").toLowerCase().split(",").map(i => i.trim());
const DESIGN_TEAM_LIST = (process.env.DESIGN_TEAM_LIST || "").toLowerCase().split(",").map(i => i.trim());

module.exports = {
    express, path, mongoose, axios, s3, BUCKET_NAME, DeleteObjectCommand,
    passport, LocalStrategy, session, flash, upload,
    models: { PumpTestComparison, User, Design },
    utils: { parseExcelData },
    rbac: { ROLES, MASTER_LIST, REPORT_TEAM_LIST, DESIGN_TEAM_LIST }
};