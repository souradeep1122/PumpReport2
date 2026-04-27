<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>PUMPSENSE | Certificate - <%= report.trueData.pumpDetails.model %></title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #003366;
      --primary-light: #004a8f;
      --secondary: #000000;
      --accent: #005b96;
      --light-blue: #eef3fb;
      --border: #c8d0da;
      --bg: #f0f4f8;
      --text: #1a1a1a;
      --highlight: #d1e3f3;
      --tolerance-bg: #f0f4f8;
      --card-shadow: 0 2px 12px rgba(0,51,102,0.08);
      --radius: 8px;
    }

    *, *::before, *::after { box-sizing: border-box; }

    body {
      font-family: "IBM Plex Sans", "Segoe UI", Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      font-size: 13px;
    }

    .fade-in { animation: fadeIn 0.4s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

    .dropdown-menu {
      display: none; opacity: 0; transform: translateY(-10px);
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    .dropdown-menu.show { display: block; opacity: 1; transform: translateY(0); }

    .action-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 18px; border-radius: 7px; font-weight: 600;
      font-size: 13px; cursor: pointer; border: none;
      transition: all 0.18s ease; white-space: nowrap;
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-light); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,51,102,0.25); }
    .btn-dark { background: #1e293b; color: white; }
    .btn-dark:hover { background: #0f172a; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .btn-outline { background: white; border: 1.5px solid #d1d5db; color: #374151; }
    .btn-outline:hover { background: #f8fafc; border-color: var(--primary); color: var(--primary); }

    .page-content {
      background: #fff;
      padding: 24px;
      border: 1px solid #d1d9e0;
      box-shadow: var(--card-shadow);
      border-radius: var(--radius);
    }

    .header-table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
    .header-table td { border: 1px solid var(--border); padding: 10px; vertical-align: middle; }
    .logo-cell { width: 90px; text-align: center; background: var(--light-blue); }
    .meta-cell { width: 32%; font-size: 11px; background: #fafcff; }
    .circular-logo { width: 58px; height: 58px; border-radius: 50%; object-fit: cover; display: block; margin: 0 auto; border: 2px solid var(--border); }
    .company-name { font-size: 15px; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.03em; }
    .company-addr { font-size: 10px; color: #555; margin-top: 3px; }
    .cert-title { font-size: 12px; font-weight: 700; text-decoration: underline; margin-top: 6px; display: block; color: var(--primary); letter-spacing: 0.02em; }
    .meta-row { display: flex; gap: 6px; margin-bottom: 3px; font-size: 10.5px; }
    .meta-row span { color: #666; }
    .meta-row strong { color: var(--primary); font-family: "IBM Plex Mono", monospace; font-size: 10px; }

    .info-bar {
      display: flex; flex-wrap: wrap; gap: 0;
      border: 1px solid var(--border); border-top: none;
      background: #fafcff; margin-bottom: 8px;
    }
    .info-bar-item {
      flex: 1 1 auto; min-width: 160px;
      padding: 8px 14px; font-size: 10.5px;
      border-right: 1px solid var(--border);
    }
    .info-bar-item:last-child { border-right: none; }
    .info-bar-item span { color: #666; }
    .info-bar-item strong { color: var(--primary); font-weight: 600; }

    .grid-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border: 1px solid var(--border);
      margin-bottom: 8px;
      border-radius: 4px;
      overflow: hidden;
    }
    .grid-item {
      border: 0.5px solid #e2e8f0; padding: 8px 10px;
      display: flex; justify-content: space-between; align-items: center; gap: 6px;
      transition: background 0.15s;
    }
    .grid-item:hover { background: var(--light-blue); }
    .label { color: #64748b; font-weight: 500; font-size: 10px; }
    .value { font-weight: 700; font-size: 10px; text-align: right; color: var(--primary); font-family: "IBM Plex Mono", monospace; }

    .refs-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      border: 1px solid var(--border);
      margin-bottom: 10px;
      border-radius: 4px;
      overflow: hidden;
    }
    .ref-col { border-right: 1px solid var(--border); }
    .ref-col:last-child { border-right: none; }
    .ref-row {
      display: flex; justify-content: space-between;
      padding: 6px 10px; border-bottom: 0.5px solid #e8edf3;
      font-size: 10px;
    }
    .ref-row span { color: #64748b; }
    .ref-row strong { color: var(--primary); font-family: "IBM Plex Mono", monospace; font-size: 9.5px; }

    .table-title {
      background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
      color: white; font-weight: 700; text-align: center;
      padding: 8px; text-transform: uppercase; font-size: 11px;
      letter-spacing: 0.08em; border-radius: 4px 4px 0 0;
    }

    .table-wrapper { width: 100%; overflow-x: auto; margin-bottom: 10px; border: 1px solid var(--border); border-radius: 0 0 4px 4px; }
    table.data-table { width: 100%; border-collapse: collapse; min-width: 680px; }
    table.data-table th, table.data-table td { border: 1px solid var(--border); padding: 7px 5px; text-align: center; font-size: 10px; }
    table.data-table th { background: var(--light-blue); color: var(--primary); font-weight: 700; letter-spacing: 0.02em; }
    table.data-table tbody tr:nth-child(even) { background: #f9fbff; }
    table.data-table tbody tr:hover { background: #eef3fb; }
    .duty-point-row { background-color: var(--highlight) !important; font-weight: 700; }
    .duty-point-row td { border-color: #a8c4e0 !important; }

    .side-flex { display: flex; flex-wrap: wrap; border-radius: 0; overflow: hidden; }
    .side-left { flex: 2; border-right: 1px solid var(--border); min-width: 280px; }
    .side-right { flex: 1.2; min-width: 220px; }
    .side-header { background: var(--light-blue); font-weight: 700; text-align: center; padding: 8px; border-bottom: 1px solid var(--border); color: var(--primary); font-size: 11px; letter-spacing: 0.03em; }

    .mech-container { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 6px; margin-bottom: 12px; }
    .mech-card { border: 1px solid var(--border); overflow-x: auto; border-radius: 4px; }
    .mech-table { width: 100%; border-collapse: collapse; min-width: 260px; }
    .mech-table td, .mech-table th { border: 1px solid #e2e8f0; padding: 6px 10px; font-size: 10px; }
    .mech-header { background: var(--light-blue); color: var(--primary); font-weight: 700; text-align: center; letter-spacing: 0.03em; }
    .mech-row-header { background: #f7f9fc; font-weight: 600; width: 42%; color: #374151; }

    .tolerance-section { background: var(--tolerance-bg); border: 1px solid var(--border); margin: 10px 0; overflow-x: auto; border-radius: 4px; }
    .tolerance-header { background: linear-gradient(90deg, var(--primary), var(--primary-light)); color: white; text-align: center; font-weight: 700; padding: 8px; font-size: 11px; letter-spacing: 0.06em; }
    .tolerance-table { width: 100%; border-collapse: collapse; min-width: 420px; }
    .tolerance-table td { border: 1px solid var(--border); padding: 9px 12px; font-size: 10px; }
    .tolerance-label { font-weight: 700; color: var(--primary); background: #fdfdff; width: 25%; }

    .footer-signs { margin-top: 18px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 14px; }
    .sign-box { border: 1px solid var(--border); padding: 16px; flex: 1; min-width: 180px; text-align: center; border-radius: 4px; background: #fafcff; }
    .sign-line { border-top: 1.5px solid #94a3b8; margin-top: 44px; padding-top: 6px; font-size: 10px; font-weight: 700; color: var(--primary); }

    /* ── Modal ── */
    .modal { display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.75); overflow-y: auto; backdrop-filter: blur(4px); }
    .modal-content { background: #fff; margin: 2% auto; padding: 20px; width: 95%; max-width: 1100px; border-radius: 12px; box-shadow: 0 24px 64px rgba(0,0,0,0.3); }
    .modal-close { float: right; cursor: pointer; font-size: 28px; line-height: 1; color: #94a3b8; transition: color 0.15s; padding: 4px 8px; }
    .modal-close:hover { color: var(--primary); }
    .modal-title { color: var(--primary); text-align: center; font-weight: 700; margin-bottom: 20px; font-size: 16px; letter-spacing: 0.05em; }

    /* ── Composite Chart Box ── */
    .chart-box {
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 16px;
      background: white;
      position: relative;
    }

    /* ── Chart legend strip ── */
    .chart-legend-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
      justify-content: center;
      margin-bottom: 10px;
      font-size: 11px;
      font-family: "IBM Plex Sans", sans-serif;
    }
    .chart-legend-item {
      display: flex;
      align-items: center;
      gap: 7px;
      color: #374151;
    }
    .legend-line {
      width: 28px;
      height: 3px;
      border-radius: 2px;
      display: inline-block;
    }
    .legend-diamond {
      width: 10px;
      height: 10px;
      background: #f59e0b;
      border: 2px solid #b45309;
      transform: rotate(45deg);
      display: inline-block;
    }

    /* ── Print graph area ── */
    #print-graphs-area { display: none; }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .grid-container { grid-template-columns: repeat(2, 1fr); }
      .refs-section { grid-template-columns: 1fr 1fr; }
      .refs-section .ref-col:last-child { border-top: 1px solid var(--border); grid-column: 1 / -1; border-right: none; }
      .mech-container { grid-template-columns: 1fr; }
      .side-flex { flex-direction: column; }
      .side-left { border-right: none; border-bottom: 1px solid var(--border); }
    }

    @media (max-width: 640px) {
      body { font-size: 12px; }
      .page-content { padding: 12px; }
      .header-table, .header-table tbody, .header-table tr, .header-table td { display: block; width: 100%; }
      .logo-cell { padding: 12px; text-align: left; display: flex; align-items: center; gap: 12px; border-bottom: none; }
      .circular-logo { width: 48px; height: 48px; margin: 0; }
      .logo-cell-text { flex: 1; }
      .company-cell { padding: 10px 12px; border-bottom: none; }
      .meta-cell { width: 100%; font-size: 10px; background: #f4f8ff; padding: 10px 12px; }
      .grid-container { grid-template-columns: repeat(2, 1fr); }
      .grid-item { flex-direction: column; align-items: flex-start; gap: 2px; }
      .value { text-align: left; }
      .refs-section { grid-template-columns: 1fr; }
      .refs-section .ref-col { border-right: none; border-bottom: 1px solid var(--border); }
      .refs-section .ref-col:last-child { border-bottom: none; }
      .action-bar { flex-direction: column; }
      .btn { width: 100%; justify-content: center; }
      .tolerance-table { min-width: 360px; }
      .footer-signs { flex-direction: column; }
      .sign-box { min-width: 100%; }
      .info-bar-item { min-width: 100%; border-right: none; border-bottom: 1px solid var(--border); }
      .info-bar-item:last-child { border-bottom: none; }
      .modal-content { margin: 0; width: 100%; min-height: 100vh; border-radius: 0; padding: 14px; }
    }

    @media (max-width: 380px) {
      .grid-container { grid-template-columns: 1fr; }
    }

    @media print {
      .header-nav, .action-bar { display: none !important; }
      body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page-content { border: none; box-shadow: none; margin: 0; padding: 10px; width: 100%; border-radius: 0; }
      #print-graphs-area {
        display: block !important;
        width: 100%;
        page-break-before: always;
      }
      #print-graphs-area .chart-box { height: 460px; width: 100%; margin-bottom: 0; }
      .chart-box { page-break-inside: avoid; }
      table.data-table { min-width: 100%; }
      .grid-container { grid-template-columns: repeat(4, 1fr) !important; }
      .refs-section { grid-template-columns: repeat(3, 1fr) !important; }
      .mech-container { grid-template-columns: 1fr 1fr !important; }
      .side-flex { flex-direction: row !important; }
      .side-left { border-right: 1px solid var(--border) !important; border-bottom: none !important; }
      .info-bar-item { min-width: auto !important; border-right: 1px solid var(--border) !important; border-bottom: none !important; }
      .info-bar-item:last-child { border-right: none !important; }
      .footer-signs { flex-direction: row !important; }
      .sign-box { min-width: 0 !important; }
      .header-table td { display: table-cell !important; }
      .header-table tr { display: table-row !important; }
      .header-table tbody { display: table-row-group !important; }
      .header-table { display: table !important; }
    }
  </style>
</head>
<body class="bg-gray-50">

  <!-- ── Header ── -->
  <header class="bg-white shadow-sm sticky top-0 z-50 header-nav" style="border-bottom: 2px solid var(--light-blue);">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <img src="https://undertaker099.s3.ap-south-1.amazonaws.com/NodeJs_Excel_Uploads/logo+(1).png" alt="Pumpsense Logo" class="h-10 w-auto object-contain block">
        <div class="border-l border-gray-200 pl-3">
          <h1 class="text-lg font-bold tracking-tight text-slate-900 uppercase leading-none">Pumpsense</h1>
          <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Fluid Engineering</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <nav class="hidden md:flex items-center gap-5 mr-2">
          <a href="/view-files" class="text-sm font-medium text-slate-500 hover:text-blue-700 transition-colors">Performance Reports</a>
          <% if (user.role === 'MASTER' || user.role === 'REPORT TEAM') { %>
            <a href="/upload" class="text-sm font-medium text-slate-500 hover:text-blue-700 transition-colors">Upload Report</a>
          <% } %>
          <% if (user.role === 'MASTER' || user.role === 'DESIGN TEAM' || user.role === 'REPORT TEAM') { %>
            <a href="/upload-design" class="text-sm font-medium text-slate-500 hover:text-blue-700 transition-colors">Upload Design</a>
          <% } %>
        </nav>
        <button id="mobileMenuBtn" class="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
          <i class="fa-solid fa-bars text-sm"></i>
        </button>
        <div class="relative">
          <button id="profileTrigger" class="focus:outline-none transition-transform hover:scale-105 active:scale-95">
            <div class="w-9 h-9 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white text-sm">
              <%= user.username.charAt(0).toUpperCase() %>
            </div>
          </button>
          <div id="profileDropdown" class="dropdown-menu absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
            <div class="p-4 bg-gray-50 border-b border-gray-100 text-center">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
              <p class="text-sm font-bold text-slate-900 truncate"><%= user.username %></p>
            </div>
            <div class="p-2">
              <div class="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50">
                <i class="fa-solid fa-user-shield text-blue-500 w-4"></i>
                <div>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">System Role</p>
                  <p class="text-xs font-black text-blue-700"><%= user.role %></p>
                </div>
              </div>
              <hr class="my-2 border-gray-100">
              <a href="/logout" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                <i class="fa-solid fa-right-from-bracket w-4"></i>
                <span class="text-sm font-semibold">Logout</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="mobileNav" class="hidden md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-2">
      <a href="/view-files" class="text-sm font-medium text-slate-600 py-2 px-3 rounded-lg hover:bg-slate-50">
        <i class="fa-solid fa-file-lines mr-2 text-slate-400"></i> Performance Reports
      </a>
      <% if (user.role === 'MASTER' || user.role === 'REPORT TEAM') { %>
        <a href="/upload" class="text-sm font-medium text-slate-600 py-2 px-3 rounded-lg hover:bg-slate-50">
          <i class="fa-solid fa-upload mr-2 text-slate-400"></i> Upload Report
        </a>
      <% } %>
      <% if (user.role === 'MASTER' || user.role === 'DESIGN TEAM' || user.role === 'REPORT TEAM') { %>
        <a href="/upload-design" class="text-sm font-medium text-slate-600 py-2 px-3 rounded-lg hover:bg-slate-50">
          <i class="fa-solid fa-drafting-compass mr-2 text-slate-400"></i> Upload Design
        </a>
      <% } %>
    </div>
  </header>

  <main class="max-w-7xl mx-auto p-3 md:p-6 fade-in">

    <!-- ── Action Buttons ── -->
    <div class="action-bar">
      <button onclick="openGraphModal()" class="btn btn-primary">
        <i class="fa-solid fa-chart-line"></i> View Curves
      </button>
      <button onclick="prepareAndPrint()" class="btn btn-dark">
        <i class="fa-solid fa-print"></i> Print Report
      </button>
      <% if (report.alteredData) { %>
        <button id="toggleDataBtn" onclick="toggleData()" class="btn btn-outline">
          <i class="fa-solid fa-shuffle"></i> View Altered Data
        </button>
      <% } %>
    </div>

    <!-- ── Certificate ── -->
    <div class="page-content" id="certificateContent">
      <div id="data-container">

        <!-- Header -->
        <table class="header-table">
          <tr>
            <td class="logo-cell">
              <img src="https://undertaker099.s3.ap-south-1.amazonaws.com/NodeJs_Excel_Uploads/logo+(1).png" alt="LOGO" class="circular-logo" onerror="this.src='/logo.png'">
            </td>
            <td class="company-cell">
              <div class="company-name" id="field-company-name"><%= report.trueData.company.name %></div>
              <div class="company-addr" id="field-company-address"><%= report.trueData.company.address %></div>
              <span class="cert-title">Pump Performance Test Certificate</span>
            </td>
            <td class="meta-cell">
              <div class="meta-row"><span>Doc. No.:</span>&nbsp;<strong id="field-documentNo"><%= report.trueData.documentDetails.documentNo || 'PSF/PDP/F-34' %></strong></div>
              <div class="meta-row"><span>Report No.:</span>&nbsp;<strong id="field-reportNo"><%= report.trueData.documentDetails.reportNo %></strong></div>
              <div class="meta-row"><span>Test Date:</span>&nbsp;<strong><span id="field-testDate"><%= report.trueData.documentDetails.testDate ? new Date(report.trueData.documentDetails.testDate).toLocaleDateString('en-GB') : '-' %></span></strong></div>
              <div class="meta-row"><span>Test Time:</span>&nbsp;<strong><span id="field-testTime"><%= report.trueData.documentDetails.testTime || '-' %></span></strong></div>
              <div class="meta-row"><span>Test Code:</span>&nbsp;<strong><span id="field-testCode"><%= report.trueData.documentDetails.testCode %></span></strong></div>
            </td>
          </tr>
        </table>

        <!-- Info Bar -->
        <div class="info-bar">
          <div class="info-bar-item">
            <span>Acceptance Grade: </span><strong id="field-toleranceGrade"><%= report.trueData.documentDetails.toleranceGrade %></strong>
          </div>
          <div class="info-bar-item">
            <span>Customer: </span><strong id="field-customerName"><%= report.trueData.documentDetails.customerName || 'N/A' %></strong>
          </div>
          <div class="info-bar-item">
            <span>VFD Driven: </span><strong id="field-drivenThroughVFD"><%= report.trueData.testSummary.drivenThroughVFD || 'NO' %></strong>
          </div>
        </div>

        <!-- Technical Info Grid -->
        <div class="grid-container">
          <div class="grid-item"><span class="label">Pump Model:</span><span class="value" id="field-model"><%= report.trueData.pumpDetails.model %></span></div>
          <div class="grid-item"><span class="label">Pump Sl No.:</span><span class="value" id="field-pump-serialNo"><%= report.trueData.pumpDetails.serialNo %></span></div>
          <div class="grid-item"><span class="label">Motor Make:</span><span class="value" id="field-make"><%= report.trueData.motorDetails.make %></span></div>
          <div class="grid-item"><span class="label">Frame:</span><span class="value" id="field-frame"><%= report.trueData.motorDetails.frame %></span></div>
          <div class="grid-item"><span class="label">Suction Size (mm):</span><span class="value" id="field-suctionSizeMm"><%= report.trueData.pumpDetails.suctionSizeMm %></span></div>
          <div class="grid-item"><span class="label">Del. Size (mm):</span><span class="value" id="field-deliverySizeMm"><%= report.trueData.pumpDetails.deliverySizeMm %></span></div>
          <div class="grid-item"><span class="label">Motor Rating (kW):</span><span class="value" id="field-ratingKW"><%= Number(report.trueData.motorDetails.ratingKW || 0).toFixed(2) %></span></div>
          <div class="grid-item"><span class="label">Motor Sl. No:</span><span class="value" id="field-motor-serialNo"><%= report.trueData.motorDetails.serialNo %></span></div>
          <div class="grid-item"><span class="label">Impeller Dia (mm):</span><span class="value" id="field-impellerDiameterMm"><%= Number(report.trueData.pumpDetails.impellerDiameterMm || 0).toFixed(1) %></span></div>
          <div class="grid-item"><span class="label">Impeller Type:</span><span class="value" id="field-impellerType"><%= report.trueData.pumpDetails.impellerType %></span></div>
          <div class="grid-item"><span class="label">Phase / Freq:</span><span class="value"><span id="field-phase"><%= report.trueData.motorDetails.phase %></span> Ph / <span id="field-frequencyHz"><%= report.trueData.motorDetails.frequencyHz %></span> Hz</span></div>
          <div class="grid-item"><span class="label">Voltage / Speed:</span><span class="value"><span id="field-voltageV"><%= report.trueData.motorDetails.voltageV %></span> V / <span id="field-speedRpm"><%= report.trueData.motorDetails.speedRpm %></span> rpm</span></div>
        </div>

        <!-- Measurement References -->
        <div class="refs-section">
          <div class="ref-col">
            <div class="ref-row"><span>Flow by:</span><strong id="field-capacityMeasuredBy"><%= report.trueData.measurementReferences.capacityMeasuredBy %></strong></div>
            <div class="ref-row"><span>Speed by:</span><strong id="field-speedMeasuredBy"><%= report.trueData.measurementReferences.speedMeasuredBy %></strong></div>
            <div class="ref-row"><span>Suc. Head by:</span><strong id="field-suctionHeadMeasuredBy"><%= report.trueData.measurementReferences.suctionHeadMeasuredBy %></strong></div>
            <div class="ref-row"><span>Del. Head by:</span><strong id="field-deliveryHeadMeasuredBy"><%= report.trueData.measurementReferences.deliveryHeadMeasuredBy %></strong></div>
            <div class="ref-row"><span>Power by:</span><strong id="field-powerMeasuredBy"><%= report.trueData.measurementReferences.powerMeasuredBy %></strong></div>
            <div class="ref-row"><span>Mot. Eff. Ref:</span><strong id="field-motorEfficiencyReference"><%= report.trueData.measurementReferences.motorEfficiencyReference %></strong></div>
          </div>
          <div class="ref-col">
            <div class="ref-row"><span>Atm. Press (mbar):</span><strong id="field-atmosphericPressureMbar"><%= Number(report.trueData.testConditions.atmosphericPressureMbar || 0).toFixed(1) %></strong></div>
            <div class="ref-row"><span>Liquid Temp (°C):</span><strong id="field-liquidTempC"><%= Number(report.trueData.testConditions.liquidTempC || 0).toFixed(1) %></strong></div>
            <div class="ref-row"><span>Liq. Sp. Gravity:</span><strong id="field-liquidSpecificGravity"><%= Number(report.trueData.testConditions.liquidSpecificGravity || 1).toFixed(2) %></strong></div>
            <div class="ref-row"><span>NPSHa (m):</span><strong id="field-npshAvailableM"><%= Number(report.trueData.testConditions.npshAvailableM || 0).toFixed(1) %></strong></div>
            <div class="ref-row"><span>Amb. Temp (°C):</span><strong id="field-ambientTempC"><%= Number(report.trueData.testConditions.ambientTempC || 0).toFixed(1) %></strong></div>
          </div>
          <div class="ref-col">
            <div class="ref-row"><span>Motor Current:</span><strong id="field-currentAmps"><%= Number(report.trueData.motorDetails.currentAmps || 0).toFixed(1) %> A</strong></div>
            <div class="ref-row"><span>Test Start:</span><strong id="field-testStartedAt"><%= report.trueData.testSummary.testStartedAt || '-' %></strong></div>
            <div class="ref-row"><span>Test End:</span><strong id="field-testEndedAt"><%= report.trueData.testSummary.testEndedAt || '-' %></strong></div>
            <div class="ref-row"><span>Guaranteed Speed:</span><strong id="field-guaranteedSpeedRpm"><%= report.trueData.testSummary.guaranteedSpeedRpm || '-' %> RPM</strong></div>
          </div>
        </div>

        <!-- Observations Table -->
        <div class="table-title">Performance Test Observations</div>
        <div class="table-wrapper">
          <table class="data-table" id="obs-table">
            <thead>
              <tr>
                <th rowspan="2">Sl.</th><th rowspan="2">Speed</th>
                <th colspan="4">Pressure Reading (m)</th>
                <th rowspan="2">Head (m)</th><th rowspan="2">Flow (m³/hr)</th>
                <th colspan="5">Efficiency & Power</th>
              </tr>
              <tr>
                <th>Suc.</th><th>Del.</th><th>Vel.</th><th>Loss</th>
                <th>Out (kW)</th><th>In (kW)</th><th>Mot%</th><th>Pump (kW)</th><th>Eff%</th>
              </tr>
            </thead>
            <tbody id="obs-table-body">
              <% report.trueData.observations.forEach(obs => { %>
                <tr>
                  <td><%= obs.slNo %></td>
                  <td><%= Number(obs.pumpSpeedRpm).toFixed(0) %></td>
                  <td><%= Number(obs.suctionGaugeKgCm2).toFixed(2) %></td>
                  <td><%= Number(obs.deliveryGaugeKgCm2).toFixed(2) %></td>
                  <td><%= Number(obs.velocityHeadCorrectionM).toFixed(2) %></td>
                  <td><%= Number(obs.headLossIncreaserReducerM).toFixed(2) %></td>
                  <td><strong><%= Number(obs.totalHeadM).toFixed(2) %></strong></td>
                  <td><%= Number(obs.flowM3Hr).toFixed(2) %></td>
                  <td><%= Number(obs.pumpOutputKW).toFixed(2) %></td>
                  <td><%= Number(obs.motorInputKW).toFixed(2) %></td>
                  <td><%= Number(obs.motorEfficiencyPercent).toFixed(1) %></td>
                  <td><%= Number(obs.pumpInputKW).toFixed(2) %></td>
                  <td><strong style="color:var(--primary);"><%= Number(obs.pumpEfficiencyPercent).toFixed(1) %></strong></td>
                </tr>
              <% }) %>
            </tbody>
          </table>
        </div>

        <!-- Rated Speed & Guarantee -->
        <div style="overflow-x: auto; margin-bottom: 12px; border: 1px solid var(--border); border-radius: 4px;">
          <div class="side-flex" style="border: none; margin-bottom: 0; min-width: 560px;">
            <div class="side-left">
              <div class="side-header">AT RATED SPEED: <%= report.trueData.testSummary.guaranteedSpeedRpm %> RPM</div>
              <div class="table-wrapper" style="border:none; margin-bottom:0;">
                <table class="data-table" id="rated-table" style="min-width: 340px;">
                  <thead>
                    <tr><th>Sl.</th><th>Head (m)</th><th>Flow (m³/h)</th><th>Power (kW)</th><th>Sp. Gr.</th><th>Eff%</th></tr>
                  </thead>
                  <tbody id="rated-table-body">
                    <% report.trueData.ratedSpeedData.forEach(p => { %>
                      <tr class="<%= p.nearestDutyPoint ? 'duty-point-row' : '' %>">
                        <td><%= p.slNo %></td>
                        <td><%= Number(p.totalHeadM).toFixed(1) %></td>
                        <td><%= Number(p.flowM3Hr).toFixed(1) %></td>
                        <td><%= Number(p.powerKW).toFixed(1) %></td>
                        <td><%= Number(p.specificGravity || 1.0).toFixed(2) %></td>
                        <td><%= Number(p.pumpEfficiencyPercent).toFixed(1) %></td>
                      </tr>
                    <% }) %>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="side-right">
              <div class="side-header">PUMP GUARANTEE</div>
              <table class="data-table" style="min-width: 200px;">
                <tbody>
                  <tr><td style="text-align:left; padding-left:14px; color:#64748b;">Total Head:</td><td><strong id="field-guaranteedTotalHeadM"><%= Number(report.trueData.testSummary.guaranteedTotalHeadM || 0).toFixed(2) %></strong> m</td></tr>
                  <tr><td style="text-align:left; padding-left:14px; color:#64748b;">Discharge:</td><td><strong id="field-guaranteedDischargeM3Hr"><%= Number(report.trueData.testSummary.guaranteedDischargeM3Hr || 0).toFixed(2) %></strong> m³/hr</td></tr>
                  <tr><td style="text-align:left; padding-left:14px; color:#64748b;">Efficiency:</td><td><strong id="field-guaranteedEfficiencyPercent"><%= Number(report.trueData.testSummary.guaranteedEfficiencyPercent || 0).toFixed(2) %></strong> %</td></tr>
                  <tr><td style="text-align:left; padding-left:14px; color:#64748b;">Max Input Power:</td><td><strong id="field-guaranteedPumpInputKW"><%= report.trueData.testSummary.guaranteedPumpInputKW ? Number(report.trueData.testSummary.guaranteedPumpInputKW).toFixed(2) : '-' %></strong> kW</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Mechanical Test Records -->
        <div class="table-title">Mechanical Test Records</div>
        <div class="mech-container">
          <div class="mech-card">
            <table class="mech-table">
              <tr><td class="mech-row-header">Pump Sl No.:</td><td><strong id="field-mech-pumpSerialNo"><%= report.trueData.mechanicalTest.pumpSerialNo || report.trueData.pumpDetails.serialNo %></strong></td></tr>
              <tr><td class="mech-row-header">Model Name:</td><td><strong id="field-mech-modelName"><%= report.trueData.mechanicalTest.modelName || report.trueData.pumpDetails.model %></strong></td></tr>
              <tr><td class="mech-row-header">Pump Type:</td><td id="field-pumpType"><%= report.trueData.mechanicalTest.pumpType %></td></tr>
              <tr><td class="mech-row-header">Power Rating:</td><td id="field-powerRating"><%= report.trueData.mechanicalTest.powerRating %></td></tr>
              <tr>
                <td colspan="2" style="padding:0;">
                  <table class="mech-table" style="border:none;">
                    <tr class="mech-header"><td colspan="3">Vibration Level (mm/s):</td></tr>
                    <tr style="font-weight:700; background:#f4f6fa; text-align:center; font-size:10px;">
                      <td>Axis</td><td>Pump DE</td><td>Pump NDE</td>
                    </tr>
                    <tr><td class="mech-row-header">Horizontal</td><td style="text-align:center;" id="field-horizontalDE"><%= Number(report.trueData.mechanicalTest.vibration.horizontalDE || 0).toFixed(2) %></td><td style="text-align:center;" id="field-horizontalNDE"><%= Number(report.trueData.mechanicalTest.vibration.horizontalNDE || 0).toFixed(2) %></td></tr>
                    <tr><td class="mech-row-header">Vertical</td><td style="text-align:center;" id="field-verticalDE"><%= Number(report.trueData.mechanicalTest.vibration.verticalDE || 0).toFixed(2) %></td><td style="text-align:center;" id="field-verticalNDE"><%= Number(report.trueData.mechanicalTest.vibration.verticalNDE || 0).toFixed(2) %></td></tr>
                    <tr><td class="mech-row-header">Axial</td><td style="text-align:center;" id="field-axialDE"><%= Number(report.trueData.mechanicalTest.vibration.axialDE || 0).toFixed(2) %></td><td style="text-align:center;" id="field-axialNDE"><%= Number(report.trueData.mechanicalTest.vibration.axialNDE || 0).toFixed(2) %></td></tr>
                    <tr style="background:#fff8ed;">
                      <td class="mech-row-header">Max Allowable</td>
                      <td style="text-align:center;"><strong id="field-maxAllowableDE"><%= Number(report.trueData.mechanicalTest.vibration.maxAllowableDE || 0).toFixed(2) %></strong></td>
                      <td style="text-align:center;"><strong id="field-maxAllowableNDE"><%= Number(report.trueData.mechanicalTest.vibration.maxAllowableNDE || 0).toFixed(2) %></strong></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
          <div class="mech-card">
            <table class="mech-table">
              <tr class="mech-header"><td colspan="2">Temp & Noise Observed:</td></tr>
              <tr><td class="mech-row-header">DE Temp (°C):</td><td><strong id="field-deC"><%= Number(report.trueData.mechanicalTest.bearingTemperature.deC || 0).toFixed(1) %></strong></td></tr>
              <tr><td class="mech-row-header">NDE Temp (°C):</td><td><strong id="field-ndeC"><%= Number(report.trueData.mechanicalTest.bearingTemperature.ndeC || 0).toFixed(1) %></strong></td></tr>
              <tr><td class="mech-row-header">Noise (dBA):</td><td><strong id="field-noiseLevelDBA"><%= report.trueData.mechanicalTest.noiseLevelDBA %></strong></td></tr>
              <tr class="mech-header"><td colspan="2">Leakage Observations:</td></tr>
              <tr><td class="mech-row-header">Press. Containment:</td><td id="field-pressureContainment"><%= report.trueData.mechanicalTest.leakage.pressureContainment %></td></tr>
              <tr><td class="mech-row-header">Gasket:</td><td id="field-gasket"><%= report.trueData.mechanicalTest.leakage.gasket %></td></tr>
              <tr><td class="mech-row-header">Seal Piping:</td><td id="field-mechanicalSealPiping"><%= report.trueData.mechanicalTest.leakage.mechanicalSealPiping %></td></tr>
              <tr><td class="mech-row-header">Packings/Seal:</td><td id="field-packingsOrSeal"><%= report.trueData.mechanicalTest.leakage.packingsOrSeal %></td></tr>
              <tr><td class="mech-row-header">Bearing Housing:</td><td id="field-bearingHousing"><%= report.trueData.mechanicalTest.leakage.bearingHousing %></td></tr>
              <tr><td class="mech-row-header">Free Rotating:</td><td id="field-freeRunningRotatingParts"><strong><%= report.trueData.mechanicalTest.freeRunningRotatingParts %></strong></td></tr>
              <tr><td class="mech-row-header">Engineer:</td><td id="field-testEngineerName"><strong><%= report.trueData.mechanicalTest.testEngineerName %></strong></td></tr>
            </table>
          </div>
        </div>

        <!-- Tolerances -->
        <div class="tolerance-section">
          <div class="tolerance-header">TOLERANCE REPORT (ISO 9906)</div>
          <table class="tolerance-table">
            <tr>
              <td class="tolerance-label">Flow Tolerance:</td>
              <td id="field-flowTolerance"><%= Number(report.trueData.tolerances.flowTolerance || 0).toFixed(2) %> %</td>
              <td class="tolerance-label">Head Tolerance:</td>
              <td id="field-headTolerance"><%= Number(report.trueData.tolerances.headTolerance || 0).toFixed(2) %> %</td>
            </tr>
            <tr>
              <td class="tolerance-label">Efficiency Tolerance:</td>
              <td id="field-efficiencyTolerance"><%= Number(report.trueData.tolerances.efficiencyTolerance || 0).toFixed(2) %> %</td>
              <td class="tolerance-label">Power Tolerance:</td>
              <td id="field-powerTolerance"><%= Number(report.trueData.tolerances.powerTolerance || 0).toFixed(2) %> %</td>
            </tr>
          </table>
        </div>

        <!-- Signatures -->
        <div class="footer-signs">
          <div class="sign-box">
            <div class="sign-line" id="field-customerAgency"><%= report.trueData.representatives.customerAgency || 'Customer / Agency' %></div>
            <p style="font-size:10px; color:#64748b; margin-top:6px;">Authorized Customer Representative</p>
          </div>
          <div class="sign-box">
            <div class="sign-line" id="field-manufacturer"><%= report.trueData.representatives.manufacturer || 'Manufacturer' %></div>
            <p style="font-size:10px; color:#64748b; margin-top:6px;">Authorized Manufacturer Signatory</p>
          </div>
          <div class="sign-box">
            <div class="sign-line" id="field-sign-engineer"><%= report.trueData.mechanicalTest.testEngineerName %></div>
            <p style="font-size:10px; color:#64748b; margin-top:6px;">Test Engineer – Pumpsense Fluid Engg.</p>
          </div>
        </div>
      </div>

      <!-- Print Graph Area -->
      <div id="print-graphs-area">
        <h2 style="color:var(--primary); text-align:center; margin-top:30px; font-weight:700; letter-spacing:0.05em; font-size:14px; text-transform:uppercase;">Pump Performance Curves</h2>
        <p style="text-align:center; font-size:10px; color:#64748b; margin-bottom:12px;">H-Q &nbsp;|&nbsp; η-Q &nbsp;|&nbsp; P-Q &nbsp; Composite Characteristic</p>
        <div class="chart-box" style="height: 460px;">
          <canvas id="compositeChartPrint" role="img" aria-label="Composite pump performance curves showing Head, Efficiency and Power vs Flow"></canvas>
        </div>
      </div>
    </div>
  </main>

  <!-- ── Graph Modal ── -->
  <div id="graphModal" class="modal">
    <div class="modal-content">
      <span class="modal-close" onclick="closeGraphModal()">&times;</span>
      <div class="modal-title">
        <i class="fa-solid fa-chart-line mr-2" style="color:var(--accent);"></i>
        PUMP PERFORMANCE CURVES &nbsp;<span style="font-weight:400; font-size:12px; color:#64748b;">H-Q &nbsp;|&nbsp; η-Q &nbsp;|&nbsp; P-Q</span>
      </div>

      <!-- Custom legend -->
      <div class="chart-legend-strip" id="modal-legend">
        <div class="chart-legend-item">
          <span class="legend-line" style="background:#003366;"></span>
          <span>Total Dynamic Head (m)</span>
        </div>
        <div class="chart-legend-item">
          <span class="legend-line" style="background:#b71c1c; border-top: 3px dashed #b71c1c; height:0; margin-top:1px;"></span>
          <span>Pump Efficiency (%)</span>
        </div>
        <div class="chart-legend-item">
          <span class="legend-line" style="background:transparent; border-top: 3px dashed #1b5e20; height:0; margin-top:1px; width:28px;"></span>
          <span>Shaft Power (kW)</span>
        </div>
        <div class="chart-legend-item" id="legend-design" style="display:none;">
          <span class="legend-diamond"></span>
          <span>Design Condition</span>
        </div>
      </div>

      <div class="chart-box" style="height: 460px;">
        <canvas id="compositeChartModal" role="img" aria-label="Composite pump performance curves showing Head, Efficiency and Power vs Flow"></canvas>
      </div>

      <!-- Axis labels note -->
      <div style="display:flex; justify-content:space-between; font-size:10px; color:#94a3b8; margin-top:8px; padding:0 4px;">
        <span style="color:#003366; font-weight:600;">← Left axis: Head (m) &amp; Power (kW)</span>
        <span style="color:#b71c1c; font-weight:600;">Right axis: Efficiency (%) →</span>
      </div>
    </div>
  </div>

  <script>
    const reportData = <%- JSON.stringify(report) %>;
    const designInfo = <%- JSON.stringify(design || null) %>;
    let currentDataSet = 'trueData';
    let charts = { modal: null, print: null };

    // Profile dropdown
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    profileTrigger.onclick = (e) => { e.stopPropagation(); profileDropdown.classList.toggle('show'); };
    window.onclick = () => profileDropdown.classList.remove('show');

    // Mobile nav
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav     = document.getElementById('mobileNav');
    mobileMenuBtn.onclick = (e) => { e.stopPropagation(); mobileNav.classList.toggle('hidden'); };

    function toggleData() {
      const btn = document.getElementById('toggleDataBtn');
      currentDataSet = (currentDataSet === 'trueData') ? 'alteredData' : 'trueData';
      btn.innerHTML = (currentDataSet === 'trueData')
        ? '<i class="fa-solid fa-shuffle"></i> View Altered Data'
        : '<i class="fa-solid fa-shuffle"></i> View Original Data';
      updateUI(reportData[currentDataSet]);
    }

    function fmt(v, d=2)       { return isNaN(Number(v)) ? (v || '-') : Number(v).toFixed(d); }
    function fmtOrDash(v, d=2) { return (v === null || v === undefined || v === '' || v === '-') ? '-' : fmt(v, d); }

    // ─── UI updater ────────────────────────────────────────────────────────────
    function updateUI(data) {
      document.getElementById('field-documentNo').innerText             = data.documentDetails.documentNo || '-';
      document.getElementById('field-reportNo').innerText               = data.documentDetails.reportNo || '-';
      document.getElementById('field-testDate').innerText               = data.documentDetails.testDate ? new Date(data.documentDetails.testDate).toLocaleDateString('en-GB') : '-';
      document.getElementById('field-testTime').innerText               = data.documentDetails.testTime || '-';
      document.getElementById('field-testCode').innerText               = data.documentDetails.testCode || '-';
      document.getElementById('field-toleranceGrade').innerText         = data.documentDetails.toleranceGrade || '-';
      document.getElementById('field-customerName').innerText           = data.documentDetails.customerName || 'N/A';
      document.getElementById('field-company-name').innerText           = data.company.name || '-';
      document.getElementById('field-company-address').innerText        = data.company.address || '-';
      document.getElementById('field-model').innerText                  = data.pumpDetails.model || '-';
      document.getElementById('field-pump-serialNo').innerText          = data.pumpDetails.serialNo || '-';
      document.getElementById('field-suctionSizeMm').innerText          = data.pumpDetails.suctionSizeMm ?? '-';
      document.getElementById('field-deliverySizeMm').innerText         = data.pumpDetails.deliverySizeMm ?? '-';
      document.getElementById('field-impellerDiameterMm').innerText     = fmt(data.pumpDetails.impellerDiameterMm, 1);
      document.getElementById('field-impellerType').innerText           = data.pumpDetails.impellerType || '-';
      document.getElementById('field-make').innerText                   = data.motorDetails.make || '-';
      document.getElementById('field-frame').innerText                  = data.motorDetails.frame || '-';
      document.getElementById('field-ratingKW').innerText               = fmt(data.motorDetails.ratingKW, 2);
      document.getElementById('field-motor-serialNo').innerText         = data.motorDetails.serialNo || '-';
      document.getElementById('field-phase').innerText                  = data.motorDetails.phase ?? '-';
      document.getElementById('field-frequencyHz').innerText            = data.motorDetails.frequencyHz ?? '-';
      document.getElementById('field-voltageV').innerText               = data.motorDetails.voltageV ?? '-';
      document.getElementById('field-speedRpm').innerText               = data.motorDetails.speedRpm ?? '-';
      document.getElementById('field-currentAmps').innerText            = fmt(data.motorDetails.currentAmps, 1) + ' A';
      document.getElementById('field-drivenThroughVFD').innerText       = data.testSummary.drivenThroughVFD || 'NO';
      document.getElementById('field-capacityMeasuredBy').innerText     = data.measurementReferences.capacityMeasuredBy || '-';
      document.getElementById('field-speedMeasuredBy').innerText        = data.measurementReferences.speedMeasuredBy || '-';
      document.getElementById('field-suctionHeadMeasuredBy').innerText  = data.measurementReferences.suctionHeadMeasuredBy || '-';
      document.getElementById('field-deliveryHeadMeasuredBy').innerText = data.measurementReferences.deliveryHeadMeasuredBy || '-';
      document.getElementById('field-powerMeasuredBy').innerText        = data.measurementReferences.powerMeasuredBy || '-';
      document.getElementById('field-motorEfficiencyReference').innerText = data.measurementReferences.motorEfficiencyReference || '-';
      document.getElementById('field-atmosphericPressureMbar').innerText = fmt(data.testConditions.atmosphericPressureMbar, 1);
      document.getElementById('field-liquidTempC').innerText             = fmt(data.testConditions.liquidTempC, 1);
      document.getElementById('field-liquidSpecificGravity').innerText   = fmt(data.testConditions.liquidSpecificGravity, 2);
      document.getElementById('field-npshAvailableM').innerText          = fmt(data.testConditions.npshAvailableM, 1);
      document.getElementById('field-ambientTempC').innerText            = fmt(data.testConditions.ambientTempC, 1);
      document.getElementById('field-testStartedAt').innerText           = data.testSummary.testStartedAt || '-';
      document.getElementById('field-testEndedAt').innerText             = data.testSummary.testEndedAt || '-';
      document.getElementById('field-guaranteedSpeedRpm').innerText      = (data.testSummary.guaranteedSpeedRpm || '-') + ' RPM';
      document.getElementById('field-guaranteedTotalHeadM').innerText    = fmtOrDash(data.testSummary.guaranteedTotalHeadM, 2);
      document.getElementById('field-guaranteedDischargeM3Hr').innerText = fmtOrDash(data.testSummary.guaranteedDischargeM3Hr, 2);
      document.getElementById('field-guaranteedEfficiencyPercent').innerText = fmtOrDash(data.testSummary.guaranteedEfficiencyPercent, 2);
      document.getElementById('field-guaranteedPumpInputKW').innerText   = fmtOrDash(data.testSummary.guaranteedPumpInputKW, 2);

      const ratedHeader = document.querySelector('.side-header');
      if (ratedHeader) ratedHeader.innerText = `AT RATED SPEED: ${data.testSummary.guaranteedSpeedRpm || '-'} RPM`;

      document.getElementById('field-flowTolerance').innerText       = fmt(data.tolerances.flowTolerance, 2) + ' %';
      document.getElementById('field-headTolerance').innerText       = fmt(data.tolerances.headTolerance, 2) + ' %';
      document.getElementById('field-efficiencyTolerance').innerText = fmt(data.tolerances.efficiencyTolerance, 2) + ' %';
      document.getElementById('field-powerTolerance').innerText      = fmt(data.tolerances.powerTolerance, 2) + ' %';
      document.getElementById('field-customerAgency').innerText      = data.representatives.customerAgency || 'Customer / Agency';
      document.getElementById('field-manufacturer').innerText        = data.representatives.manufacturer || 'Manufacturer';
      document.getElementById('field-mech-pumpSerialNo').innerText   = data.mechanicalTest.pumpSerialNo || data.pumpDetails.serialNo || '-';
      document.getElementById('field-mech-modelName').innerText      = data.mechanicalTest.modelName || data.pumpDetails.model || '-';
      document.getElementById('field-pumpType').innerText            = data.mechanicalTest.pumpType || '-';
      document.getElementById('field-powerRating').innerText         = data.mechanicalTest.powerRating || '-';
      document.getElementById('field-horizontalDE').innerText        = fmt(data.mechanicalTest.vibration.horizontalDE, 2);
      document.getElementById('field-horizontalNDE').innerText       = fmt(data.mechanicalTest.vibration.horizontalNDE, 2);
      document.getElementById('field-verticalDE').innerText          = fmt(data.mechanicalTest.vibration.verticalDE, 2);
      document.getElementById('field-verticalNDE').innerText         = fmt(data.mechanicalTest.vibration.verticalNDE, 2);
      document.getElementById('field-axialDE').innerText             = fmt(data.mechanicalTest.vibration.axialDE, 2);
      document.getElementById('field-axialNDE').innerText            = fmt(data.mechanicalTest.vibration.axialNDE, 2);
      document.getElementById('field-maxAllowableDE').innerText      = fmt(data.mechanicalTest.vibration.maxAllowableDE, 2);
      document.getElementById('field-maxAllowableNDE').innerText     = fmt(data.mechanicalTest.vibration.maxAllowableNDE, 2);
      document.getElementById('field-deC').innerText                 = fmt(data.mechanicalTest.bearingTemperature.deC, 1);
      document.getElementById('field-ndeC').innerText                = fmt(data.mechanicalTest.bearingTemperature.ndeC, 1);
      document.getElementById('field-noiseLevelDBA').innerText       = data.mechanicalTest.noiseLevelDBA || '-';
      document.getElementById('field-pressureContainment').innerText = data.mechanicalTest.leakage.pressureContainment || '-';
      document.getElementById('field-gasket').innerText              = data.mechanicalTest.leakage.gasket || '-';
      document.getElementById('field-mechanicalSealPiping').innerText = data.mechanicalTest.leakage.mechanicalSealPiping || '-';
      document.getElementById('field-packingsOrSeal').innerText      = data.mechanicalTest.leakage.packingsOrSeal || '-';
      document.getElementById('field-bearingHousing').innerText      = data.mechanicalTest.leakage.bearingHousing || '-';
      document.getElementById('field-freeRunningRotatingParts').innerText = data.mechanicalTest.freeRunningRotatingParts || '-';
      document.getElementById('field-testEngineerName').innerText    = data.mechanicalTest.testEngineerName || '-';
      document.getElementById('field-sign-engineer').innerText       = data.mechanicalTest.testEngineerName || '-';

      // Observations table
      const obsTbody = document.getElementById('obs-table-body');
      obsTbody.innerHTML = data.observations.length === 0
        ? `<tr><td colspan="13" style="text-align:center; color:#999; padding:16px;">No observations available</td></tr>`
        : data.observations.map(obs => `
          <tr>
            <td>${obs.slNo}</td>
            <td>${Number(obs.pumpSpeedRpm).toFixed(0)}</td>
            <td>${fmt(obs.suctionGaugeKgCm2,2)}</td>
            <td>${fmt(obs.deliveryGaugeKgCm2,2)}</td>
            <td>${fmt(obs.velocityHeadCorrectionM,2)}</td>
            <td>${fmt(obs.headLossIncreaserReducerM,2)}</td>
            <td><strong>${fmt(obs.totalHeadM,2)}</strong></td>
            <td>${fmt(obs.flowM3Hr,2)}</td>
            <td>${fmt(obs.pumpOutputKW,2)}</td>
            <td>${fmt(obs.motorInputKW,2)}</td>
            <td>${fmt(obs.motorEfficiencyPercent,1)}</td>
            <td>${fmt(obs.pumpInputKW,2)}</td>
            <td><strong style="color:var(--primary);">${fmt(obs.pumpEfficiencyPercent,1)}</strong></td>
          </tr>`).join('');

      // Rated speed table
      const ratedTbody = document.getElementById('rated-table-body');
      const sorted = [...data.ratedSpeedData].sort((a,b) => a.flowM3Hr - b.flowM3Hr);
      ratedTbody.innerHTML = sorted.map(p => `
        <tr class="${p.nearestDutyPoint ? 'duty-point-row' : ''}">
          <td>${p.slNo}</td>
          <td>${fmt(p.totalHeadM,1)}</td>
          <td>${fmt(p.flowM3Hr,1)}</td>
          <td>${fmt(p.powerKW,1)}</td>
          <td>${fmt(p.specificGravity || 1.0, 2)}</td>
          <td>${fmt(p.pumpEfficiencyPercent,1)}</td>
        </tr>`).join('');

      initCompositeChart('print');
    }

    // ─── Design match check ────────────────────────────────────────────────────
    function isDesignMatch() {
      if (!designInfo) return false;
      const rModel  = (reportData.trueData.pumpDetails.model   || "").trim().toLowerCase();
      const rSerial = (reportData.trueData.pumpDetails.serialNo || "").trim().toLowerCase();
      const dModel  = (designInfo.pumpModel  || "").trim().toLowerCase();
      const dSerial = (designInfo.serialNo   || "").trim().toLowerCase();
      return rModel === dModel && rSerial === dSerial;
    }

    // ─── Composite chart config builder ───────────────────────────────────────
    function buildCompositeConfig(isPrint) {
      const rawData = reportData[currentDataSet].ratedSpeedData;
      const data    = [...rawData].sort((a, b) => a.flowM3Hr - b.flowM3Hr);

      const flows  = data.map(d => d.flowM3Hr);
      const heads  = data.map(d => d.totalHeadM);
      const effs   = data.map(d => d.pumpEfficiencyPercent);
      const powers = data.map(d => d.powerKW);

      const maxLeft = Math.ceil(Math.max(...heads, ...powers) * 1.18 / 10) * 10;

      const datasets = [
        {
          label: 'H-Q  –  Total Dynamic Head (m)',
          data: flows.map((f, i) => ({ x: f, y: heads[i] })),
          yAxisID: 'yLeft',
          borderColor: '#003366',
          backgroundColor: 'rgba(0,51,102,0.07)',
          tension: 0.38,
          fill: false,
          pointRadius: isPrint ? 3 : 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#003366',
          borderWidth: 2.5,
          borderDash: [],
          order: 1
        },
        {
          label: 'η-Q  –  Pump Efficiency (%)',
          data: flows.map((f, i) => ({ x: f, y: effs[i] })),
          yAxisID: 'yRight',
          borderColor: '#b71c1c',
          backgroundColor: 'rgba(183,28,28,0.05)',
          tension: 0.38,
          fill: false,
          pointRadius: isPrint ? 3 : 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#b71c1c',
          borderWidth: 2.5,
          borderDash: [8, 4],
          order: 2
        },
        {
          label: 'P-Q  –  Shaft Power (kW)',
          data: flows.map((f, i) => ({ x: f, y: powers[i] })),
          yAxisID: 'yLeft',
          borderColor: '#1b5e20',
          backgroundColor: 'rgba(27,94,32,0.05)',
          tension: 0.38,
          fill: false,
          pointRadius: isPrint ? 3 : 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#1b5e20',
          borderWidth: 2,
          borderDash: [5, 5],
          order: 3
        }
      ];

      // Design condition point
      if (isDesignMatch() && designInfo.discharge) {
        datasets.push({
          label: 'Design Condition',
          data: [{ x: designInfo.discharge, y: designInfo.totalHead }],
          yAxisID: 'yLeft',
          backgroundColor: '#f59e0b',
          borderColor: '#92400e',
          pointRadius: isPrint ? 8 : 11,
          pointHoverRadius: 13,
          pointStyle: 'rectRot',
          showLine: false,
          borderWidth: 2.5,
          order: 0
        });
        const el = document.getElementById('legend-design');
        if (el) el.style.display = 'flex';
      }

      const maxFlow = Math.max(...flows);
      const tickFontSize = isPrint ? 9 : 11;
      const labelFontSize = isPrint ? 10 : 12;

      return {
        type: 'line',
        data: { datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: isPrint ? false : { duration: 700, easing: 'easeInOutQuart' },
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              display: !isPrint,
              position: 'top',
              labels: {
                boxWidth: 30,
                boxHeight: 3,
                padding: 18,
                font: { size: 11, family: "'IBM Plex Sans', sans-serif", weight: '600' },
                usePointStyle: false,
                generateLabels: (chart) => chart.data.datasets.map((ds, i) => ({
                  text: ds.label,
                  fillStyle: 'transparent',
                  strokeStyle: ds.borderColor,
                  lineWidth: 2.5,
                  hidden: !chart.isDatasetVisible(i),
                  datasetIndex: i,
                  lineDash: ds.borderDash || []
                }))
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0,26,64,0.95)',
              titleColor: '#93c5fd',
              bodyColor: '#e2e8f0',
              titleFont: { size: 11, weight: 'bold', family: "'IBM Plex Mono', monospace" },
              bodyFont: { size: 10, family: "'IBM Plex Sans', sans-serif" },
              padding: 12,
              cornerRadius: 6,
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              callbacks: {
                title: (items) => `Flow: ${Number(items[0].parsed.x).toFixed(1)} m³/hr`,
                label: (item) => {
                  const ds    = item.dataset;
                  const isEff = ds.yAxisID === 'yRight';
                  const isPow = ds.label.includes('Power');
                  const unit  = isEff ? ' %' : (isPow ? ' kW' : ' m');
                  const sym   = isEff ? 'η' : (isPow ? 'P' : 'H');
                  return `  ${sym} = ${Number(item.parsed.y).toFixed(1)}${unit}`;
                },
                afterBody: () => '',
              }
            }
          },
          scales: {
            x: {
              type: 'linear',
              min: 0,
              suggestedMax: maxFlow * 1.08,
              title: {
                display: true,
                text: 'Flow Rate  Q  (m³/hr)',
                font: { size: labelFontSize, weight: 'bold', family: "'IBM Plex Sans', sans-serif" },
                color: '#1e293b',
                padding: { top: 8 }
              },
              grid: {
                color: 'rgba(100,116,139,0.12)',
                lineWidth: 1
              },
              ticks: {
                font: { size: tickFontSize, family: "'IBM Plex Mono', monospace" },
                color: '#475569',
                maxTicksLimit: 12
              }
            },
            yLeft: {
              type: 'linear',
              position: 'left',
              min: 0,
              max: maxLeft,
              title: {
                display: true,
                text: 'Head  H  (m)   /   Power  P  (kW)',
                font: { size: labelFontSize, weight: 'bold', family: "'IBM Plex Sans', sans-serif" },
                color: '#003366',
                padding: { bottom: 8 }
              },
              grid: {
                color: 'rgba(0,51,102,0.09)',
                lineWidth: 1
              },
              ticks: {
                font: { size: tickFontSize, family: "'IBM Plex Mono', monospace" },
                color: '#003366',
                maxTicksLimit: 10
              }
            },
            yRight: {
              type: 'linear',
              position: 'right',
              min: 0,
              max: 100,
              title: {
                display: true,
                text: 'Efficiency  η  (%)',
                font: { size: labelFontSize, weight: 'bold', family: "'IBM Plex Sans', sans-serif" },
                color: '#b71c1c',
                padding: { bottom: 8 }
              },
              grid: { drawOnChartArea: false },
              ticks: {
                font: { size: tickFontSize, family: "'IBM Plex Mono', monospace" },
                color: '#b71c1c',
                maxTicksLimit: 10,
                callback: (v) => v + '%'
              }
            }
          }
        }
      };
    }

    // ─── Init / destroy chart ──────────────────────────────────────────────────
    function initCompositeChart(target) {
      const isPrint  = (target === 'print');
      const canvasId = isPrint ? 'compositeChartPrint' : 'compositeChartModal';
      const canvas   = document.getElementById(canvasId);
      if (!canvas) return;

      if (isPrint && charts.print)  { charts.print.destroy();  charts.print  = null; }
      if (!isPrint && charts.modal) { charts.modal.destroy();  charts.modal  = null; }

      const chart = new Chart(canvas, buildCompositeConfig(isPrint));
      if (isPrint) charts.print = chart; else charts.modal = chart;
    }

    // ─── Modal open/close ──────────────────────────────────────────────────────
    function openGraphModal() {
      document.getElementById('graphModal').style.display = 'block';
      setTimeout(() => initCompositeChart('modal'), 120);
    }
    function closeGraphModal() {
      document.getElementById('graphModal').style.display = 'none';
    }

    // ─── Print ────────────────────────────────────────────────────────────────
    function prepareAndPrint() {
      if (charts.print) { charts.print.destroy(); charts.print = null; }

      const pg = document.getElementById('print-graphs-area');
      pg.style.display  = 'block';
      pg.style.position = 'fixed';
      pg.style.top      = '-9999px';
      pg.style.left     = '0';
      pg.style.width    = '900px';
      pg.style.zIndex   = '-1';

      const c = document.getElementById('compositeChartPrint');
      if (c) { c.width = 860; c.height = 460; }

      initCompositeChart('print');

      setTimeout(() => {
        pg.style.position = 'static';
        pg.style.top      = '';
        pg.style.left     = '';
        pg.style.width    = '100%';
        pg.style.zIndex   = '';
        window.print();
      }, 1000);
    }

    window.addEventListener('afterprint', () => {
      const pg = document.getElementById('print-graphs-area');
      pg.style.display  = 'none';
      pg.style.position = '';
    });

    window.onload = () => {};
  </script>
</body>
</html>
