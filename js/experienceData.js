// Hand-maintained "Experience" data — update this file whenever your LinkedIn
// work history changes. There is no public LinkedIn API for pulling this
// automatically, so this file is the single source of truth the site renders
// from instead of hardcoded HTML.

var EXPERIENCE = [
    {
        title: 'IT Assistant',
        company: 'Meadows Center, Texas State University',
        startDate: '02/2023',
        endDate: 'Present',
        bullets: [
            'Installed, set up, and configured WeeWX on an Intel NUC and a Davis Vantage Pro 2 station.',
            'Managed Apache and FTP for device backup, improved data accuracy and reporting efficiency.'
        ]
    },
    {
        title: 'IT Technician',
        company: 'QASystems, AISD Contractor',
        startDate: '03/2024',
        endDate: '01/2025',
        bullets: [
            'Provided Tier 1 hardware support with a primary focus on repairing Chromebooks.',
            'Diagnosed and resolved hardware issues efficiently, performed quality control (QC) checks, sorted inventory, and managed various other projects as assigned.',
            'Maintained accurate records using advanced inventory management software to ensure seamless operations.'
        ]
    },
    {
        title: 'Computer Technician',
        company: 'GTS Technologies',
        startDate: '06/2023',
        endDate: '09/2023',
        bullets: [
            'Conducted Quality Assurance on Chromebooks, iPads, and other devices.',
            'Led the update of Inventory Management Software and Database Management System, ensuring smooth network operations.'
        ]
    }
];

if (typeof module !== 'undefined') {
    module.exports = { EXPERIENCE: EXPERIENCE };
}

if (typeof window !== 'undefined') {
    window.EXPERIENCE = EXPERIENCE;
}
