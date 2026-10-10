"use client";
import React, { useState } from "react";
import { jsPDF } from "jspdf";

const DEFAULTS = {
  applicantName: "Mr. Raju Chintamani Dhonde",
  applicantAddress: "2539 C Ward, Shaniwar Peth, Kolhapur, Maharashtra",
  phone: "9881000612",
  currentEmployer: "Kolhapur Mahila Sahakari Bank, Kolhapur",
  experienceYears: "25",
  education: [
    ["B.Com.", "Shivaji University, Kolhapur", "May 1989", "55%"],
    ["H.S.C.", "Kolhapur Board", "March 1986", "54%"],
    ["S.S.C.", "Kolhapur Board", "March 1984", "50%"],
  ],
  dateOfBirth: "15 August 1968",
};

const INITIAL_FORM = {
  bankName: "",
  bankAddress: "",
  officerDesignation: "Chief Executive Officer",
  postName: "Senior Officer (Legal)",
  applicationDate: new Date().toISOString().slice(0, 10),
};

function formatDate(value) {
  if (!value) return "[DD/MM/YYYY]";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function addWrappedText(doc, text, x, y, maxWidth, lineHeight = 5.5) {
  const lines = doc.splitTextToSize(String(text), maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function addPageIfNeeded(doc, y, needed = 15) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed > pageHeight - 18) {
    doc.addPage();
    return 20;
  }
  return y;
}

function drawSectionTitle(doc, title, y) {
  y = addPageIfNeeded(doc, y, 15);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(title, 20, y);
  doc.setLineWidth(0.3);
  doc.line(20, y + 2, 190, y + 2);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  return y + 9;
}

function generatePdf(form, options) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const left = 20;
  const width = 170;
  let y = 18;

  // Application letter
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("From:", left, y);
  doc.setFont("helvetica", "normal");
  y += 6;
  y = addWrappedText(doc, DEFAULTS.applicantName, left, y, width);
  y = addWrappedText(doc, DEFAULTS.applicantAddress, left, y, width);
  y = addWrappedText(doc, `Cell No.: ${DEFAULTS.phone}`, left, y, width);
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Date:", left, y);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(form.applicationDate), left + 13, y);
  y += 9;

  doc.setFont("helvetica", "bold");
  doc.text("To,", left, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  y = addWrappedText(doc, `The ${form.officerDesignation}`, left, y, width);
  y = addWrappedText(doc, form.bankName || "[BANK NAME]", left, y, width);
  y = addWrappedText(doc, form.bankAddress || "[BANK ADDRESS]", left, y, width);
  y += 5;

  doc.setFont("helvetica", "bold");
  y = addWrappedText(
    doc,
    `Subject: Application for the Post of ${form.postName || "[POST NAME]"}`,
    left,
    y,
    width,
  );
  y += 5;
  doc.setFont("helvetica", "normal");
  y = addWrappedText(doc, "Respected Sir/Madam,", left, y, width);
  y += 5;

  const paragraphs = [
    `I wish to submit my application for the post of ${form.postName || "[POST NAME]"} in your esteemed bank.`,
    `I have completed my B.Com. degree from Shivaji University, Kolhapur, in May 1989. At present, I am working as a Senior Officer in the Legal Department of ${DEFAULTS.currentEmployer}. I have ${DEFAULTS.experienceYears} years of experience in the Legal and Recovery Department, particularly in banking recovery, securitisation proceedings, mortgage properties, court matters, and related legal proceedings.`,
    "During my professional career, I have gained extensive experience in handling proceedings under the Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest (SARFAESI) Act, including issuing notices under Sections 13(2) and 13(4), filing applications under Section 14 before the District Collector/JMFC Court for obtaining physical possession of mortgaged properties, handling recovery proceedings before the Authorised Officer/CEO, and managing subsequent sale processes, including tender proceedings and issuance of Sale Certificates.",
    "I also have considerable experience in handling matters before the Debt Recovery Tribunal (DRT), Pune, as well as various civil, criminal, cooperative, and revenue authorities.",
    `With my ${DEFAULTS.experienceYears} years of professional experience, practical knowledge of banking legal matters, recovery procedures, and statutory compliance, I am confident that I can make a valuable contribution to your bank.`,
    `I therefore request you to kindly consider my application for the post of ${form.postName || "[POST NAME]"} and provide me with an opportunity to serve your esteemed organisation. I would welcome the opportunity to discuss my qualifications and professional experience in person.`,
    "My detailed professional experience and personal particulars are provided herewith for your kind consideration.",
  ];

  paragraphs.forEach((paragraph) => {
    y = addPageIfNeeded(doc, y, 20);
    y = addWrappedText(doc, paragraph, left, y, width, 5);
    y += 3;
  });

  y += 2;
  y = addWrappedText(doc, "Thanking you,", left, y, width);
  y += 6;
  y = addWrappedText(doc, "Yours faithfully,", left, y, width);
  y += 12;
  doc.setFont("helvetica", "bold");
  y = addWrappedText(doc, DEFAULTS.applicantName, left, y, width);
  doc.setFont("helvetica", "normal");

  // Professional experience
  if (options.includeExperience) {
    doc.addPage();
    y = 20;
    y = drawSectionTitle(doc, "NATURE OF WORK / PROFESSIONAL EXPERIENCE", y);

    const sections = [
      {
        title: "A) SARFAESI Act and Recovery Proceedings",
        items: [
          "Handling proceedings under the SARFAESI Act, including issuance of notices under Sections 13(2) and 13(4).",
          "Filing applications under Section 14 before the District Collector/JMFC Court for obtaining physical possession of mortgaged properties.",
          "Handling recovery proceedings before the Authorised Officer/CEO.",
          "Handling the sale process of secured/mortgaged properties, including tenders and related documentation.",
          "Experience in SARFAESI proceedings from issuance of the Section 13(2) notice through execution/issuance of the Sale Certificate.",
          `${DEFAULTS.experienceYears} years of experience in recovery and legal proceedings.`,
          "Experience in matters before the Debt Recovery Tribunal (DRT), Pune.",
          "Currently working as a Senior Officer in the Legal Department.",
        ],
      },
      {
        title: "B) Mortgage Property and Criminal/Cheque Bounce Matters",
        items: [
          "Obtaining online information and records relating to mortgaged properties.",
          "Handling property-related legal disputes and documentation.",
          "Handling private criminal complaints relating to cheating offences under applicable law.",
          "Handling applications under Section 156(3) of the CrPC or corresponding applicable provisions, subject to transitional law.",
          "Handling cheque dishonour cases under Section 138 of the Negotiable Instruments Act and related proceedings.",
        ],
      },
      {
        title: "C) Property and Revenue Matters",
        items: [
          "Handling property-related disputes and matters before the City Survey Office.",
          "Verification and collection of property-related records and information.",
          "Handling legal matters concerning mortgage and secured properties.",
        ],
      },
      {
        title: "D) Courts and Government Offices",
        items: [
          "Kolhapur Co-operative Court",
          "Pune Appellate Court",
          "Debt Recovery Tribunal (DRT), Pune",
          "Kolhapur Civil Court",
          "Kolhapur Criminal Court",
          "District & Sessions Court",
          "City Survey Office",
          "District Deputy Registrar Office",
          "District Superintendent of Land Records / Bhumi Adhikshak Office",
          "District Superintendent of Police (SP) Office",
          "Various police stations and other government/revenue authorities as required in legal and recovery matters.",
        ],
      },
    ];

    sections.forEach((section) => {
      y = addPageIfNeeded(doc, y, 14);
      doc.setFont("helvetica", "bold");
      y = addWrappedText(doc, section.title, left, y, width, 5);
      y += 1;
      doc.setFont("helvetica", "normal");
      section.items.forEach((item) => {
        y = addPageIfNeeded(doc, y, 12);
        const lines = doc.splitTextToSize(`• ${item}`, width - 4);
        doc.text(lines, left + 3, y);
        y += lines.length * 5 + 1;
      });
      y += 3;
    });

    y = addPageIfNeeded(doc, y, 25);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.text("Yours faithfully,", left, y);
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.text(DEFAULTS.applicantName, left, y);
    doc.setFont("helvetica", "normal");
    y += 6;
    doc.text(`Date: ${formatDate(form.applicationDate)}`, left, y);
  }

  // Personal particulars
  if (options.includePersonal) {
    doc.addPage();
    y = 20;
    y = drawSectionTitle(doc, "PERSONAL PARTICULARS", y);
    doc.setFont("helvetica", "bold");
    y = addWrappedText(doc, "EDUCATIONAL QUALIFICATIONS", left, y, width);
    y += 4;

    const cols = [left, 47, 104, 145];
    const rowHeight = 9;
    const headers = [
      "Course",
      "Institution / Board",
      "Year of Passing",
      "Percentage",
    ];
    doc.setFont("helvetica", "bold");
    headers.forEach((header, i) =>
      doc.text(header, cols[i], y, { maxWidth: i === 1 ? 54 : 42 }),
    );
    y += 4;
    doc.line(left, y, 190, y);
    y += 5;
    doc.setFont("helvetica", "normal");

    DEFAULTS.education.forEach((row) => {
      y = addPageIfNeeded(doc, y, rowHeight);
      row.forEach((value, i) =>
        doc.text(value, cols[i], y, { maxWidth: i === 1 ? 54 : 42 }),
      );
      y += rowHeight;
    });

    y += 5;
    y = drawSectionTitle(doc, "PERSONAL DETAILS", y);
    const details = [
      ["Full Name", DEFAULTS.applicantName],
      ["Address", DEFAULTS.applicantAddress],
      ["Cell No.", DEFAULTS.phone],
      ["Date of Birth", DEFAULTS.dateOfBirth],
      ["Sex", "Male"],
      ["Marital Status", "Married"],
      ["Nationality", "Indian"],
      ["Languages Known", "English, Marathi and Hindi"],
    ];
    details.forEach(([label, value]) => {
      y = addPageIfNeeded(doc, y, 9);
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, left, y);
      doc.setFont("helvetica", "normal");
      y = addWrappedText(doc, value, 58, y, 132, 5);
      y += 3;
    });

    y = addPageIfNeeded(doc, y, 25);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text("Yours faithfully,", left, y);
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.text(DEFAULTS.applicantName, left, y);
    doc.setFont("helvetica", "normal");
    y += 6;
    doc.text(`Date: ${formatDate(form.applicationDate)}`, left, y);
  }

  // Add page numbers to every page.
  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Page ${page} of ${totalPages}`, 190, 287, { align: "right" });
  }

  const safeBankName = (form.bankName || "Bank").replace(/[^a-z0-9-_]+/gi, "_");
  doc.save(
    `Application_${safeBankName}_${formatDate(form.applicationDate).replaceAll("/", "-")}.pdf`,
  );
}

export default function ApplicationGenerator() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [includeExperience, setIncludeExperience] = useState(true);
  const [includePersonal, setIncludePersonal] = useState(true);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (
      !form.bankName.trim() ||
      !form.bankAddress.trim() ||
      !form.officerDesignation.trim() ||
      !form.postName.trim()
    ) {
      setError(
        "Please fill in the bank name, bank address, officer designation, and post name.",
      );
      return;
    }
    setError("");
    generatePdf(form, { includeExperience, includePersonal });
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            PDF document generator
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Bank Job Application
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter the bank details below. Your fixed personal information and
            experience will be added automatically.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <section>
            <h2 className="text-base font-semibold">Bank details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="bankName">
                  Bank name *
                </label>
                <input
                  id="bankName"
                  className={inputClass}
                  value={form.bankName}
                  onChange={(e) => update("bankName", e.target.value)}
                  placeholder="e.g. Kolhapur Urban Co-operative Bank Ltd."
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="bankAddress">
                  Bank address *
                </label>
                <textarea
                  id="bankAddress"
                  className={inputClass}
                  rows={2}
                  value={form.bankAddress}
                  onChange={(e) => update("bankAddress", e.target.value)}
                  placeholder="Official bank / head office address"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="officerDesignation">
                  To — Recipient designation *
                </label>
                <input
                  id="officerDesignation"
                  className={inputClass}
                  list="officerDesignationOptions"
                  value={form.officerDesignation}
                  onChange={(e) => update("officerDesignation", e.target.value)}
                  placeholder="Select or type a designation"
                  autoComplete="off"
                />
                <datalist id="officerDesignationOptions">
                  <option value="Chief Executive Officer" />
                  <option value="Chairman" />
                  <option value="Managing Director" />
                  <option value="General Manager" />
                  <option value="Human Resources Manager" />
                  <option value="Recruitment Officer" />
                </datalist>
              </div>
              <div>
                <label className={labelClass} htmlFor="postName">
                  Post applied for *
                </label>
                <input
                  id="postName"
                  className={inputClass}
                  value={form.postName}
                  onChange={(e) => update("postName", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="applicationDate">
                  Application date *
                </label>
                <input
                  id="applicationDate"
                  type="date"
                  className={inputClass}
                  value={form.applicationDate}
                  onChange={(e) => update("applicationDate", e.target.value)}
                  required
                />
              </div>
            </div>
          </section>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-none stroke-current"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3"
              />
            </svg>
            Generate &amp; Download PDF
          </button>
        </form>
      </div>
    </main>
  );
}
