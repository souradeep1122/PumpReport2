const { 
    express, path, mongoose, axios, s3, BUCKET_NAME, DeleteObjectCommand,
    passport, LocalStrategy, session, flash, upload,
    models, utils, rbac 
} = require("./Middleware/Config");

const app = express();
const { User, PumpTestComparison, Design } = models;
const { ROLES, MASTER_LIST, REPORT_TEAM_LIST, DESIGN_TEAM_LIST } = rbac;

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Passport & Session Setup
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
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return done(null, false, { message: 'Invalid credentials.' });
        }
        return done(null, user);
    } catch (err) { return done(err); }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try { const user = await User.findById(id); done(null, user); } 
    catch (err) { done(err); }
});

// --- RBAC Middlewares ---

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

function authorize(allowedRoles = []) {
    return (req, res, next) => {
        if (!req.isAuthenticated()) return res.redirect('/login');
        if (allowedRoles.includes(req.user.role)) return next();
        
        res.status(403).render("Error", { 
            message: "Access Denied: You do not have permission for this action.",
            user: req.user 
        });
    };
}

// --- Auth Routes ---

app.get("/login", (req, res) => res.render("Login2", { message: req.flash('error'), success: req.flash('success') }));

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
        if (password !== confirmPassword) { req.flash('error', 'Passwords do not match.'); return res.redirect('/login'); }
        if (await User.findOne({ username })) { req.flash('error', 'User already exists.'); return res.redirect('/login'); }
        
        let assignedRole = ROLES.USER;
        const lowerUname = username.toLowerCase();
        if (MASTER_LIST.includes(lowerUname)) assignedRole = ROLES.MASTER;
        else if (REPORT_TEAM_LIST.includes(lowerUname)) assignedRole = ROLES.REPORT_TEAM;
        else if (DESIGN_TEAM_LIST.includes(lowerUname)) assignedRole = ROLES.DESIGN_TEAM;
        
        await User.create({ username, password, role: assignedRole });
        req.flash('success', `Account created as ${assignedRole}! Please login.`);
        res.redirect('/login');
    } catch (error) { res.redirect('/login'); }
});

// --- Application Routes ---

app.get("/", ensureAuthenticated, (req, res) => res.redirect('/view-files'));

app.get("/view-files", ensureAuthenticated, async (req, res) => {
    try {
        const allFiles = await PumpTestComparison.find({}); 
        const allDesigns = await Design.find({});
        res.render("Table2", { files: allFiles, designs: allDesigns, user: req.user });
    } catch (error) { res.status(500).send("Dashboard error."); }
});

// --- Report Routes ---

app.get("/upload", authorize([ROLES.MASTER, ROLES.REPORT_TEAM]), (req, res) => res.render("upload5", { user: req.user }));

app.post("/upload", authorize([ROLES.MASTER, ROLES.REPORT_TEAM]), upload.array("file", 2), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) return res.status(400).send("True file is mandatory.");
        const fileBuffers = await Promise.all(req.files.map(async (file) => {
            const response = await axios.get(file.location, { responseType: "arraybuffer" });
            return response.data;
        }));
        const trueDataRaw = utils.parseExcelData(fileBuffers[0]);
        let alteredFileData = req.files[1] ? { filename: req.files[1].originalname, public_id: req.files[1].key, url: req.files[1].location } : null;

        await PumpTestComparison.create({
            uploadDate: new Date(),
            trueFile: { filename: req.files[0].originalname, public_id: req.files[0].key, url: req.files[0].location },
            alteredFile: alteredFileData,
            trueData: trueDataRaw,
            alteredData: req.files[1] ? utils.parseExcelData(fileBuffers[1]) : null,
            uploadedBy: req.user._id
        });
        res.redirect(`/upload`);
    } catch (error) { res.status(500).send("Upload failed."); }
});

app.post("/delete-report/:id", authorize([ROLES.MASTER, ROLES.REPORT_TEAM]), async (req, res) => {
    try {
        const report = await PumpTestComparison.findById(req.params.id);
        const keys = [];
        if (report.trueFile?.public_id) keys.push(report.trueFile.public_id);
        if (report.alteredFile?.public_id) keys.push(report.alteredFile.public_id);
        await Promise.all(keys.map(key => s3.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }))));
        await PumpTestComparison.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) { res.status(500).json({ success: false }); }
});

app.get('/report/:id', ensureAuthenticated, async (req, res) => {
    try {
        const report = await PumpTestComparison.findById(req.params.id);
        if (!report) return res.status(404).send("Report not found");
        const pumpModel = report.trueData.pumpDetails.model;
        const design = await Design.findOne({ pumpModel: pumpModel });
        res.render('report4', { report, design, user: req.user });
    } catch (err) { 
        console.error(err);
        res.status(500).send("Error loading report."); 
    }
});

// --- Design Routes ---

/**
 * NEW: Uniqueness validation endpoint for frontend AJAX
 */
app.get("/validate-design-identity", ensureAuthenticated, async (req, res) => {
    try {
        const { model, serial } = req.query;
        if (!model || !serial) return res.json({ isUnique: true });

        const existing = await Design.findOne({
            pumpModel: { $regex: new RegExp(`^${model.trim()}$`, "i") },
            serialNo: { $regex: new RegExp(`^${serial.trim()}$`, "i") }
        });

        res.json({ isUnique: !existing });
    } catch (error) {
        res.status(500).json({ isUnique: true, error: "Validation error" });
    }
});

app.get("/upload-design", authorize([ROLES.MASTER, ROLES.DESIGN_TEAM, ROLES.REPORT_TEAM]), (req, res) => {
    res.render("Design4", { user: req.user, message: req.flash('error'), design: undefined });
});

app.post("/upload-design", authorize([ROLES.MASTER, ROLES.DESIGN_TEAM, ROLES.REPORT_TEAM]), async (req, res) => {
    try {
        const { pumpModel, serialNo, discharge, power, efficiency, totalHead } = req.body;
        
        // Check for combined pair uniqueness
        const existing = await Design.findOne({ 
            pumpModel: pumpModel.trim(), 
            serialNo: serialNo.trim() 
        });

        if (existing) { 
            req.flash('error', `A design for Model ${pumpModel} with Serial ${serialNo} already exists.`); 
            return res.redirect('/upload-design'); 
        }

        await Design.create({ pumpModel, serialNo, discharge, power, efficiency, totalHead, createdBy: req.user._id });
        res.redirect('/view-files');
    } catch (error) { 
        console.error(error);
        res.redirect('/upload-design'); 
    }
});

app.get("/edit-design/:id", authorize([ROLES.MASTER, ROLES.DESIGN_TEAM, ROLES.REPORT_TEAM]), async (req, res) => {
    try {
        const design = await Design.findById(req.params.id);
        res.render("Design4", { user: req.user, design, message: req.flash('error') });
    } catch (error) { res.status(500).send("Error."); }
});

app.post("/update-design/:id", authorize([ROLES.MASTER, ROLES.DESIGN_TEAM, ROLES.REPORT_TEAM]), async (req, res) => {
    try {
        const { pumpModel, serialNo } = req.body;

        // Ensure update doesn't conflict with ANOTHER existing record's pair
        const collision = await Design.findOne({
            _id: { $ne: req.params.id },
            pumpModel: pumpModel.trim(),
            serialNo: serialNo.trim()
        });

        if (collision) {
            req.flash('error', `Cannot update: The Model/Serial combination already belongs to another entry.`);
            return res.redirect(`/edit-design/${req.params.id}`);
        }

        await Design.findByIdAndUpdate(req.params.id, req.body);
        req.flash('success', 'Updated.');
        res.redirect('/view-files');
    } catch (error) { res.redirect(`/edit-design/${req.params.id}`); }
});

app.post("/delete-design/:id", authorize([ROLES.MASTER, ROLES.DESIGN_TEAM, ROLES.REPORT_TEAM]), async (req, res) => {
    try {
        await Design.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) { res.status(500).json({ success: false }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));